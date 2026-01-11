const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function spotifyHandler(req, res, startTime) {
    const { url } = req.query;
    const data = await fetchFromElite('/spotify', { url });
    return data;
};