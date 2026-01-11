const moment = require('moment-timezone');

module.exports = async function timestampHandler(req, res, startTime) {
    const { 
        timestamp,
        format = 'unix',
        timezone = 'UTC'
    } = req.query;
    
    let momentObj;
    
    if (timestamp) {
        // Try to parse the timestamp
        const ts = parseInt(timestamp);
        if (!isNaN(ts)) {
            // Unix timestamp in seconds or milliseconds
            momentObj = ts < 10000000000 ? 
                moment.unix(ts) : 
                moment(ts);
        } else {
            // Try as ISO string
            momentObj = moment(timestamp);
        }
    } else {
        // Current time
        momentObj = moment();
    }
    
    if (!momentObj.isValid()) {
        return {
            success: false,
            error: 'Invalid timestamp',
            suggestion: 'Use Unix timestamp (seconds/milliseconds) or ISO 8601 string'
        };
    }
    
    const tzMoment = momentObj.tz(timezone);
    
    const formats = {
        unix: tzMoment.unix(),
        unix_ms: tzMoment.valueOf(),
        iso: tzMoment.toISOString(),
        rfc2822: tzMoment.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
        human: tzMoment.format('YYYY-MM-DD HH:mm:ss'),
        custom: tzMoment.format('MMMM Do YYYY, h:mm:ss a')
    };
    
    return {
        success: true,
        timestamp: timestamp || 'current',
        timezone: timezone,
        formats: formats,
        relative: {
            from_now: tzMoment.fromNow(),
            calendar: tzMoment.calendar()
        },
        components: {
            year: tzMoment.year(),
            month: tzMoment.month() + 1, // 0-indexed
            day: tzMoment.date(),
            hour: tzMoment.hour(),
            minute: tzMoment.minute(),
            second: tzMoment.second(),
            millisecond: tzMoment.millisecond(),
            day_of_week: tzMoment.day(),
            week_of_year: tzMoment.week()
        },
        validation: {
            is_valid: tzMoment.isValid(),
            is_leap_year: tzMoment.isLeapYear(),
            is_daylight_saving: tzMoment.isDST(),
            quarter: tzMoment.quarter()
        },
        timezones: {
            current: timezone,
            utc_offset: tzMoment.format('Z'),
            common: ['UTC', 'Africa/Nairobi', 'America/New_York', 'Europe/London', 'Asia/Tokyo']
        }
    };
};