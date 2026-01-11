module.exports = async function acronymHandler(req, res, startTime) {
    const { phrase, type = 'generate' } = req.query;
    
    if (!phrase) return { 
        success: false, 
        error: 'Phrase parameter required' 
    };
    
    const words = phrase.trim().split(/\s+/);
    const acronym = words.map(word => word[0].toUpperCase()).join('');
    
    const commonAcronyms = {
        'API': 'Application Programming Interface',
        'HTTP': 'HyperText Transfer Protocol',
        'HTML': 'HyperText Markup Language',
        'CSS': 'Cascading Style Sheets',
        'JS': 'JavaScript',
        'JSON': 'JavaScript Object Notation',
        'XML': 'eXtensible Markup Language',
        'URL': 'Uniform Resource Locator',
        'URI': 'Uniform Resource Identifier',
        'CPU': 'Central Processing Unit',
        'RAM': 'Random Access Memory',
        'ROM': 'Read Only Memory',
        'PDF': 'Portable Document Format',
        'JPG': 'Joint Photographic Experts Group',
        'PNG': 'Portable Network Graphics',
        'SQL': 'Structured Query Language',
        'GUI': 'Graphical User Interface',
        'CLI': 'Command Line Interface',
        'API': 'Application Programming Interface',
        'SDK': 'Software Development Kit',
        'IDE': 'Integrated Development Environment'
    };
    
    return {
        success: true,
        phrase: phrase,
        acronym: acronym,
        words: words,
        word_count: words.length,
        breakdown: words.map((word, i) => ({
            word: word,
            letter: word[0].toUpperCase(),
            position: i + 1
        })),
        variations: {
            lowercase: acronym.toLowerCase(),
            with_dots: acronym.split('').join('.'),
            spaced: acronym.split('').join(' ')
        },
        common_matches: Object.entries(commonAcronyms)
            .filter(([key]) => key === acronym)
            .map(([key, value]) => ({ acronym: key, meaning: value }))
    };
};