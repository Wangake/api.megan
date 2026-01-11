module.exports = async function jsonValidator(req, res, startTime) {
    const { json } = req.query;
    
    if (!json) return { 
        success: false, 
        error: 'JSON parameter required' 
    };
    
    try {
        const parsed = JSON.parse(json);
        const size = Buffer.byteLength(json);
        
        return {
            success: true,
            valid: true,
            size_bytes: size,
            type: Array.isArray(parsed) ? 'array' : 'object',
            keys_count: Object.keys(parsed).length,
            depth: getDepth(parsed),
            formatted: JSON.stringify(parsed, null, 2)
        };
    } catch (error) {
        return {
            success: false,
            valid: false,
            error: error.message,
            position: error.position
        };
    }
};

function getDepth(obj) {
    let depth = 0;
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            const tmpDepth = getDepth(obj[key]);
            if (tmpDepth > depth) depth = tmpDepth;
        });
        depth++;
    }
    return depth;
}