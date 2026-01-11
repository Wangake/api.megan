const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function storyHandler(req, res, startTime) {
    const { prompt } = req.query;
    const data = await fetchFromElite('/story', { prompt });
    return data;
};