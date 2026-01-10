const { fetchFromElite } = require('../../utils/fetchWrapper');

async function ytdownHandler(req, res, startTime) {
    const { url, format = 'mp3' } = req.query;
    
    if (!url) {
        return {
            success: false,
            error: 'URL parameter is required'
        };
    }
    
    const data = await fetchFromElite('/ytdown', { url, format });
    
    return {
        success: data.success,
        title: data.title,
        downloadURL: data.downloadURL,
        error: data.error
    };
}

module.exports = ytdownHandler;
