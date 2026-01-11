async function fetchFromElite(endpoint, params = {}, options = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${ELITE_BASE}${endpoint}${queryString ? '?' + queryString : ''}`;
        
        console.log(`[PROXY] Fetching: ${url}`);
        
        // Special handling for image endpoints
        const imageEndpoints = ['/flux', '/image', '/firelogo', '/ssweb', '/getpp'];
        const isImageEndpoint = imageEndpoints.includes(endpoint);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': isImageEndpoint ? 'image/*' : 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://eliteprotech-apis.zone.id/',
                'Sec-Fetch-Dest': isImageEndpoint ? 'image' : 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });
        
        // Get content type
        const contentType = response.headers.get('content-type');
        
        // If it's an image or we expect image
        if (isImageEndpoint || (contentType && contentType.startsWith('image/'))) {
            // Get image as buffer
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            return {
                success: true,
                image: `data:${contentType || 'image/png'};base64,${buffer.toString('base64')}`,
                format: contentType ? contentType.split('/')[1] : 'png',
                size: buffer.length,
                note: 'Image returned as base64 data URL'
            };
        }
        
        // Otherwise try to parse as JSON
        const text = await response.text();
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            // If not JSON, return as text
            return {
                success: false,
                error: 'Response is not valid JSON',
                raw_response: text.substring(0, 200),
                content_type: contentType
            };
        }
        
    } catch (error) {
        console.error(`[PROXY ERROR] ${endpoint}:`, error.message);
        return { success: false, error: error.message };
    }
}