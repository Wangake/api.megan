const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function aivideo2Handler(req, res, startTime) {
    const { type, prompt } = req.query;
    const data = await fetchFromElite('/aivideo2', { type, prompt });
    return data;
};