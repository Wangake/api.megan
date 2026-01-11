const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
};

const reverseMorse = Object.fromEntries(
    Object.entries(morseCode).map(([k, v]) => [v, k])
);

module.exports = async function morseHandler(req, res, startTime) {
    const { text, action = 'encode' } = req.query;
    
    if (!text) return { 
        success: false, 
        error: 'Text parameter required' 
    };
    
    if (action === 'encode') {
        const morse = text.toUpperCase().split('').map(char => 
            morseCode[char] || '?'
        ).join(' ');
        
        return {
            success: true,
            original: text,
            morse: morse,
            action: 'encode',
            format: 'International Morse Code',
            audio_pattern: morse.replace(/\./g, 'di ').replace(/-/g, 'dah ').trim(),
            timing: {
                dot: '1 unit',
                dash: '3 units',
                space_letters: '3 units',
                space_words: '7 units'
            }
        };
    } else {
        try {
            const decoded = text.split(' ').map(code => 
                reverseMorse[code] || '?'
            ).join('');
            
            return {
                success: true,
                original: text,
                decoded: decoded,
                action: 'decode',
                valid: /^[.\-\s\/]+$/.test(text),
                format: 'International Morse Code'
            };
        } catch {
            return { 
                success: false, 
                error: 'Invalid Morse code' 
            };
        }
    }
};