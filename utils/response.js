// Standard response format for all APIs
function createResponse(data, endpoint, query = {}, startTime) {
    return {
        // Status
        success: data.success !== undefined ? data.success : true,
        status: data.success ? "success" : "error",
        timestamp: new Date().toISOString(),
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

        // Data
        data: data,

        // API Info
        api: {
            name: "Megan API",
            author: "Tracker Wanga",
            version: "2.0.0",
            website: "https://api.megan.co.ke"
        },

        // Request Info
        request: {
            endpoint: endpoint,
            parameters: query,
            method: "GET",
            response_time: startTime ? `${Date.now() - startTime}ms` : "0ms"
        }
    };
}

module.exports = { createResponse };