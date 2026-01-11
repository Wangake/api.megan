const moment = require('moment-timezone');

module.exports = async function timezoneHandler(req, res, startTime) {
    const { 
        from,
        to,
        time,
        format = 'YYYY-MM-DD HH:mm:ss'
    } = req.query;
    
    if (!from || !to) {
        // List all timezones
        const allZones = moment.tz.names();
        const commonZones = [
            'UTC',
            'Africa/Nairobi',
            'America/New_York', 
            'America/Los_Angeles',
            'Europe/London',
            'Europe/Paris',
            'Asia/Tokyo',
            'Asia/Dubai',
            'Australia/Sydney'
        ];
        
        return {
            success: true,
            total_zones: allZones.length,
            common_zones: commonZones.map(zone => ({
                name: zone,
                offset: moment.tz(zone).format('Z'),
                current_time: moment.tz(zone).format('HH:mm:ss')
            })),
            zones_by_region: {
                africa: allZones.filter(z => z.startsWith('Africa/')).slice(0, 10),
                america: allZones.filter(z => z.startsWith('America/')).slice(0, 10),
                europe: allZones.filter(z => z.startsWith('Europe/')).slice(0, 10),
                asia: allZones.filter(z => z.startsWith('Asia/')).slice(0, 10)
            }
        };
    }
    
    // Convert time between timezones
    const inputTime = time ? moment(time) : moment();
    const fromTime = inputTime.clone().tz(from);
    const toTime = inputTime.clone().tz(to);
    
    if (!fromTime.isValid() || !toTime.isValid()) {
        return {
            success: false,
            error: 'Invalid timezone(s)',
            suggestion: 'Use timezone names like "Africa/Nairobi" or "America/New_York"'
        };
    }
    
    const offsetDiff = moment.tz(to).utcOffset() - moment.tz(from).utcOffset();
    
    return {
        success: true,
        conversion: {
            from: {
                timezone: from,
                local_time: fromTime.format(format),
                offset: fromTime.format('Z'),
                name: fromTime.format('z')
            },
            to: {
                timezone: to,
                local_time: toTime.format(format),
                offset: toTime.format('Z'),
                name: toTime.format('z')
            },
            difference: {
                hours: offsetDiff / 60,
                minutes: offsetDiff,
                direction: offsetDiff >= 0 ? 'ahead' : 'behind',
                human: `${Math.abs(offsetDiff / 60)} hours ${offsetDiff >= 0 ? 'ahead' : 'behind'}`
            }
        },
        input: {
            time: time || 'current',
            format: format
        },
        alternatives: {
            iso: toTime.toISOString(),
            unix: toTime.unix(),
            rfc2822: toTime.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
            human: toTime.fromNow()
        },
        daylight_saving: {
            from: fromTime.isDST(),
            to: toTime.isDST(),
            note: 'Times may vary during DST transitions'
        }
    };
};