const natural = require('natural');

module.exports = async function analyzeHandler(req, res, startTime) {
    const { text } = req.query;

    if (!text) {
        return { success: false, error: 'Text parameter is required' };
    }

    try {
        // Word count
        const tokenizer = new natural.WordTokenizer();
        const words = tokenizer.tokenize(text);

        // Sentence count (SAFE fallback)
        let sentences = [];
        if (natural.SentenceTokenizer) {
            const sentenceTokenizer = new natural.SentenceTokenizer();
            sentences = sentenceTokenizer.tokenize(text);
        } else {
            // Fallback: simple sentence split
            sentences = text.split(/[.!?]+/).filter(Boolean);
        }

        // Character count
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;

        // Reading time
        const readingTime = words.length / 200;

        // Sentiment analysis (SAFE)
        let sentimentScore = 0;
        try {
            const analyzer = new natural.SentimentAnalyzer(
                'English',
                natural.PorterStemmer,
                'afinn'
            );
            sentimentScore = analyzer.getSentiment(words);
        } catch {
            sentimentScore = 0;
        }

        // Keywords
        const stopwords = [
            'the','a','an','and','or','but','in','on','at','to','for','of','with','by'
        ];

        const keywords = words
            .filter(w => w.length > 3 && !stopwords.includes(w.toLowerCase()))
            .slice(0, 10);

        return {
            success: true,
            text_preview: text.length > 100 ? text.slice(0, 100) + '...' : text,
            statistics: {
                word_count: words.length,
                sentence_count: sentences.length,
                character_count: chars,
                character_count_no_spaces: charsNoSpaces,
                average_word_length: words.length ? (chars / words.length).toFixed(2) : 0
            },
            reading_time: {
                minutes: readingTime.toFixed(1),
                seconds: Math.round(readingTime * 60),
                level:
                    readingTime < 1 ? 'quick' :
                    readingTime < 5 ? 'medium' : 'long'
            },
            sentiment: {
                score: sentimentScore,
                label:
                    sentimentScore > 0.2 ? 'positive' :
                    sentimentScore < -0.2 ? 'negative' : 'neutral',
                confidence: Math.abs(sentimentScore)
            },
            keywords,
            note: 'Analysis performed using natural language processing'
        };

    } catch (error) {
        return { success: false, error: error.message };
    }
};