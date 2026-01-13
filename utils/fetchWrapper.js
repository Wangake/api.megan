// Wrapper for EliteProTech API calls (Node 18+ native fetch)

const ELITE_BASE = "https://eliteprotech-apis.zone.id";

async function fetchFromElite(endpoint, params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${ELITE_BASE}${endpoint}${queryString ? '?' + queryString : ''}`;

        console.log(`[PROXY] Fetching: ${url}`);

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.9"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`[PROXY ERROR] ${endpoint}:`, error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { fetchFromElite };