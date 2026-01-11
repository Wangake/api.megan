const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function tiktokHandler(req, res, startTime) {
    const { url } = req.query;
    const data = await fetchFromElite('/tiktok', { url });
    return data;
};