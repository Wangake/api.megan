const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function aioHandler(req, res, startTime) {
    const { url } = req.query;
    const data = await fetchFromElite('/aio', { url });
    return data;
};