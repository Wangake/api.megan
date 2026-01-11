module.exports = async function palindromeHandler(req, res, startTime) {
    const { text, type = 'generate', length = 5 } = req.query;
    
    if (type === 'check' && !text) {
        return { 
            success: false, 
            error: 'Text parameter required for checking' 
        };
    }
    
    if (type === 'check') {
        const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isPalindrome = clean === clean.split('').reverse().join('');
        
        return {
            success: true,
            text: text,
            is_palindrome: isPalindrome,
            clean_text: clean,
            reversed: clean.split('').reverse().join(''),
            details: {
                length: clean.length,
                has_spaces: text.includes(' '),
                has_punctuation: /[^a-z0-9]/i.test(text),
                case_insensitive: true
            },
            examples: {
                famous: ['racecar', 'madam', 'level', 'rotor', 'civic'],
                sentences: ['A man a plan a canal Panama', 'Never odd or even']
            }
        };
    } else {
        // Generate palindrome
        const len = parseInt(length);
        const palindrome = generatePalindrome(len);
        
        return {
            success: true,
            generated: palindrome,
            length: palindrome.length,
            type: len % 2 === 0 ? 'even' : 'odd',
            pattern: getPattern(palindrome),
            variations: generateVariations(palindrome)
        };
    }
};

function generatePalindrome(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let half = '';
    
    for (let i = 0; i < Math.floor(length / 2); i++) {
        half += chars[Math.floor(Math.random() * chars.length)];
    }
    
    const reversed = half.split('').reverse().join('');
    
    if (length % 2 === 0) {
        return half + reversed;
    } else {
        const middle = chars[Math.floor(Math.random() * chars.length)];
        return half + middle + reversed;
    }
}

function getPattern(str) {
    return str.split('').map((char, i, arr) => 
        char === arr[arr.length - 1 - i] ? '✓' : '✗'
    ).join('');
}

function generateVariations(palindrome) {
    return [
        palindrome.toUpperCase(),
        palindrome.split('').join(' '),
        palindrome.split('').join('-')
    ];
}