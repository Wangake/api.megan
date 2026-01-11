const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function xHandler(req, res, startTime) {
    const { url } = req.query;
    const data = await fetchFromElite('/x', { url });
    return data;
};