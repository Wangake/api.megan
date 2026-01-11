const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;
const crypto = require('crypto');

module.exports = async function analyzeHandler(req, res, startTime) {
    const { text, language = 'English', detailed = false } = req.query;
    
    if (!text) {
        return { 
            success: false, 
            error: 'Text parameter is required',
            example: '/api/tools/analyze?text=This%20is%20a%20sample%20text%20for%20analysis'
        };
    }
    
    try {
        // Text preprocessing
        const cleanText = text.trim();
        const textHash = crypto.createHash('md5').update(cleanText).digest('hex');
        
        // Tokenization
        const wordTokenizer = new natural.WordTokenizer();
        const sentenceTokenizer = new natural.SentenceTokenizer();
        const wordPunctTokenizer = new natural.WordPunctTokenizer();
        
        const words = wordTokenizer.tokenize(cleanText);
        const sentences = sentenceTokenizer.tokenize(cleanText);
        const wordPunctTokens = wordPunctTokenizer.tokenize(cleanText);
        
        // Character analysis
        const chars = cleanText.length;
        const charsNoSpaces = cleanText.replace(/\s/g, '').length;
        const charsNoPunct = cleanText.replace(/[^\w\s]/g, '').length;
        
        // Word analysis
        const wordFrequencies = {};
        const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
        
        words.forEach(word => {
            const lowerWord = word.toLowerCase();
            if (!stopwords.has(lowerWord) && word.length > 2) {
                wordFrequencies[lowerWord] = (wordFrequencies[lowerWord] || 0) + 1;
            }
        });
        
        // Sort by frequency
        const sortedFrequencies = Object.entries(wordFrequencies)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, freq]) => ({ word, frequency: freq }));
        
        // Sentiment analysis
        const analyzer = new SentimentAnalyzer(language, PorterStemmer, 'afinn');
        const sentimentScore = analyzer.getSentiment(words);
        
        let sentimentLabel = 'neutral';
        let sentimentEmoji = '😐';
        if (sentimentScore > 0.5) {
            sentimentLabel = 'very positive';
            sentimentEmoji = '😄';
        } else if (sentimentScore > 0.2) {
            sentimentLabel = 'positive';
            sentimentEmoji = '🙂';
        } else if (sentimentScore < -0.5) {
            sentimentLabel = 'very negative';
            sentimentEmoji = '😠';
        } else if (sentimentScore < -0.2) {
            sentimentLabel = 'negative';
            sentimentEmoji = '😞';
        }
        
        // Readability metrics
        const avgWordsPerSentence = words.length / sentences.length || 0;
        const avgSyllablesPerWord = words.reduce((sum, word) => sum + countSyllables(word), 0) / words.length || 0;
        
        // Flesch Reading Ease Score
        const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        
        let readabilityLevel = 'very difficult';
        if (fleschScore >= 90) readabilityLevel = 'very easy';
        else if (fleschScore >= 80) readabilityLevel = 'easy';
        else if (fleschScore >= 70) readabilityLevel = 'fairly easy';
        else if (fleschScore >= 60) readabilityLevel = 'standard';
        else if (fleschScore >= 50) readabilityLevel = 'fairly difficult';
        else if (fleschScore >= 30) readabilityLevel = 'difficult';
        
        // Language detection (simplified)
        const commonWords = {
            english: ['the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they'],
            spanish: ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se'],
            french: ['le', 'de', 'un', 'à', 'etre', 'et', 'en', 'avoir', 'que', 'pour']
        };
        
        let detectedLanguage = 'English';
        let detectionConfidence = 0;
        
        for (const [lang, wordList] of Object.entries(commonWords)) {
            const matches = words.filter(word => 
                wordList.includes(word.toLowerCase())
            ).length;
            const confidence = matches / wordList.length;
            
            if (confidence > detectionConfidence) {
                detectionConfidence = confidence;
                detectedLanguage = lang.charAt(0).toUpperCase() + lang.slice(1);
            }
        }
        
        // Text type classification
        let textType = 'general';
        if (sentences.length === 1 && cleanText.endsWith('?')) textType = 'question';
        else if (sentences.length === 1 && cleanText.endsWith('!')) textType = 'exclamation';
        else if (words.length < 10) textType = 'short';
        else if (words.length > 100) textType = 'long';
        
        // Build response
        const baseAnalysis = {
            text_preview: cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText,
            text_hash: textHash,
            text_type: textType,
            detected_language: {
                language: detectedLanguage,
                confidence: (detectionConfidence * 100).toFixed(1) + '%'
            },
            statistics: {
                characters: {
                    total: chars,
                    without_spaces: charsNoSpaces,
                    without_punctuation: charsNoPunct,
                    spaces: (cleanText.match(/\s/g) || []).length,
                    punctuation: (cleanText.match(/[^\w\s]/g) || []).length
                },
                words: {
                    total: words.length,
                    unique: new Set(words.map(w => w.toLowerCase())).size,
                    average_length: (charsNoSpaces / words.length).toFixed(2)
                },
                sentences: {
                    total: sentences.length,
                    average_words: avgWordsPerSentence.toFixed(2),
                    average_chars: (chars / sentences.length).toFixed(2)
                }
            },
            readability: {
                flesch_score: fleschScore.toFixed(2),
                level: readabilityLevel,
                words_per_sentence: avgWordsPerSentence.toFixed(2),
                syllables_per_word: avgSyllablesPerWord.toFixed(2),
                estimated_grade_level: Math.max(1, Math.ceil((100 - fleschScore) / 10))
            },
            timing: {
                reading_time_minutes: (words.length / 200).toFixed(2),
                speaking_time_minutes: (words.length / 130).toFixed(2),
                skimming_time_seconds: (words.length / 400 * 60).toFixed(0)
            },
            sentiment: {
                score: sentimentScore.toFixed(3),
                label: sentimentLabel,
                emoji: sentimentEmoji,
                confidence: Math.abs(sentimentScore).toFixed(3),
                positivity: sentimentScore > 0 ? 'positive' : 'negative',
                intensity: Math.abs(sentimentScore) > 0.5 ? 'high' : Math.abs(sentimentScore) > 0.2 ? 'medium' : 'low'
            },
            keywords: sortedFrequencies.slice(0, 5)
        };
        
        // Add detailed analysis if requested
        if (detailed === 'true') {
            baseAnalysis.detailed = {
                word_frequencies: sortedFrequencies,
                sentence_list: sentences.slice(0, 5),
                token_types: {
                    word_tokens: words.length,
                    punctuation_tokens: wordPunctTokens.filter(t => /[^\w\s]/.test(t)).length,
                    numeric_tokens: wordPunctTokens.filter(t => /^\d+$/.test(t)).length
                },
                character_distribution: {
                    letters: (cleanText.match(/[a-zA-Z]/g) || []).length,
                    digits: (cleanText.match(/\d/g) || []).length,
                    whitespace: (cleanText.match(/\s/g) || []).length,
                    special: (cleanText.match(/[^\w\s]/g) || []).length
                }
            };
        }
        
        return {
            success: true,
            type: 'text_analysis',
            data: baseAnalysis,
            analysis_info: {
                timestamp: new Date().toISOString(),
                request_id: crypto.randomBytes(8).toString('hex'),
                parameters_used: {
                    text_length: cleanText.length,
                    language: language,
                    detailed: detailed === 'true'
                },
                algorithms: {
                    tokenization: 'Natural WordTokenizer',
                    sentiment: 'AFINN-111 wordlist',
                    readability: 'Flesch Reading Ease',
                    language_detection: 'Common word matching'
                }
            },
            applications: {
                content_creation: 'Optimize readability and tone',
                seo: 'Keyword density analysis',
                education: 'Reading level assessment',
                social_media: 'Sentiment tracking',
                customer_feedback: 'Emotion analysis'
            }
        };
        
    } catch (error) {
        return { 
            success: false, 
            error: error.message,
            suggestion: 'Check text format and try again'
        };
    }
};

// Helper function to count syllables
function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
}