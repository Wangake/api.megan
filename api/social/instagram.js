const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function instagramHandler(req, res, startTime) {
    const { url } = req.query;
    const data = await fetchFromElite('/instagram', { url });
    return data;
};