module.exports = async function randomNumberHandler(req, res, startTime) {
    const { 
        min = 1, 
        max = 100, 
        count = 1, 
        type = 'integer'
    } = req.query;

    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    const countNum = Math.min(parseInt(count), 100);

    if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) {
        return {
            success: false,
            error: 'Invalid number parameters'
        };
    }

    const numbers = [];
    for (let i = 0; i < countNum; i++) {
        let num;
        if (type === 'integer') {
            num = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        } else {
            num = Math.random() * (maxNum - minNum) + minNum;
            num = parseFloat(num.toFixed(4));
        }
        numbers.push(num);
    }

    return {
        success: true,
        numbers: numbers,
        count: countNum,
        min: minNum,
        max: maxNum,
        type: type
    };
};