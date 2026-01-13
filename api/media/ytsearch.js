const { fetchFromElite } = require('../../utils/fetchWrapper');

async function ytsearchHandler(req, res, startTime) {
    const { q, limit = 20 } = req.query;

    if (!q) {
        return {
            success: false,
            error: 'Query parameter "q" is required'
        };
    }

    const data = await fetchFromElite('/ytsearch', { q });

    return {
        success: data.success,
        results: data.results,
        error: data.error
    };
}

module.exports = ytsearchHandler;