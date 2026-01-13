const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createResponse } = require('./utils/response');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// ======================
// API HANDLER LOADING
// ======================
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
                    console.log(`✅ Loaded: ${endpointPath}`);
                } catch (error) {
                    console.error(`❌ Failed to load ${endpointPath}:`, error.message);
                }
            }
        });
    }

    scanDirectory(apiDir);
}

// ======================
// ROUTE SETUP
// ======================
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

// ======================
// API INFO ENDPOINT
// ======================
app.get('/api', (req, res) => {
    const endpoints = Object.keys(apiHandlers).map(endpoint => ({
        endpoint: endpoint,
        category: endpoint.split('/')[2] || 'tools',
        method: 'GET'
    }));

    res.json(createResponse({
        success: true,
        name: "Megan API",
        version: "2.0.0",
        author: "Tracker Wanga",
        endpoints: endpoints,
        total_endpoints: endpoints.length,
        contact: {
            whatsapp: "https://wa.me/254769502217",
            email: "contact@megan.co.ke",
            website: "https://api.megan.co.ke"
        }
    }, '/api', req.query, Date.now()));
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
        version: '2.0.0'
    });
});

// ======================
// DASHBOARD
// ======================
app.get('/', (req, res) => {
    const endpoints = Object.keys(apiHandlers);
    
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Megan API v2.0</title>
    <style>
        body { font-family: Arial; margin: 40px; background: #0f172a; color: white; }
        .container { max-width: 1200px; margin: 0 auto; }
        .logo { color: #3b82f6; font-size: 2.5rem; font-weight: bold; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat { background: #1e293b; padding: 20px; border-radius: 10px; text-align: center; }
        .endpoint-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; margin: 30px 0; }
        .endpoint { background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155; }
        .endpoint:hover { border-color: #3b82f6; }
        .endpoint-code { background: #0f172a; color: #60a5fa; padding: 5px 10px; border-radius: 4px; font-family: monospace; }
        .test-btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px; }
        .footer { margin-top: 40px; text-align: center; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">MEGAN API</div>
        <p>Complete Developer Platform • By Wanga</p>
        
        <div class="stats">
            <div class="stat">
                <h3>${endpoints.length}</h3>
                <p>Endpoints</p>
            </div>
            <div class="stat">
                <h3>100%</h3>
                <p>Uptime</p>
            </div>
            <div class="stat">
                <h3>Unlimited</h3>
                <p>Free Tier</p>
            </div>
        </div>
        
        <div class="endpoint-grid">
            ${endpoints.slice(0, 12).map(ep => {
                const name = ep.split('/').pop();
                return `
                <div class="endpoint">
                    <h4>${name}</h4>
                    <div class="endpoint-code">GET ${ep}</div>
                    <button class="test-btn" onclick="window.open('${ep}?test=true', '_blank')">
                        Test API
                    </button>
                </div>`;
            }).join('')}
        </div>
        
        <div class="footer">
            <p>📚 <a href="/api" style="color: #60a5fa;">API Documentation</a></p>
            <p>🏥 <a href="/health" style="color: #60a5fa;">Server Health</a></p>
            <p>© 2024 Megan API | Created by Tracker Wanga</p>
        </div>
    </div>
</body>
</html>
    `);
});

// ======================
// 404 HANDLER
// ======================
app.use('*', (req, res) => {
    if (req.accepts('html')) {
        res.send('Page not found. Visit <a href="/">Home</a>');
    } else {
        res.json({
            success: false,
            error: 'Route not found',
            available_endpoints: Object.keys(apiHandlers)
        });
    }
});

// ======================
// INITIALIZE
// ======================
loadAPIHandlers();
setupRoutes();

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║                🚀 Megan API v2.0.0                   ║
╠══════════════════════════════════════════════════════╣
║ Port:        ${PORT}                                    ║
║ Endpoints:   ${Object.keys(apiHandlers).length} loaded            ║
║ Rate Limit:  Unlimited (Testing)                     ║
║ URL:         http://localhost:${PORT}                  ║
║ API Docs:    http://localhost:${PORT}/api              ║
╚══════════════════════════════════════════════════════╝
    `);
});