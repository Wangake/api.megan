const validator = require('validator');

module.exports = async function emailValidator(req, res, startTime) {
    const { email } = req.query;
    
    if (!email) return { 
        success: false, 
        error: 'Email parameter required' 
    };
    
    const isValid = validator.isEmail(email);
    const isDisposable = validator.isEmail(email) && 
                        email.split('@')[1].includes('disposable');
    const domain = email.split('@')[1];
    
    return {
        success: true,
        email: email,
        valid: isValid,
        details: {
            format_valid: isValid,
            domain: domain,
            disposable: isDisposable,
            mx_record: null, // Could add DNS check
            suggestion: isValid ? 'Email format is valid' : 'Check email format'
        },
        score: isValid ? 100 : 0
    };
};
