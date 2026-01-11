const validator = require('validator');

module.exports = async function ipValidator(req, res, startTime) {
    const { ip } = req.query;
    
    if (!ip) return { 
        success: false, 
        error: 'IP parameter required' 
    };
    
    const isIPv4 = validator.isIP(ip, 4);
    const isIPv6 = validator.isIP(ip, 6);
    const isValid = isIPv4 || isIPv6;
    
    return {
        success: true,
        ip: ip,
        valid: isValid,
        type: isIPv4 ? 'IPv4' : isIPv6 ? 'IPv6' : 'Invalid',
        details: {
            is_private: isPrivateIP(ip),
            is_loopback: ip === '127.0.0.1' || ip === '::1',
            is_link_local: ip.startsWith('169.254.'),
            version: isIPv4 ? 4 : isIPv6 ? 6 : null
        }
    };
};

function isPrivateIP(ip) {
    return ip.startsWith('10.') || 
           ip.startsWith('192.168.') || 
           ip.startsWith('172.') && 
           parseInt(ip.split('.')[1]) >= 16 && 
           parseInt(ip.split('.')[1]) <= 31;
}