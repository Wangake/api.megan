const express = require('express');
const fs = require('fs');
const path = require('path');
const { createResponse } = require('./utils/response');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(require('cors')());
app.use(require('helmet')());
app.use(require('morgan')('dev'));

// Load all API handlers dynamically
const apiHandlers = {};

function loadAPIHandlers() {
    const apiDir = path.join(__dirname, 'api');
    
    function scanDirectory(dir, prefix = '') {
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
                    console.log(`✅ Loaded API: ${endpointPath}`);
                } catch (error) {
                    console.error(`❌ Failed to load ${endpointPath}:`, error.message);
                }
            }
        });
    }
    
    scanDirectory(apiDir);
}

// Create routes dynamically
function setupRoutes() {
    Object.keys(apiHandlers).forEach(endpoint => {
        app.get(endpoint, async (req, res) => {
            const startTime = Date.now();
            
            try {
                const result = await apiHandlers[endpoint](req, res, startTime);
                const response = createResponse(result, endpoint, req.query, startTime);
                res.json(response);
            } catch (error) {
                const errorResponse = createResponse({
                    success: false,
                    error: `Internal server error: ${error.message}`
                }, endpoint, req.query, startTime);
                res.status(500).json(errorResponse);
            }
        });
    });
}

// API Info endpoint
app.get('/api', (req, res) => {
    const endpoints = Object.keys(apiHandlers).map(endpoint => ({
        endpoint: endpoint,
        method: 'GET',
        example: `http://${req.headers.host}${endpoint}?param=value`
    }));
    
    res.json(createResponse({
        success: true,
        message: "MegaDownload API",
        endpoints: endpoints,
        total_endpoints: endpoints.length
    }, '/api', req.query, Date.now()));
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        endpoints_loaded: Object.keys(apiHandlers).length
    });
});

// Dashboard
app.get('/', (req, res) => {
    const endpoints = Object.keys(apiHandlers);
    
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>MegaDownload API</title>
    <style>
        body { font-family: Arial; padding: 20px; max-width: 1000px; margin: auto; }
        .endpoint { background: #1a1a1a; color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        code { background: #333; color: #00ff88; padding: 2px 5px; border-radius: 3px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }
    </style>
</head>
<body>
    <h1>🚀 MegaDownload API</h1>
    <p>Modular API System with ${endpoints.length} endpoints</p>
    
    <div class="grid">
        ${endpoints.map(ep => `
        <div class="endpoint">
            <h3>${ep.split('/').pop()}</h3>
            <code>GET ${ep}</code><br>
            <a href="${ep}?test=true" target="_blank">Test Endpoint</a>
        </div>
        `).join('')}
    </div>
    
    <p><a href="/api">View all endpoints as JSON</a></p>
    <p><a href="/health">Health Check</a></p>
</body>
</html>`;
    
    res.send(html);
});

// Initialize
loadAPIHandlers();
setupRoutes();

// Start server
app.listen(PORT, () => {
    console.log(`\n✅ MegaDownload API running on port ${PORT}`);
    console.log(`📌 Dashboard: http://localhost:${PORT}`);
    console.log(`📚 Loaded ${Object.keys(apiHandlers).length} API endpoints`);
    console.log(`\n📋 Available Endpoints:`);
    Object.keys(apiHandlers).forEach(ep => {
        console.log(`   🔗 ${ep}`);
    });
});
