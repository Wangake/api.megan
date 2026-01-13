const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Info
  api: {
    name: process.env.API_NAME || 'Megan API',
    version: process.env.API_VERSION || '2.0.0',
    author: 'Wanga',
    contact: {
      whatsapp: 'Channel WhatsApp',
      whatsapp_group: 'https://chat.whatsapp.com/FtKp4i086Xc0X91t1MTjrU',
      email: process.env.API_CONTACT_EMAIL || 'contact@megan.co.ke',
      website: process.env.API_WEBSITE || 'https://api.megan.co.ke'
    },
    status: 'active',
    documentation: process.env.API_DOCS_URL || 'https://api.megan.co.ke/docs'
  },
  
  // Rate Limiting
  rateLimit: {
    free: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000, // 1 hour
      max: parseInt(process.env.RATE_LIMIT_FREE) || 100
    },
    admin: {
      windowMs: 3600000,
      max: 10000 // Unlimited for admins
    }
  },
  
  // Security
  security: {
    corsOrigin: process.env.CORS_ORIGIN || '*',
    helmetEnabled: process.env.HELMET_ENABLED !== 'false'
  },
  
  // External APIs
  externalApis: {
    elite: {
      baseUrl: process.env.ELITE_API_BASE || 'https://eliteprotech-apis.zone.id'
    }
  },
  
  // Admin/Whitelist
  admin: {
    tokens: (process.env.ADMIN_TOKENS || 'wanga123').split(',').map(t => t.trim())
  }
};