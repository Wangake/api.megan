const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function aivideoHandler(req, res, startTime) {
    const { type, prompt } = req.query;
    const data = await fetchFromElite('/aivideo', { type, prompt });
    return data;
};