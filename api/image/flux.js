// api/image/flux.js
const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function fluxHandler(req, res, startTime) {
    const { prompt } = req.query;
    
    if (!prompt) {
        return { success: false, error: 'Prompt parameter required' };
    }
    
    const data = await fetchFromElite('/flux', { prompt }, { accept: 'image/*' });
    
    if (data.image) {
        // Return image info
        return {
            success: true,
            prompt: prompt,
            image_url: data.image,  // base64 data URL
            format: data.format,
            size_kb: Math.round(data.size / 1024),
            download_url: data.image  // Can be used in <img src="">
        };
    }
    
    return data;
};