const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { createResponse } = require('./utils/response');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// RATE LIMITING CONFIG
// ======================

// Free tier: 500 requests per hour
const freeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        error: 'Rate limit exceeded',
        message: 'Free tier limit: 500 requests per hour',
        upgrade_url: 'https://api.megan.co.ke/upgrade'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Admin/Whitelist tier (unlimited)
const adminLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000000, // Basically unlimited
    message: {
        success: false,
        error: 'Admin rate limit exceeded'
    },
    skip: (req) => {
        // Check for admin/whitelist tokens
        return req.path.includes('/api/wanga~') || req.path.includes('/api/admin/');
    }
});

// ======================
// MIDDLEWARE
// ======================

app.use(express.json({ limit: '10mb' }));
app.use(require('cors')());
app.use(require('helmet')());
app.use(require('morgan')('dev'));

// ======================
// STATIC FILES (Frontend)
// ======================

const publicDir = path.join(__dirname, 'public');

// Serve static files with clean URLs
app.use(express.static(publicDir, {
    maxAge: '1d',
    extensions: ['html'], // Auto-add .html extension
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.set('Cache-Control', 'no-cache');
        }
    }
}));

// Serve index.html for root paths
const serveIndex = (req, res, folder) => {
    const indexPath = path.join(publicDir, folder, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Page not found');
    }
};

// Route handlers for clean URLs
app.get('/', (req, res) => serveIndex(req, res, ''));
app.get('/dashboard', (req, res) => serveIndex(req, res, 'dashboard'));
app.get('/wanga', (req, res) => serveIndex(req, res, 'wanga'));
app.get('/admin', (req, res) => serveIndex(req, res, 'admin'));
app.get('/api-test', (req, res) => serveIndex(req, res, 'api-test'));
app.get('/upgrade', (req, res) => serveIndex(req, res, 'upgrade'));

// ======================
// ADMIN/WHITELIST ROUTING
// ======================

// Whitelist pattern: /api/wanga~{token}/{category}/{endpoint}
app.get('/api/wanga~:token/*', adminLimiter, async (req, res) => {
    const startTime = Date.now();
    const token = req.params.token;
    const restOfPath = req.params[0]; // The part after the token
    
    // Extract endpoint from path
    const pathParts = restOfPath.split('/');
    const category = pathParts[0];
    const endpoint = pathParts[1];
    
    // Validate admin token (in production, check against database)
    const isValidToken = await validateAdminToken(token);
    
    if (!isValidToken) {
        const response = createResponse({
            success: false,
            error: 'Invalid admin token',
            code: 'INVALID_TOKEN'
        }, req.path, req.query, startTime);
        return res.status(401).json(response);
    }
    
    try {
        // Try to load the handler
        let handler;
        try {
            handler = require(`./api/${category}/${endpoint}`);
        } catch {
            // Try with .js extension
            handler = require(`./api/${category}/${endpoint}.js`);
        }
        
        const result = await handler(req, res, startTime);
        const response = createResponse({
            ...result,
            admin_access: true,
            token_used: token,
            rate_limit: 'unlimited'
        }, `/api/${category}/${endpoint}`, req.query, startTime);
        
        res.json(response);
    } catch (error) {
        const response = createResponse({
            success: false,
            error: `Endpoint not found: ${category}/${endpoint}`,
            admin_access: true
        }, req.path, req.query, startTime);
        res.status(404).json(response);
    }
});

async function validateAdminToken(token) {
    // In production, check against database
    // For now, accept any token that matches pattern
    return /^[a-zA-Z0-9]{8,}$/.test(token);
}

// ======================
// STANDARD API ROUTING
// ======================

const apiHandlers = {};

function loadAPIHandlers() {
    const apiDir = path.join(__dirname, 'api');
    
    function scanDirectory(dir, prefix = '') {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        items.forEach(item => {
            const fullPath = path.join(dir, item.name);
            
            if (item.isDirectory()) {
                scanDirectory(fullPath, `${prefix}${item.name}/`);
            } else if (item.name.endsWith('.js')) {
                const endpointName = path.basename(item.name, '.js');
                const endpointPath = `/api/${prefix}${endpointName}`;
                
                try {
                    const handler = require(fullPath);
                    apiHandlers[endpointPath] = handler;
                    console.log(`✅ Loaded: ${endpointPath}`);
                } catch (error) {
                    console.error(`❌ Failed: ${endpointPath}`, error.message);
                }
            }
        });
    }
    
    scanDirectory(apiDir);
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
                        limit: 500,
                        remaining: req.rateLimit?.remaining || 500
                    }
                }, endpoint, req.query, startTime);
                
                res.json(response);
            } catch (error) {
                const response = createResponse({
                    success: false,
                    error: `Internal error: ${error.message}`
                }, endpoint, req.query, startTime);
                res.status(500).json(response);
            }
        });
    });
}

// ======================
// API INFO & HEALTH
// ======================

app.get('/api', freeLimiter, (req, res) => {
    const endpoints = Object.keys(apiHandlers).map(endpoint => ({
        endpoint: endpoint,
        category: endpoint.split('/')[2] || 'tools',
        method: 'GET',
        admin_access: `/api/wanga~{token}${endpoint}`
    }));
    
    const categories = {};
    endpoints.forEach(ep => {
        if (!categories[ep.category]) categories[ep.category] = [];
        categories[ep.category].push(ep);
    });
    
    res.json(createResponse({
        success: true,
        name: 'Megan API',
        version: '2.0.0',
        endpoints_count: endpoints.length,
        categories: categories,
        rate_limits: {
            free: '500 requests/hour',
            admin: 'Unlimited (with token)',
            upgrade: 'https://api.megan.onrender.com/upgrade'
        }
    }, '/api', req.query, Date.now()));
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '2.0.0',
        node: process.version
    });
});

// ======================
// ERROR HANDLING
// ======================

app.get('/api/*', (req, res) => {
    const response = createResponse({
        success: false,
        error: 'API endpoint not found',
        available: Object.keys(apiHandlers)
    }, req.path, req.query, Date.now());
    res.status(404).json(response);
});

// 404 for all other routes
app.use((req, res) => {
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(publicDir, '404.html'));
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

// ======================
// INITIALIZE & START
// ======================

// Create required directories
const requiredDirs = [
    'public', 'public/dashboard', 'public/wanga', 'public/admin', 
    'public/api-test', 'public/assets/css', 'public/assets/js',
    'public/components', 'public/assets/images'
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

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Megan API running on port ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`👑 Admin: http://localhost:${PORT}/admin`);
    console.log(`🔧 API Test: http://localhost:${PORT}/api-test`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api`);
    console.log(`\n📋 Loaded ${Object.keys(apiHandlers).length} API endpoints`);
    console.log(`⚡ Rate limits: Free=500/hour, Admin=Unlimited`);
});