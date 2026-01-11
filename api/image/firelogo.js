const { fetchFromElite } = require('../../utils/fetchWrapper');

module.exports = async function firelogoHandler(req, res, startTime) {
    const { text } = req.query;
    const data = await fetchFromElite('/firelogo', { text });
    return data;
};