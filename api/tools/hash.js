const crypto = require('crypto');

module.exports = async function hashHandler(req, res, startTime) {
    const { text, algorithm = 'all', salt, iterations = 10000, keylen = 64, digest = 'sha512' } = req.query;
    
    if (!text) {
        return { 
            success: false, 
            error: 'Text parameter is required',
            example: '/api/tools/hash?text=password123&algorithm=sha256'
        };
    }
    
    try {
        const algorithms = {
            md5: {
                hash: crypto.createHash('md5').update(text).digest('hex'),
                bits: 128,
                security: 'weak (deprecated)',
                use_case: 'checksums only, not security'
            },
            sha1: {
                hash: crypto.createHash('sha1').update(text).digest('hex'),
                bits: 160,
                security: 'weak (deprecated)',
                use_case: 'legacy systems only'
            },
            sha256: {
                hash: crypto.createHash('sha256').update(text).digest('hex'),
                bits: 256,
                security: 'strong',
                use_case: 'general purpose, blockchain'
            },
            sha512: {
                hash: crypto.createHash('sha512').update(text).digest('hex'),
                bits: 512,
                security: 'very strong',
                use_case: 'high security applications'
            },
            sha3_256: {
                hash: crypto.createHash('sha3-256').update(text).digest('hex'),
                bits: 256,
                security: 'strong',
                use_case: 'modern applications'
            },
            sha3_512: {
                hash: crypto.createHash('sha3-512').update(text).digest('hex'),
                bits: 512,
                security: 'very strong',
                use_case: 'high security modern apps'
            },
            ripemd160: {
                hash: crypto.createHash('ripemd160').update(text).digest('hex'),
                bits: 160,
                security: 'moderate',
                use_case: 'Bitcoin addresses'
            },
            whirlpool: {
                hash: crypto.createHash('whirlpool').update(text).digest('hex'),
                bits: 512,
                security: 'strong',
                use_case: 'cryptographic applications'
            }
        };
        
        // PBKDF2 for password hashing
        let pbkdf2Hash = null;
        if (salt) {
            pbkdf2Hash = crypto.pbkdf2Sync(
                text, 
                salt, 
                parseInt(iterations), 
                parseInt(keylen), 
                digest
            ).toString('hex');
        }
        
        // Base64 and Hex encodings
        const encodings = {
            base64: Buffer.from(text).toString('base64'),
            hex: Buffer.from(text).toString('hex'),
            base64url: Buffer.from(text).toString('base64url')
        };
        
        if (algorithm !== 'all' && algorithms[algorithm]) {
            const algo = algorithms[algorithm];
            return {
                success: true,
                type: 'hash_generation',
                data: {
                    input_text: text,
                    input_length: text.length,
                    algorithm: algorithm,
                    hash: algo.hash,
                    hash_length: algo.hash.length,
                    hash_bits: algo.bits,
                    security_level: algo.security,
                    recommended_use: algo.use_case,
                    encodings: encodings
                },
                technical_details: {
                    character_set: 'hexadecimal',
                    collision_resistance: algo.bits >= 256 ? 'high' : 'moderate',
                    preimage_resistance: 'high',
                    performance: algo.bits <= 256 ? 'fast' : 'moderate'
                }
            };
        }
        
        // Return all hashes
        const allHashes = {};
        for (const [algoName, algoData] of Object.entries(algorithms)) {
            allHashes[algoName] = {
                hash: algoData.hash,
                bits: algoData.bits,
                security: algoData.security
            };
        }
        
        const response = {
            success: true,
            type: 'hash_generation',
            data: {
                input_text: text,
                input_length: text.length,
                algorithms: allHashes,
                encodings: encodings,
                pbkdf2: salt ? {
                    hash: pbkdf2Hash,
                    salt: salt,
                    iterations: parseInt(iterations),
                    key_length: parseInt(keylen),
                    digest: digest,
                    purpose: 'password storage'
                } : null
            },
            comparison: {
                fastest: 'md5',
                most_secure: 'sha3_512',
                recommended_general: 'sha256',
                recommended_passwords: 'pbkdf2 with salt'
            },
            security_notes: [
                'Use SHA-256 or SHA-3 for general purpose hashing',
                'Always use salt with PBKDF2 for password hashing',
                'MD5 and SHA-1 are cryptographically broken',
                'Consider bcrypt or argon2 for password storage'
            ]
        };
        
        return response;
        
    } catch (error) {
        return { 
            success: false, 
            error: error.message,
            suggestion: 'Check algorithm name or encoding parameters'
        };
    }
};