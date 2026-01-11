const validator = require('validator');

module.exports = async function phoneValidator(req, res, startTime) {
    const { phone, country = 'KE' } = req.query;
    
    if (!phone) return { 
        success: false, 
        error: 'Phone parameter required' 
    };
    
    const isMobile = validator.isMobilePhone(phone, 'any');
    const isKE = validator.isMobilePhone(phone, 'en-KE');
    
    return {
        success: true,
        phone: phone,
        valid: isMobile,
        country_detected: isKE ? 'Kenya' : 'Unknown',
        format: isMobile ? 'mobile' : 'unknown',
        carrier: detectCarrier(phone),
        suggestion: isMobile ? 'Valid phone number' : 'Check phone format'
    };
};

function detectCarrier(phone) {
    // Simple Kenyan carrier detection
    const prefixes = {
        '07': 'Safaricom',
        '01': 'Airtel',
        '075': 'Telkom',
        '074': 'Safaricom'
    };
    
    for (const [prefix, carrier] of Object.entries(prefixes)) {
        if (phone.startsWith(prefix)) return carrier;
    }
    return 'Unknown';
}