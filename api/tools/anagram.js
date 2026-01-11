module.exports = async function anagramHandler(req, res, startTime) {
    const { word } = req.query;
    
    if (!word) return { 
        success: false, 
        error: 'Word parameter required' 
    };
    
    const sorted = word.toLowerCase().split('').sort().join('');
    const anagrams = generateAnagrams(word.toLowerCase());
    
    return {
        success: true,
        word: word,
        length: word.length,
        sorted_letters: sorted,
        anagram_count: anagrams.length,
        anagrams: anagrams.slice(0, 50), // Limit output
        is_palindrome: word === word.split('').reverse().join(''),
        permutations: factorial(word.length),
        unique_letters: new Set(word.toLowerCase().split('')).size
    };
};

function generateAnagrams(word) {
    if (word.length <= 1) return [word];
    
    const anagrams = new Set();
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const remaining = word.slice(0, i) + word.slice(i + 1);
        const permutations = generateAnagrams(remaining);
        
        for (const perm of permutations) {
            anagrams.add(char + perm);
        }
    }
    
    return Array.from(anagrams);
}

function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}