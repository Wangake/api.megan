const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function fluxHandler(req, res, startTime) {
    const { prompt } = req.query;
    const data = await fetchFromElite('/flux', { prompt });
    return data;
};