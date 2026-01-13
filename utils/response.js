/**
 * Clean response format for Megan API
 * Removes unnecessary fields and keeps responses concise
 */

const config = require('../config/config');

function createResponse(data, endpoint, query = {}, startTime) {
    const { success = true, error, ...restData } = data;

    // Calculate results count (only if data exists)
    let resultsCount = 0;
    if (restData && typeof restData === 'object') {
        const keys = Object.keys(restData);
        if (keys.length > 0) resultsCount = 1;
        
        // Count arrays if they exist
        if (restData.results && Array.isArray(restData.results)) {
            resultsCount = restData.results.length;
        } else if (restData.data && Array.isArray(restData.data)) {
            resultsCount = restData.data.length;
        } else if (restData.items && Array.isArray(restData.items)) {
            resultsCount = restData.items.length;
        }
    }

    // Build minimal response
    const response = {
        // Status
        success: success,
        status: success ? 'success' : 'error',
        results: resultsCount,
        timestamp: new Date().toISOString(),
        request_id: generateRequestId(),

        // API Info (minimal)
        api: {
            name: config.api.name,
            version: config.api.version,
            status: config.api.status
        },

        // Data - only include if exists
        ...(restData && Object.keys(restData).length > 0 && { data: restData }),

        // Request Info (only in development)
        ...(config.nodeEnv === 'development' && {
            request: {
                endpoint: endpoint.replace('/api/', ''),
                response_time: startTime ? `${Date.now() - startTime}ms` : '0ms'
            }
        })
    };

    // Add error if exists
    if (error) {
        response.error = {
            message: error.message || error,
            code: error.code || 'API_ERROR',
            suggestion: error.suggestion || 'Check your parameters and try again'
        };
        
        // Remove data object if there's an error with no data
        if (!restData || Object.keys(restData).length === 0) {
            delete response.data;
        }
    }

    return response;
}

function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Quick response for common errors
function errorResponse(message, code = 'API_ERROR', suggestion = null) {
    return {
        success: false,
        error: {
            message,
            code,
            suggestion: suggestion || 'Check your parameters and try again'
        }
    };
}

// Success response helper
function successResponse(data = {}) {
    return {
        success: true,
        ...data
    };
}

module.exports = {
    createResponse,
    errorResponse,
    successResponse
};