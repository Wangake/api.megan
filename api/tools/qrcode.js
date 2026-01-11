const QRCode = require('qrcode');

module.exports = async function qrcodeHandler(req, res, startTime) {
    const { text, size = 200, margin = 1, format = 'png', color = '000000', bgcolor = 'FFFFFF' } = req.query;
    
    if (!text) {
        return { 
            success: false, 
            error: 'Text parameter is required',
            example: '/api/tools/qrcode?text=https://example.com&size=300&format=png'
        };
    }
    
    try {
        const options = {
            width: parseInt(size),
            margin: parseInt(margin),
            errorCorrectionLevel: 'H',
            color: {
                dark: `#${color}`,
                light: `#${bgcolor}`
            }
        };
        
        let qrData, mimeType, fileSize;
        
        if (format === 'svg') {
            qrData = await QRCode.toString(text, { ...options, type: 'svg' });
            mimeType = 'image/svg+xml';
            fileSize = Buffer.byteLength(qrData);
            
            return {
                success: true,
                type: 'qr_code',
                data: {
                    text: text,
                    qr_code: qrData,
                    format: 'svg',
                    mime_type: mimeType,
                    size_px: parseInt(size),
                    margin: parseInt(margin),
                    colors: {
                        foreground: `#${color}`,
                        background: `#${bgcolor}`
                    },
                    file_size_bytes: fileSize,
                    file_size_kb: (fileSize / 1024).toFixed(2),
                    error_correction: 'H (30%)'
                },
                download_urls: {
                    svg: `data:${mimeType};utf8,${encodeURIComponent(qrData)}`,
                    raw: qrData
                },
                usage: {
                    html: `<img src="data:${mimeType};utf8,${encodeURIComponent(qrData)}" alt="QR Code">`,
                    base64: `data:${mimeType};base64,${Buffer.from(qrData).toString('base64')}`
                }
            };
        } else {
            // Default PNG format
            qrData = await QRCode.toDataURL(text, options);
            mimeType = 'image/png';
            const base64Data = qrData.split(',')[1];
            fileSize = Buffer.byteLength(base64Data, 'base64');
            
            return {
                success: true,
                type: 'qr_code',
                data: {
                    text: text,
                    qr_code: qrData,
                    format: 'png',
                    mime_type: mimeType,
                    size_px: parseInt(size),
                    margin: parseInt(margin),
                    colors: {
                        foreground: `#${color}`,
                        background: `#${bgcolor}`
                    },
                    file_size_bytes: fileSize,
                    file_size_kb: (fileSize / 1024).toFixed(2),
                    error_correction: 'H (30%)',
                    dimensions: `${parseInt(size)}x${parseInt(size)}px`
                },
                download_urls: {
                    png: qrData,
                    base64: base64Data
                },
                usage: {
                    html: `<img src="${qrData}" alt="QR Code" width="${size}" height="${size}">`,
                    markdown: `![QR Code](${qrData})`
                }
            };
        }
    } catch (error) {
        return { 
            success: false, 
            error: error.message,
            suggestion: 'Try a shorter text or different parameters'
        };
    }
};