const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function geminiHandler(req, res, startTime) {
    const { prompt } = req.query;
    const data = await fetchFromElite('/gemini', { prompt });
    return data;
};