const { randomUUID } = require('crypto');

module.exports = async function uuidHandler(req, res, startTime) {
    const { count = 1, version = 4, format = 'standard', hyphenate = true, uppercase = false } = req.query;
    
    try {
        const countNum = parseInt(count);
        if (countNum < 1 || countNum > 1000) {
            return {
                success: false,
                error: 'Count must be between 1 and 1000',
                suggestion: 'For bulk generation, use count between 1 and 100'
            };
        }
        
        const uuids = [];
        const uuidDetails = [];
        
        for (let i = 0; i < countNum; i++) {
            const uuid = randomUUID();
            let formattedUuid = uuid;
            
            // Apply formatting options
            if (format === 'numeric') {
                formattedUuid = uuid.replace(/[^0-9]/g, '');
            } else if (format === 'alphanumeric') {
                formattedUuid = uuid.replace(/-/g, '');
            } else if (format === 'base64') {
                formattedUuid = Buffer.from(uuid.replace(/-/g, ''), 'hex').toString('base64');
            }
            
            if (hyphenate === 'false' && format === 'standard') {
                formattedUuid = uuid.replace(/-/g, '');
            }
            
            if (uppercase === 'true') {
                formattedUuid = formattedUuid.toUpperCase();
            }
            
            // Extract UUID components
            const components = uuid.split('-');
            const uuidInfo = {
                raw: uuid,
                formatted: formattedUuid,
                format: format,
                version: 4,
                variant: 'DCE 1.1, ISO/IEC 11578:1996',
                timestamp: new Date().toISOString(),
                components: {
                    time_low: components[0],
                    time_mid: components[1],
                    time_hi_and_version: components[2],
                    clock_seq_hi_and_reserved: components[3].substring(0, 2),
                    clock_seq_low: components[3].substring(2),
                    node: components[4]
                },
                characteristics: {
                    length: formattedUuid.length,
                    has_hyphens: formattedUuid.includes('-'),
                    is_uppercase: formattedUuid === formattedUuid.toUpperCase(),
                    character_set: format === 'numeric' ? '0-9' : 
                                 format === 'base64' ? 'A-Za-z0-9+/=' : 
                                 '0-9a-f' + (uppercase === 'true' ? ' (uppercase)' : '')
                }
            };
            
            uuids.push(formattedUuid);
            uuidDetails.push(uuidInfo);
        }
        
        const responseData = countNum === 1 ? uuidDetails[0] : {
            count: countNum,
            uuids: uuids,
            details: uuidDetails
        };
        
        return {
            success: true,
            type: 'uuid_generation',
            data: responseData,
            generation_info: {
                algorithm: 'cryptographically secure random generation (RFC 4122)',
                timestamp: new Date().toISOString(),
                request_id: randomUUID(),
                parameters_used: {
                    count: countNum,
                    version: version,
                    format: format,
                    hyphenate: hyphenate !== 'false',
                    uppercase: uppercase === 'true'
                }
            },
            specifications: {
                rfc: 'RFC 4122',
                version: '4 (random)',
                collision_probability: 'Practically zero',
                uniqueness: 'Globally unique',
                randomness_source: 'Cryptographically secure PRNG'
            },
            usage_examples: {
                database: 'Primary keys, unique identifiers',
                distributed_systems: 'Event IDs, correlation IDs',
                security: 'Session tokens, nonces',
                networking: 'Transaction IDs, message IDs'
            },
            security_notes: [
                'UUID v4 provides cryptographically secure randomness',
                'Suitable for security-sensitive applications',
                'Do not use UUID v1 (time-based) for security',
                'Consider UUID v7 (time-ordered) for database indexing'
            ]
        };
        
    } catch (error) {
        return { 
            success: false, 
            error: error.message,
            suggestion: 'Check parameter values and try again'
        };
    }
};