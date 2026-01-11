const mime = require('mime-types');

module.exports = async function mimeTypeHandler(req, res, startTime) {
    const { extension, mime: mimeType, search } = req.query;
    
    if (extension) {
        const type = mime.lookup(extension.startsWith('.') ? extension : `.${extension}`);
        const charset = mime.charset(type);
        
        return {
            success: true,
            extension: extension.startsWith('.') ? extension : `.${extension}`,
            mime_type: type || 'application/octet-stream',
            charset: charset || 'UTF-8',
            common: type ? isCommonType(type) : false,
            category: getCategory(type),
            aliases: mime.extension(type) ? [mime.extension(type)] : [],
            examples: getExamples(extension)
        };
    }
    
    if (mimeType) {
        const ext = mime.extension(mimeType);
        
        return {
            success: true,
            mime_type: mimeType,
            extension: ext || 'Unknown',
            charset: mime.charset(mimeType) || 'UTF-8',
            category: getCategory(mimeType),
            description: getDescription(mimeType),
            common_extensions: ext ? [ext] : [],
            related_types: getRelatedTypes(mimeType)
        };
    }
    
    if (search) {
        const allTypes = Object.entries(require('mime-db'));
        const results = allTypes.filter(([type, data]) => 
            type.toLowerCase().includes(search.toLowerCase()) ||
            (data.extensions && data.extensions.some(ext => 
                ext.toLowerCase().includes(search.toLowerCase())
            ))
        ).slice(0, 20);
        
        return {
            success: true,
            search: search,
            results: results.map(([type, data]) => ({
                mime_type: type,
                extensions: data.extensions || [],
                charset: data.charset,
                compressible: data.compressible,
                category: getCategory(type)
            }))
        };
    }
    
    // List common types
    const commonTypes = [
        'text/html', 'text/css', 'text/javascript',
        'application/json', 'application/xml',
        'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
        'application/pdf', 'application/zip',
        'audio/mpeg', 'video/mp4'
    ];
    
    return {
        success: true,
        total_types: Object.keys(require('mime-db')).length,
        common_types: commonTypes.map(type => ({
            mime_type: type,
            extension: mime.extension(type),
            category: getCategory(type)
        })),
        categories: {
            text: ['html', 'css', 'javascript', 'plain', 'csv', 'xml'],
            image: ['jpeg', 'png', 'gif', 'svg+xml', 'webp'],
            application: ['json', 'pdf', 'zip', 'octet-stream'],
            audio: ['mpeg', 'wav', 'ogg'],
            video: ['mp4', 'webm', 'ogg'],
            font: ['woff', 'woff2', 'ttf', 'otf']
        }
    };
};

function isCommonType(type) {
    const common = [
        'text/html', 'text/css', 'application/json',
        'image/jpeg', 'image/png', 'application/pdf'
    ];
    return common.includes(type);
}

function getCategory(type) {
    if (!type) return 'unknown';
    if (type.startsWith('text/')) return 'text';
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('audio/')) return 'audio';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('application/')) return 'application';
    if (type.startsWith('font/')) return 'font';
    return 'other';
}

function getDescription(type) {
    const descriptions = {
        'text/html': 'HyperText Markup Language',
        'application/json': 'JavaScript Object Notation',
        'image/jpeg': 'Joint Photographic Experts Group image',
        'application/pdf': 'Portable Document Format'
    };
    return descriptions[type] || 'Media type';
}

function getExamples(ext) {
    const examples = {
        '.html': '<!DOCTYPE html><html><body>Hello</body></html>',
        '.json': '{"name": "example", "value": 123}',
        '.css': 'body { margin: 0; padding: 0; }',
        '.js': 'console.log("Hello World");'
    };
    return examples[`.${ext}`] || 'File content example';
}

function getRelatedTypes(type) {
    const related = {
        'text/html': ['text/plain', 'text/xml'],
        'application/json': ['application/xml', 'text/plain'],
        'image/jpeg': ['image/png', 'image/gif']
    };
    return related[type] || [];
}