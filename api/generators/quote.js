const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "work"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        category: "leadership"
    },
    {
        text: "Your time is limited, don't waste it living someone else's life.",
        author: "Steve Jobs",
        category: "life"
    },
    {
        text: "Stay hungry, stay foolish.",
        author: "Steve Jobs",
        category: "motivation"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        category: "dreams"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius",
        category: "perseverance"
    },
    {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu",
        category: "journey"
    },
    {
        text: "Be the change that you wish to see in the world.",
        author: "Mahatma Gandhi",
        category: "change"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins",
        category: "courage"
    },
    {
        text: "Code is like humor. When you have to explain it, it's bad.",
        author: "Cory House",
        category: "programming"
    }
];

module.exports = async function quoteHandler(req, res, startTime) {
    const { 
        category, 
        author,
        count = 1,
        format = 'json'
    } = req.query;
    
    let filtered = [...quotes];
    
    if (category) {
        filtered = filtered.filter(q => 
            q.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    if (author) {
        filtered = filtered.filter(q => 
            q.author.toLowerCase().includes(author.toLowerCase())
        );
    }
    
    if (filtered.length === 0) {
        filtered = quotes; // Fallback to all quotes
    }
    
    const selected = [];
    const countNum = Math.min(parseInt(count), 10);
    
    for (let i = 0; i < countNum; i++) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        selected.push(filtered[randomIndex]);
    }
    
    const response = {
        success: true,
        quotes: selected,
        total_available: quotes.length,
        filtered_count: filtered.length,
        request: {
            category: category || 'any',
            author: author || 'any',
            count: countNum
        },
        categories: [...new Set(quotes.map(q => q.category))],
        authors: [...new Set(quotes.map(q => q.author))]
    };
    
    // Add formatted versions
    if (format === 'text') {
        response.formatted_text = selected.map(q => 
            `"${q.text}" - ${q.author}`
        ).join('\n\n');
    } else if (format === 'html') {
        response.formatted_html = selected.map(q => 
            `<blockquote><p>"${q.text}"</p><cite>- ${q.author}</cite></blockquote>`
        ).join('');
    }
    
    return response;
};