// API Config Loader - Combines all parts
window.apiConfig = {
    baseUrl: window.location.origin,
    categories: []
};

// Wait for all parts to load
window.addEventListener('load', function() {
    console.log('🔄 Combining API config parts...');
    
    // Combine all parts
    const allParts = [
        window.apiConfigPart1,
        window.apiConfigPart2, 
        window.apiConfigPart3,
        window.apiConfigPart4
    ];
    
    allParts.forEach(part => {
        if (part && part.categories) {
            window.apiConfig.categories = window.apiConfig.categories.concat(part.categories);
        }
    });
    
    // Calculate total endpoints
    function calculateTotalEndpoints() {
        let total = 0;
        window.apiConfig.categories.forEach(category => {
            total += category.endpoints.length;
        });
        return total;
    }
    
    // Update endpoint count
    const totalEndpoints = calculateTotalEndpoints();
    const endpointCountElement = document.getElementById('endpointCount');
    if (endpointCountElement) {
        endpointCountElement.textContent = totalEndpoints;
    }
    
    console.log(`✅ Combined ${totalEndpoints} endpoints across ${window.apiConfig.categories.length} categories`);
    
    // Signal that config is ready
    window.apiConfigReady = true;
    console.log('✅ API Config ready for app.js');
});