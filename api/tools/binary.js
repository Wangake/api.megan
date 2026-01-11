module.exports = async function binaryHandler(req, res, startTime) {
    const { text, action = 'encode' } = req.query;
    
    if (!text) return { 
        success: false, 
        error: 'Text parameter required' 
    };
    
    if (action === 'encode') {
        const binary = text.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join(' ');
        
        return {
            success: true,
            original: text,
            binary: binary,
            action: 'encode',
            bits: binary.length - (text.length - 1), // minus spaces
            bytes: text.length,
            groups: binary.split(' ').map(b => ({ binary: b, decimal: parseInt(b, 2) }))
        };
    } else {
        try {
            const ascii = text.split(' ').map(bin => 
                String.fromCharCode(parseInt(bin, 2))
            ).join('');
            
            return {
                success: true,
                original: text,
                ascii: ascii,
                action: 'decode',
                valid: /^[01\s]+$/.test(text),
                groups: text.split(' ').map(b => ({ binary: b, decimal: parseInt(b, 2) }))
            };
        } catch {
            return { 
                success: false, 
                error: 'Invalid binary string' 
            };
        }
    }
};