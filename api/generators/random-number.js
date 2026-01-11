module.exports = async function randomNumberHandler(req, res, startTime) {
    const { 
        min = 1, 
        max = 100, 
        count = 1, 
        type = 'integer',
        seed 
    } = req.query;
    
    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    const countNum = Math.min(parseInt(count), 1000);
    
    if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) {
        return { 
            success: false, 
            error: 'Invalid number parameters' 
        };
    }
    
    let generator = Math.random;
    if (seed) {
        // Simple seeded random
        let seedNum = Array.from(seed).reduce((acc, char) => 
            acc + char.charCodeAt(0), 0
        );
        generator = () => {
            const x = Math.sin(seedNum++) * 10000;
            return x - Math.floor(x);
        };
    }
    
    const numbers = [];
    const stats = {
        sum: 0,
        min: Infinity,
        max: -Infinity
    };
    
    for (let i = 0; i < countNum; i++) {
        let num;
        if (type === 'integer') {
            num = Math.floor(generator() * (maxNum - minNum + 1)) + minNum;
        } else {
            num = generator() * (maxNum - minNum) + minNum;
            num = parseFloat(num.toFixed(6));
        }
        
        numbers.push(num);
        stats.sum += num;
        stats.min = Math.min(stats.min, num);
        stats.max = Math.max(stats.max, num);
    }
    
    stats.average = stats.sum / countNum;
    stats.median = calculateMedian(numbers);
    
    return {
        success: true,
        numbers: numbers,
        count: countNum,
        range: { min: minNum, max: maxNum },
        type: type,
        seed_used: seed || 'none',
        statistics: {
            average: parseFloat(stats.average.toFixed(6)),
            median: stats.median,
            min: stats.min,
            max: stats.max,
            sum: parseFloat(stats.sum.toFixed(6)),
            range: parseFloat((stats.max - stats.min).toFixed(6))
        },
        distribution: analyzeDistribution(numbers, minNum, maxNum)
    };
};

function calculateMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        return sorted[mid];
    }
}

function analyzeDistribution(numbers, min, max) {
    const bins = 10;
    const binSize = (max - min) / bins;
    const distribution = Array(bins).fill(0);
    
    numbers.forEach(num => {
        const bin = Math.min(Math.floor((num - min) / binSize), bins - 1);
        distribution[bin]++;
    });
    
    return distribution.map((count, i) => ({
        range: `${(min + i * binSize).toFixed(2)}-${(min + (i + 1) * binSize).toFixed(2)}`,
        count: count,
        percentage: ((count / numbers.length) * 100).toFixed(2) + '%'
    }));
}