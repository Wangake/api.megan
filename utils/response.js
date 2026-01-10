// utils/response.js - COMPLETE CORRECTED FILE
function createResponse(data, endpoint, query = {}, startTime) {
    const response = {
        success: data.success !== undefined ? data.success : true,
        status: data.success ? "success" : "error",
        results: data.results ? Object.keys(data.results).length : 1,
        timestamp: new Date().toISOString(),
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        
        api: {
            name: "Megan API",
            author: "Wanga",
            contact: {
                whatsapp: "Chanel whatsapp Chane",
                email: "contact@megan.co.ke",
                website: "https://api.megan.co.ke"
            },
            version: "2024-2025",
            status: "active",
            endpoints_count: 31,
            rate_limit: "100/hour"
        },
        
        data: data.downloadURL ? {
            title: data.title,
            downloadURL: data.downloadURL,
            format: query.format || 'mp3',
            size: data.size || null,
            duration: data.duration || null
        } : data.results || data,
        
        request: {
            endpoint: endpoint,
            parameters: query,
            method: "GET",
            response_time: startTime ? `${Date.now() - startTime}ms` : "0ms"
        }
    };
    
    if (data.error) {
        response.error = {
            message: data.error,
            code: "API_ERROR",
            suggestion: "Check your parameters and try again"
        };
    }
    
    return response;
}

module.exports = { createResponse };API
