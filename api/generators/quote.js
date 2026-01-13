const quotes = require('../../data/quotes.json');

module.exports = async function quoteHandler(req, res, startTime) {
    const { 
        category, 
        count = 1
    } = req.query;

    let filtered = [...quotes];

    if (category) {
        filtered = filtered.filter(q => 
            q.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (filtered.length === 0) {
        filtered = quotes;
    }

    const selected = [];
    const countNum = Math.min(parseInt(count), 5);

    for (let i = 0; i < countNum; i++) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        selected.push(filtered[randomIndex]);
    }

    return {
        success: true,
        quotes: selected,
        count: selected.length,
        total: quotes.length
    };
};