const UserAgent = require('user-agents');

module.exports = async function userAgentHandler(req, res, startTime) {
    const { 
        type = 'random',
        device = 'desktop',
        count = 1 
    } = req.query;
    
    const countNum = Math.min(parseInt(count), 10);
    const agents = [];
    
    const configs = {
        desktop: { deviceCategory: 'desktop' },
        mobile: { deviceCategory: 'mobile' },
        tablet: { deviceCategory: 'tablet' },
        bot: { deviceCategory: 'bot' }
    };
    
    const config = configs[device] || {};
    
    for (let i = 0; i < countNum; i++) {
        const userAgent = new UserAgent(config);
        const data = userAgent.data;
        
        agents.push({
            userAgent: userAgent.toString(),
            platform: data.platform,
            device: {
                type: data.deviceCategory,
                vendor: data.deviceVendor,
                model: data.deviceModel
            },
            browser: {
                name: data.appName,
                version: data.appVersion,
                engine: data.engineName
            },
            os: {
                name: data.osName,
                version: data.osVersion
            },
            screen: {
                width: data.viewportWidth,
                height: data.viewportHeight
            }
        });
    }
    
    return {
        success: true,
        count: countNum,
        device_type: device,
        agents: agents,
        common_agents: {
            chrome_desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            safari_mobile: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            firefox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0"
        },
        usage: "Use in HTTP requests: headers: { 'User-Agent': agent.userAgent }"
    };
};