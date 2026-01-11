const validator = require('validator');

module.exports = async function urlValidator(req, res, startTime) {
    const { url } = req.query;
    
    if (!url) return { 
        success: false, 
        error: 'URL parameter required' 
    };
    
    const isValid = validator.isURL(url, {
        require_protocol: true,
        require_valid_protocol: true
    });
    
    const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
    
    return {
        success: true,
        url: url,
        valid: isValid,
        details: {
            protocol: urlObj.protocol,
            hostname: urlObj.hostname,
            path: urlObj.pathname,
            is_https: urlObj.protocol === 'https:',
            is_secure: urlObj.protocol === 'https:',
            port: urlObj.port || 'default'
        },
        components: {
            scheme: urlObj.protocol.replace(':', ''),
            domain: urlObj.hostname,
            tld: urlObj.hostname.split('.').pop(),
            subdomain: urlObj.hostname.split('.').slice(0, -2).join('.') || 'none'
        }
    };
};