module.exports = async function base64Handler(req, res, startTime) {
    const { text, action = 'encode' } = req.query;

    if (!text) {
        return {
            success: false,
            error: 'Text parameter required'
        };
    }

    try {
        if (action === 'encode') {
            const encoded = Buffer.from(text).toString('base64');
            return {
                success: true,
                action: 'encode',
                original: text,
                encoded: encoded
            };
        } else {
            const decoded = Buffer.from(text, 'base64').toString('utf8');
            return {
                success: true,
                action: 'decode',
                original: text,
                decoded: decoded
            };
        }
    } catch (error) {
        return {
            success: false,
            error: 'Invalid Base64 string'
        };
    }
};