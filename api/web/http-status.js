const httpStatus = {
    100: { message: "Continue", category: "Informational" },
    101: { message: "Switching Protocols", category: "Informational" },
    200: { message: "OK", category: "Success" },
    201: { message: "Created", category: "Success" },
    204: { message: "No Content", category: "Success" },
    301: { message: "Moved Permanently", category: "Redirection" },
    302: { message: "Found", category: "Redirection" },
    304: { message: "Not Modified", category: "Redirection" },
    400: { message: "Bad Request", category: "Client Error" },
    401: { message: "Unauthorized", category: "Client Error" },
    403: { message: "Forbidden", category: "Client Error" },
    404: { message: "Not Found", category: "Client Error" },
    418: { message: "I'm a teapot", category: "Client Error" },
    429: { message: "Too Many Requests", category: "Client Error" },
    500: { message: "Internal Server Error", category: "Server Error" },
    502: { message: "Bad Gateway", category: "Server Error" },
    503: { message: "Service Unavailable", category: "Server Error" },
    504: { message: "Gateway Timeout", category: "Server Error" }
};

module.exports = async function httpStatusHandler(req, res, startTime) {
    const { code, category, search } = req.query;
    
    if (code) {
        const statusCode = parseInt(code);
        const status = httpStatus[statusCode];
        
        if (!status) {
            return {
                success: false,
                error: `HTTP status code ${code} not found`,
                suggestion: 'Use codes between 100-599'
            };
        }
        
        return {
            success: true,
            code: statusCode,
            message: status.message,
            category: status.category,
            description: getDescription(statusCode),
            usage: `res.status(${statusCode}).send('${status.message}')`,
            common_causes: getCauses(statusCode),
            solution: getSolution(statusCode)
        };
    }
    
    // List all or filtered
    let filtered = Object.entries(httpStatus);
    
    if (category) {
        filtered = filtered.filter(([_, data]) => 
            data.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    if (search) {
        filtered = filtered.filter(([code, data]) => 
            data.message.toLowerCase().includes(search.toLowerCase()) ||
            code.includes(search)
        );
    }
    
    return {
        success: true,
        count: filtered.length,
        categories: [...new Set(Object.values(httpStatus).map(s => s.category))],
        status_codes: filtered.map(([code, data]) => ({
            code: parseInt(code),
            message: data.message,
            category: data.category,
            link: `https://http.cat/${code}`
        })),
        popular: {
            success: [200, 201, 204],
            client_error: [400, 401, 403, 404, 429],
            server_error: [500, 502, 503, 504],
            funny: [418, 420, 451]
        }
    };
};

function getDescription(code) {
    const descriptions = {
        200: "Standard response for successful HTTP requests.",
        201: "Request succeeded and a new resource was created.",
        400: "Server cannot process request due to client error.",
        404: "Requested resource could not be found.",
        500: "Generic error message when server encounters unexpected condition."
    };
    return descriptions[code] || "Standard HTTP status code.";
}

function getCauses(code) {
    const causes = {
        400: ["Malformed request syntax", "Invalid request message framing"],
        404: ["Wrong URL", "Resource deleted", "Typo in URL"],
        500: ["Unhandled exception", "Database connection failed", "Server misconfiguration"]
    };
    return causes[code] || ["Various server or client issues"];
}

function getSolution(code) {
    const solutions = {
        400: "Check request syntax and parameters.",
        404: "Verify URL and resource existence.",
        500: "Check server logs and application code."
    };
    return solutions[code] || "Investigate server or client configuration.";
}