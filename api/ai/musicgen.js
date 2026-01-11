const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function musicgenHandler(req, res, startTime) {
    const { prompt } = req.query;
    const data = await fetchFromElite('/musicgen', { prompt });
    return data;
};