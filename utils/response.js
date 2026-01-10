// Standard response format for all APIs
function createResponse(data, endpoint, query = {}, startTime) {
    // Calculate accurate results count
    let resultsCount = 1;
    if (data.results) {
        resultsCount = 0;
        if (data.results.videos && Array.isArray(data.results.videos)) {
            resultsCount += data.results.videos.length;
        }
        if (data.results.channels && Array.isArray(data.results.channels)) {
            resultsCount += data.results.channels.length;
        }
        if (data.results.playlists && Array.isArray(data.results.playlists)) {
            resultsCount += data.results.playlists.length;
        }
        if (data.results.liveStreams && Array.isArray(data.results.liveStreams)) {
            resultsCount += data.results.liveStreams.length;
        }
        // If nothing counted but data exists, set to 1
        if (resultsCount === 0 && Object.keys(data.results).length > 0) {
            resultsCount = 1;
        }
    }
    
    const response = {
        // Status
        success: data.success !== undefined ? data.success : true,
        status: data.success ? "success" : "error",
        results: resultsCount,
        timestamp: new Date().toISOString(),
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        
        // API Info (FIRST - like you wanted)
        api: {
            name: "Megan API",
            author: "Wanga",
            contact: {
                whatsapp: "Chanel whatsapp Chane",
                whatsapp_group: "https://chat.whatsapp.com/FtKp4i086Xc0X91t1MTjrU",
                email: "contact@megan.co.ke",
                website: "https://api.megan.co.ke"
            },
            version: "2024-2025",
            status: "active",
            endpoints_count: 31,
            rate_limit: "100/hour",
            documentation: "https://api-megan.onrender.com/docs"
        },
        
        // Data
        data: data.downloadURL ? {
            title: data.title,
            downloadURL: data.downloadURL,
            format: query.format || 'mp3',
            size: data.size || null,
            duration: data.duration || null,
            note: "Download links expire after 6 hours"
        } : data.results || data,
        
        // Request Info
        request: {
            endpoint: endpoint,
            parameters: query,
            method: "GET",
            response_time: startTime ? `${Date.now() - startTime}ms` : "0ms",
            server: "Render",
            region: "US East"
        }
    };
    
    // Add error if exists
    if (data.error) {
        response.error = {
            message: data.error,
            code: "API_ERROR",
            suggestion: "Check your parameters and try again"
        };
    }
    
    return response;
}

module.exports = { createResponse };