/**
 * Fetch wrapper for external APIs with error handling
 */

const axios = require('axios');
const config = require('../config/config');

class FetchWrapper {
    constructor() {
        this.eliteBase = config.externalApis.elite.baseUrl;
        this.timeout = 15000; // 15 seconds
    }

    async fetchFromElite(endpoint, params = {}) {
        try {
            const url = `${this.eliteBase}${endpoint}`;
            
            console.log(`[PROXY] Fetching: ${url}`);
            
            const response = await axios.get(url, {
                params,
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://eliteprotech-apis.zone.id/'
                },
                validateStatus: (status) => status < 500 // Accept all 4xx errors
            });

            return {
                success: true,
                data: response.data,
                status: response.status,
                headers: response.headers
            };
        } catch (error) {
            console.error(`[PROXY ERROR] ${endpoint}:`, error.message);
            
            return {
                success: false,
                error: error.message,
                code: error.code || 'FETCH_ERROR',
                ...(error.response && {
                    status: error.response.status,
                    data: error.response.data
                })
            };
        }
    }

    async fetchFromEliteWithImage(endpoint, params = {}) {
        try {
            const url = `${this.eliteBase}${endpoint}`;
            
            console.log(`[PROXY] Fetching image: ${url}`);
            
            const response = await axios.get(url, {
                params,
                timeout: this.timeout,
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://eliteprotech-apis.zone.id/'
                }
            });

            const contentType = response.headers['content-type'] || 'image/png';
            const buffer = Buffer.from(response.data);
            
            return {
                success: true,
                image: `data:${contentType};base64,${buffer.toString('base64')}`,
                format: contentType.split('/')[1] || 'png',
                size: buffer.length,
                width: 512,
                height: 512
            };
        } catch (error) {
            console.error(`[PROXY IMAGE ERROR] ${endpoint}:`, error.message);
            
            return {
                success: false,
                error: error.message,
                code: 'IMAGE_FETCH_ERROR'
            };
        }
    }
}

module.exports = new FetchWrapper();