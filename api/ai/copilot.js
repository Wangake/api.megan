const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function copilotHandler(req, res, startTime) {
    const { prompt } = req.query;
    const data = await fetchFromElite('/copilot', { prompt });
    return data;
};