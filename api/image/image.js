const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function imageHandler(req, res, startTime) {
    const { prompt } = req.query;
    const data = await fetchFromElite('/image', { prompt });
    return data;
};