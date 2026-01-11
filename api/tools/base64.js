module.exports = async function base64Handler(req, res, startTime) {
    const { text, action = 'encode' } = req.query;
    
    if (!text) return { 
        success: false, 
        error: 'Text parameter required' 
    };
    
    try {
        if (action === 'encode') {
            const encoded = Buffer.from(text).toString('base64');
            return {
                success: true,
                original: text,
                encoded: encoded,
                action: 'encode',
                length: {
                    original: Buffer.byteLength(text),
                    encoded: Buffer.byteLength(encoded)
                },
                url_safe: encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
            };
        } else {
            const decoded = Buffer.from(text, 'base64').toString('utf8');
            return {
                success: true,
                original: text,
                decoded: decoded,
                action: 'decode',
                valid: isValidBase64(text),
                length: {
                    original: Buffer.byteLength(text),
                    decoded: Buffer.byteLength(decoded)
                }
            };
        }
    } catch (error) {
        return { 
            success: false, 
            error: 'Invalid Base64 string' 
        };
    }
};

function isValidBase64(str) {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str;
    } catch {
        return false;
    }
}