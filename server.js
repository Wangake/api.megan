/**
 * Megan API Server - Working Version
 * NO RATE LIMITING - Test if APIs work first
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createResponse } = require('./utils/response');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// MIDDLEWARE
// ======================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable for simplicity
}));

// CORS
app.use(cors());

// Logging
app.use(morgan('dev'));

// ======================
// STATIC FILES
// ======================

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// ======================
// API HANDLER LOADING
// ======================

const apiHandlers = {};

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
        
        // Check if directory exists
        if (!fs.existsSync(categoryDir)) {
            console.log(`📁 Creating category: ${category}`);
            fs.mkdirSync(categoryDir, { recursive: true });
            return;
        }

        const endpoints = fs.readdirSync(categoryDir)
            .filter(file => file.endsWith('.js'))
            .map(file => path.basename(file, '.js'));

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
        app.get(endpoint, async (req, res) => {  // NO RATE LIMITER!
            const startTime = Date.now();

            try {
                const result = await apiHandlers[endpoint](req, res, startTime);
                
                // Handle different response types
                if (result && result.success === false) {
                    // Error response
                    const response = createResponse(result, endpoint, req.query, startTime);
                    res.status(400).json(response);
                } else if (result && result.image) {
                    // Image response
                    const base64Data = result.image.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    res.set('Content-Type', 'image/png');
                    res.send(buffer);
                } else {
                    // Normal JSON response
                    const response = createResponse({
                        success: true,
                        ...result
                    }, endpoint, req.query, startTime);
                    res.json(response);
                }
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
// API INFO ENDPOINT
// ======================

app.get('/api', (req, res) => {
    const startTime = Date.now();

    const endpoints = Object.keys(apiHandlers).map(endpoint => ({
        endpoint: endpoint,
        category: endpoint.split('/')[2] || 'tools',
        method: 'GET'
    }));

    const categories = {};
    endpoints.forEach(ep => {
        const cat = ep.category;
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(ep.endpoint);
    });

    const response = createResponse({
        name: "Megan API",
        version: "2.0.0",
        author: "Wanga",
        endpoints_count: endpoints.length,
        categories: categories,
        contact: {
            whatsapp: "https://wa.me/254769502217",
            email: "contact@megan.co.ke",
            website: "https://api.megan.co.ke"
        }
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
        endpoints_loaded: Object.keys(apiHandlers).length,
        node: process.version
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
        available_endpoints: Object.keys(apiHandlers)
    }, req.path, req.query, startTime);
    res.status(404).json(response);
});

// ======================
// INITIALIZE & START
// ======================

// Create required directories
const requiredDirs = [
    'api',
    'api/tools',
    'public'
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
    console.log(`
╔══════════════════════════════════════════════════════╗
║                🚀 Megan API v2.0.0                   ║
╠══════════════════════════════════════════════════════╣
║ Port:        ${PORT}                                    ║
║ Endpoints:   ${Object.keys(apiHandlers).length} loaded            ║
║ Rate Limit:  NONE (Testing Mode)                     ║
║ URL:         http://localhost:${PORT}                  ║
║ API Docs:    http://localhost:${PORT}/api              ║
╚══════════════════════════════════════════════════════╝
    `);
});