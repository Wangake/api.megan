const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function spsearchHandler(req, res, startTime) {
    const { q } = req.query;
    const data = await fetchFromElite('/sps', { q });
    return data;
};