// Core API Configuration
window.apiConfig = {
    baseUrl: window.location.origin,
    categories: window.apiCategories || []
};

// Calculate total endpoints
function calculateTotalEndpoints() {
    if (!window.apiCategories) return 0;
    let total = 0;
    window.apiCategories.forEach(category => {
        total += category.endpoints.length;
    });
    return total;
}

// Update endpoint count on page load
document.addEventListener('DOMContentLoaded', function() {
    const totalEndpoints = calculateTotalEndpoints();
    const endpointCountElement = document.getElementById('endpointCount');
    if (endpointCountElement) {
        endpointCountElement.textContent = totalEndpoints;
    }
    console.log(`✅ API Configuration loaded - ${totalEndpoints} endpoints`);
});