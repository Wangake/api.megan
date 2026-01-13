const express = require('express');
const fs = require('fs');
const path = require('path');
const { createResponse } = require('./utils/response');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Load all API handlers dynamically
const apiHandlers = {};

function loadAPIHandlers() {
    const apiDir = path.join(__dirname, 'api');

    // Recursively find all .js files in api directory
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
        example: `https://${req.headers.host}${endpoint}?param=value`
    }));

    res.json(createResponse({
        success: true,
        message: "Megan API",
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

// Serve dashboard from public/index.html
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // Fallback to simple HTML if index.html doesn't exist
        const html = `<!DOCTYPE html>
<html>
<head>
    <title>Megan API</title>
    <style>
        body { font-family: Arial; padding: 20px; max-width: 1000px; margin: auto; background: #0f172a; color: white; }
        .logo { color: #3b82f6; font-size: 2.5rem; font-weight: bold; margin-bottom: 10px; }
        .message { background: #1e293b; padding: 20px; border-radius: 5px; margin: 20px 0; }
        a { color: #60a5fa; }
    </style>
</head>
<body>
    <div class="logo">MEGAN API</div>
    <p>Complete Developer Platform • By Wanga</p>
    
    <div class="message">
        <p>The main dashboard is located at <code>public/index.html</code></p>
        <p>Please make sure the file exists in the public directory.</p>
    </div>
    
    <p><a href="/api">View all endpoints as JSON</a></p>
    <p><a href="/health">Health Check</a></p>
</body>
</html>`;
        res.send(html);
    }
});

// Initialize
loadAPIHandlers();
setupRoutes();

// Start server
app.listen(PORT, () => {
    console.log(`\n✅ Megan API running on port ${PORT}`);
    console.log(`📌 Dashboard: http://localhost:${PORT}`);
    console.log(`📚 Loaded ${Object.keys(apiHandlers).length} API endpoints`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});