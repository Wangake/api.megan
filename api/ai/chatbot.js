const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function chatgptHandler(req, res, startTime) {
    const { prompt } = req.query;
    const data = await fetchFromElite('/chatgpt', { prompt });
    return data;
};