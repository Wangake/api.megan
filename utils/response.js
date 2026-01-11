// Enhanced response format for all APIs
function createResponse(data, endpoint, query = {}, startTime) {
    const { success = true, error, ...restData } = data;
    
    // Calculate accurate results count
    let resultsCount = 1;
    
    if (restData.results && Array.isArray(restData.results)) {
        resultsCount = restData.results.length;
    } else if (restData.data && Array.isArray(restData.data)) {
        resultsCount = restData.data.length;
    } else if (restData.items && Array.isArray(restData.items)) {
        resultsCount = restData.items.length;
    } else if (typeof restData === 'object') {
        const keys = Object.keys(restData);
        if (keys.length === 0) resultsCount = 0;
    }

    // Build clean response
    const response = {
        // Status
        success: success,
        status: success ? "success" : "error",
        results: resultsCount,
        timestamp: new Date().toISOString(),
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

        // API Info
        api: {
            name: "Megan API",
            author: "Wanga",
            contact: {
                whatsapp: "Channel WhatsApp",
                whatsapp_group: "https://chat.whatsapp.com/FtKp4i086Xc0X91t1MTjrU",
                email: "contact@megan.co.ke",
                website: "https://api.megan.co.ke"
            },
            version: "2.0.0",
            status: "active",
            endpoints_count: 34,
            rate_limit: "100/hour",
            documentation: "https://api-megan.onrender.com/docs"
        },

        // Data - flexible structure
        data: restData,

        // Request Info
        request: {
            endpoint: endpoint.replace('/api/', ''),
            parameters: Object.keys(query).length > 0 ? query : null,
            method: "GET",
            response_time: startTime ? `${Date.now() - startTime}ms` : "0ms"
        }
    };

    // Add error details if exists
    if (error) {
        response.error = {
            message: error.message || error,
            code: error.code || "API_ERROR",
            suggestion: error.suggestion || "Check your parameters and try again"
        };
    }

    return response;
}

module.exports = { createResponse };