const QRCode = require('qrcode');

module.exports = async function qrcodeHandler(req, res, startTime) {
    const { text, size = 200, format = 'png', color = '000000', bgcolor = 'FFFFFF' } = req.query;

    if (!text) {
        return {
            success: false,
            error: 'Text parameter is required',
            example: '/api/tools/qrcode?text=https://example.com'
        };
    }

    try {
        const options = {
            width: parseInt(size),
            margin: 1,
            errorCorrectionLevel: 'H',
            color: {
                dark: `#${color}`,
                light: `#${bgcolor}`
            }
        };

        if (format === 'svg') {
            const qrData = await QRCode.toString(text, { ...options, type: 'svg' });
            return {
                success: true,
                qr_code: qrData,
                format: 'svg',
                size: parseInt(size),
                text: text
            };
        } else {
            const qrData = await QRCode.toDataURL(text, options);
            return {
                success: true,
                qr_code: qrData,
                format: 'png',
                size: parseInt(size),
                text: text
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};