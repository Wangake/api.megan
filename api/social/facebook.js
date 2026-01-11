const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function facebookHandler(req, res, startTime) {
    const { url } = req.query;
    const data = await fetchFromElite('/facebook', { url });
    return data;
};