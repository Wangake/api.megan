/**
 * Megan API Server - Professional Version
 * 100 requests/hour free tier
 * Clean responses
 * Production ready
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config/config');
const { createResponse, errorResponse } = require('./utils/response');
const fetchWrapper = require('./utils/fetchWrapper');

// Initialize Express
const app = express();
const PORT = config.port;

// ======================
// RATE LIMITING CONFIG
// ======================

// Free tier: 100 requests per hour (not 500)
const freeLimiter = rateLimit({
    windowMs: config.rateLimit.free.windowMs,
    max: config.rateLimit.free.max,
    message: createResponse({
        success: false,
        error: 'Rate limit exceeded',
        message: `Free tier limit: ${config.rateLimit.free.max} requests per hour`,
        upgrade_url: 'https://api.megan.co.ke/upgrade'
    }),
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.includes('/health') || req.path.includes('/api/wanga~')
});

// Admin tier: 10,000 requests per hour (effectively unlimited)
const adminLimiter = rateLimit({
    windowMs: config.rateLimit.admin.windowMs,
    max: config.rateLimit.admin.max,
    message: createResponse({
        success: false,
        error: 'Admin rate limit exceeded'
    })
});

// ======================
// MIDDLEWARE
// ======================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
if (config.security.helmetEnabled) {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
                scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
                imgSrc: ["'self'", "data:", "https://files.catbox.moe"]
            }
        }
    }));
}

// CORS
app.use(cors({
    origin: config.security.corsOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })
    }));
}

// ======================
// STATIC FILES
// ======================

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.set('Cache-Control', 'no-cache');
        }
    }
}));

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// ======================
// API HANDLER LOADING
// ======================

const apiHandlers = {};
const apiCategories = {};

function loadAPIHandlers() {
    const apiDir = path.join(__dirname, 'api');
    
    if (!fs.existsSync(apiDir)) {
        console.warn('⚠️  No API directory found');
        return;
    }

    // Scan for category directories
    const categories = fs.readdirSync(apiDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    categories.forEach(category => {
        const categoryDir = path.join(apiDir, category);
        const endpoints = fs.readdirSync(categoryDir)
            .filter(file => file.endsWith('.js'))
            .map(file => path.basename(file, '.js'));

        apiCategories[category] = endpoints;

        endpoints.forEach(endpoint => {
            const endpointPath = `/api/${category}/${endpoint}`;
            const handlerPath = path.join(categoryDir, `${endpoint}.js`);
            
            try {
                const handler = require(handlerPath);
                apiHandlers[endpointPath] = handler;
                console.log(`✅ Loaded: ${endpointPath}`);
            } catch (error) {
                console.error(`❌ Failed to load ${endpointPath}:`, error.message);
            }
        });
    });
}

function setupRoutes() {
    Object.keys(apiHandlers).forEach(endpoint => {
        app.get(endpoint, freeLimiter, async (req, res) => {
            const startTime = Date.now();

            try {
                const result = await apiHandlers[endpoint](req, res, startTime);
                const response = createResponse({
                    ...result,
                    rate_limit: {
                        tier: 'free',
                        limit: config.rateLimit.free.max,
                        remaining: req.rateLimit?.remaining || config.rateLimit.free.max
                    }
                }, endpoint, req.query, startTime);

                res.json(response);
            } catch (error) {
                console.error(`Error in ${endpoint}:`, error);
                const response = createResponse({
                    success: false,
                    error: `Internal server error: ${error.message}`
                }, endpoint, req.query, startTime);
                res.status(500).json(response);
            }
        });
    });
}

// ======================
// ADMIN/WHITELIST ROUTING
// ======================

app.get('/api/wanga~:token/*', adminLimiter, async (req, res) => {
    const startTime = Date.now();
    const token = req.params.token;
    const restOfPath = req.params[0];

    // Validate admin token
    if (!config.admin.tokens.includes(token)) {
        const response = createResponse({
            success: false,
            error: 'Invalid admin token',
            code: 'INVALID_TOKEN'
        }, req.path, req.query, startTime);
        return res.status(401).json(response);
    }

    const pathParts = restOfPath.split('/');
    const category = pathParts[0];
    const endpoint = pathParts[1];

    const endpointPath = `/api/${category}/${endpoint}`;
    const handler = apiHandlers[endpointPath];

    if (!handler) {
        const response = createResponse({
            success: false,
            error: `Endpoint not found: ${category}/${endpoint}`,
            admin_access: true
        }, req.path, req.query, startTime);
        return res.status(404).json(response);
    }

    try {
        const result = await handler(req, res, startTime);
        const response = createResponse({
            ...result,
            admin_access: true,
            token_used: token,
            rate_limit: {
                tier: 'admin',
                limit: config.rateLimit.admin.max,
                remaining: req.rateLimit?.remaining || config.rateLimit.admin.max
            }
        }, endpointPath, req.query, startTime);

        res.json(response);
    } catch (error) {
        const response = createResponse({
            success: false,
            error: `Internal error: ${error.message}`,
            admin_access: true
        }, req.path, req.query, startTime);
        res.status(500).json(response);
    }
});

// ======================
// API INFO ENDPOINT
// ======================

app.get('/api', freeLimiter, (req, res) => {
    const startTime = Date.now();
    
    const endpoints = Object.keys(apiHandlers).map(endpoint => ({
        endpoint: endpoint,
        category: endpoint.split('/')[2],
        method: 'GET',
        admin_access: `/api/wanga~{token}${endpoint}`
    }));

    const categories = {};
    endpoints.forEach(ep => {
        if (!categories[ep.category]) categories[ep.category] = [];
        categories[ep.category].push(ep.endpoint);
    });

    const response = createResponse({
        name: config.api.name,
        version: config.api.version,
        author: config.api.author,
        endpoints_count: endpoints.length,
        categories: Object.keys(categories).reduce((acc, category) => {
            acc[category] = categories[category].length;
            return acc;
        }, {}),
        rate_limits: {
            free: `${config.rateLimit.free.max} requests/hour`,
            admin: 'Unlimited (with token)'
        },
        documentation: config.api.documentation,
        contact: config.api.contact
    }, '/api', req.query, startTime);

    res.json(response);
});

// ======================
// HEALTH CHECK
// ======================

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: config.api.version,
        node: process.version,
        memory: process.memoryUsage()
    });
});

// ======================
// 404 HANDLING
// ======================

app.get('/api/*', (req, res) => {
    const startTime = Date.now();
    const response = createResponse({
        success: false,
        error: 'API endpoint not found',
        hint: 'Visit /api for available endpoints'
    }, req.path, req.query, startTime);
    res.status(404).json(response);
});

app.use('*', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(publicDir, 'index.html'));
    } else {
        const response = createResponse({
            success: false,
            error: 'Route not found'
        }, req.path, req.query, Date.now());
        res.status(404).json(response);
    }
});

// ======================
// ERROR HANDLING MIDDLEWARE
// ======================

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    const response = createResponse({
        success: false,
        error: 'Internal server error'
    }, req.path, req.query, Date.now());
    
    res.status(500).json(response);
});

// ======================
// INITIALIZE & START
// ======================

// Create required directories
const requiredDirs = [
    'api',
    'api/tools',
    'api/validator',
    'api/generators',
    'api/web',
    'api/time',
    'api/ai',
    'api/image',
    'api/youtube',
    'api/spotify',
    'api/social',
    'public',
    'public/assets/css',
    'public/assets/js',
    'public/assets/images',
    'logs',
    'config'
];

requiredDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created: ${dir}`);
    }
});

// Load API handlers
loadAPIHandlers();
setupRoutes();

// Set global endpoints count
global.apiEndpointsCount = Object.keys(apiHandlers).length;

// Start server
const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║                🚀 Megan API v${config.api.version}                ║
╠══════════════════════════════════════════════════════╣
║ Port:        ${PORT}                                    ║
║ Environment: ${config.nodeEnv}                          ║
║ Endpoints:   ${Object.keys(apiHandlers).length} loaded            ║
║ Rate Limit:  ${config.rateLimit.free.max}/hour (Free)             ║
║ URL:         http://localhost:${PORT}                  ║
║ API Docs:    http://localhost:${PORT}/api              ║
╚══════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

module.exports = app;