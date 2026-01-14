const jokes = require('../../data/jokes.json');

module.exports = async function jokeHandler(req, res, startTime) {
    const { 
        category, 
        count = 1
    } = req.query;

    let filtered = [...jokes];

    if (category) {
        filtered = filtered.filter(j =>
            j.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (filtered.length === 0) {
        filtered = jokes;
    }

    const selected = [];
    const countNum = Math.min(parseInt(count), 5);

    for (let i = 0; i < countNum; i++) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        selected.push(filtered[randomIndex]);
    }

    return {
        success: true,
        jokes: selected,
        count: selected.length,
        total: jokes.length
    };
};