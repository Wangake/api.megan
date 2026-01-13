module.exports = async function passwordStrength(req, res, startTime) {
    const { password } = req.query;
    
    if (!password) return { 
        success: false, 
        error: 'Password parameter required' 
    };
    
    const checks = {
        length: password.length >= 8,
        hasLower: /[a-z]/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password),
        noSequential: !/(123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password),
        noRepeating: !/(.)\1\1/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    const strength = getStrength(score, password.length);
    const entropy = calculateEntropy(password);
    
    return {
        success: true,
        password: '*'.repeat(password.length),
        strength: strength.level,
        score: score,
        score_max: 7,
        entropy_bits: entropy,
        checks: checks,
        crack_time: estimateCrackTime(entropy),
        suggestions: getSuggestions(checks)
    };
};

function getStrength(score, length) {
    if (score >= 6 && length >= 12) return { level: 'Very Strong', color: 'green' };
    if (score >= 5) return { level: 'Strong', color: 'blue' };
    if (score >= 4) return { level: 'Good', color: 'yellow' };
    if (score >= 3) return { level: 'Fair', color: 'orange' };
    return { level: 'Weak', color: 'red' };
}

function calculateEntropy(password) {
    const charsetSize = getCharsetSize(password);
    return Math.log2(Math.pow(charsetSize, password.length)).toFixed(2);
}

function getCharsetSize(password) {
    let size = 0;
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/\d/.test(password)) size += 10;
    if (/[^A-Za-z0-9]/.test(password)) size += 32;
    return size;
}

function estimateCrackTime(entropy) {
    const guessesPerSecond = 1e9; // 1 billion guesses/second
    const seconds = Math.pow(2, entropy) / guessesPerSecond;
    
    if (seconds < 60) return 'seconds';
    if (seconds < 3600) return `${Math.round(seconds/60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds/3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds/86400)} days`;
    return `${Math.round(seconds/31536000)} years`;
}

function getSuggestions(checks) {
    const suggestions = [];
    if (!checks.length) suggestions.push('Use at least 8 characters');
    if (!checks.hasLower) suggestions.push('Add lowercase letters');
    if (!checks.hasUpper) suggestions.push('Add uppercase letters');
    if (!checks.hasNumber) suggestions.push('Add numbers');
    if (!checks.hasSpecial) suggestions.push('Add special characters');
    if (!checks.noSequential) suggestions.push('Avoid sequential patterns');
    if (!checks.noRepeating) suggestions.push('Avoid repeating characters');
    return suggestions;
}
