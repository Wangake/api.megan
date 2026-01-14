// Main Application Script - WAITS for API config
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Megan API Frontend Initializing...');

    // Application State
    let currentEndpoint = null;
    let currentResponse = null;
    let apiData = null;

    // DOM Elements
    const apiCategoriesEl = document.getElementById('apiCategories');
    const searchInput = document.getElementById('searchInput');
    const testPanel = document.getElementById('testPanel');
    const overlay = document.getElementById('overlay');
    const closePanelBtn = document.getElementById('closePanel');
    const panelTitleEl = document.getElementById('panelTitle');
    const testEndpointUrlEl = document.getElementById('testEndpointUrl');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const paramGridEl = document.getElementById('paramGrid');
    const sendRequestBtn = document.getElementById('sendRequest');
    const openInNewTabBtn = document.getElementById('openInNewTab');
    const statusBadgeEl = document.getElementById('statusBadge');
    const copyResponseBtn = document.getElementById('copyResponseBtn');
    const responseOutputEl = document.getElementById('responseOutput');
    const endpointCountEl = document.getElementById('endpointCount');

    // Wait for API config to be ready
    function waitForConfig() {
        if (window.apiConfigReady && window.apiConfig && window.apiConfig.categories) {
            console.log('✅ API Config is ready!');
            apiData = window.apiConfig;
            init();
        } else {
            console.log('⏳ Waiting for API config...');
            setTimeout(waitForConfig, 100);
        }
    }

    // Initialize
    function init() {
        console.log('📊 Initializing with', apiData.categories.length, 'categories');
        renderAPICategories();
        setupEventListeners();
        updateStats();
    }

    // Render all API categories
    function renderAPICategories(filter = '') {
        if (!apiData || !apiData.categories) {
            console.error('❌ No API data available');
            apiCategoriesEl.innerHTML = `
                <div class="category">
                    <div class="category-header">
                        <div class="category-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="category-title">No API Data</div>
                    </div>
                    <p style="text-align: center; color: #94a3b8; padding: 2rem;">
                        Unable to load API configuration. Please check the console.
                    </p>
                </div>
            `;
            return;
        }

        let totalEndpoints = 0;
        let html = '';

        apiData.categories.forEach(category => {
            const filteredEndpoints = category.endpoints.filter(endpoint => 
                filter === '' || 
                endpoint.name.toLowerCase().includes(filter.toLowerCase()) ||
                (endpoint.description && endpoint.description.toLowerCase().includes(filter.toLowerCase())) ||
                endpoint.path.toLowerCase().includes(filter.toLowerCase())
            );

            if (filteredEndpoints.length === 0) return;

            totalEndpoints += filteredEndpoints.length;

            html += `
                <div class="category" data-category="${category.id}">
                    <div class="category-header">
                        <div class="category-icon">
                            <i class="${category.icon}"></i>
                        </div>
                        <div class="category-title">${category.name}</div>
                        <div class="category-count">${filteredEndpoints.length}</div>
                    </div>
                    <div class="endpoints-grid">
            `;

            filteredEndpoints.forEach(endpoint => {
                const paramsText = endpoint.parameters && endpoint.parameters.length > 0
                    ? endpoint.parameters.map(p => `${p.name}: ${p.type}`).join(', ')
                    : 'No parameters';

                html += `
                    <div class="endpoint-card" data-endpoint="${endpoint.path}">
                        <div class="endpoint-header">
                            <div class="endpoint-name">${endpoint.name}</div>
                            <div class="endpoint-method">${endpoint.method}</div>
                        </div>
                        <div class="endpoint-description">
                            ${endpoint.description || 'API endpoint for ' + endpoint.name}
                        </div>
                        <div class="endpoint-params">
                            <div class="params-label">
                                <i class="fas fa-code"></i>
                                Parameters
                            </div>
                            <div class="params-list">${paramsText}</div>
                        </div>
                        <button class="try-api-btn" 
                                data-endpoint='${JSON.stringify(endpoint).replace(/'/g, "&apos;")}'>
                            <i class="fas fa-flask"></i>
                            Test API
                        </button>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        if (html === '') {
            html = `
                <div class="category">
                    <div class="category-header">
                        <div class="category-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <div class="category-title">No Results Found</div>
                    </div>
                    <p style="text-align: center; color: #94a3b8; padding: 2rem;">
                        No APIs match your search. Try a different term.
                    </p>
                </div>
            `;
        }

        apiCategoriesEl.innerHTML = html;
        endpointCountEl.textContent = totalEndpoints;

        // Attach event listeners to new buttons
        document.querySelectorAll('.try-api-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                try {
                    const endpointData = btn.getAttribute('data-endpoint');
                    const endpoint = JSON.parse(endpointData.replace(/&apos;/g, "'"));
                    openTestPanel(endpoint);
                } catch (error) {
                    console.error('Error parsing endpoint data:', error);
                }
            });
        });

        console.log(`✅ Rendered ${totalEndpoints} endpoints`);
    }

    // Open test panel with endpoint
    function openTestPanel(endpoint) {
        console.log('Opening test panel for:', endpoint.name);
        currentEndpoint = endpoint;
        currentResponse = null;

        // Update panel
        panelTitleEl.textContent = endpoint.name;
        testEndpointUrlEl.textContent = endpoint.path;

        // Generate parameter fields
        let paramsHTML = '';
        if (endpoint.parameters && endpoint.parameters.length > 0) {
            endpoint.parameters.forEach(param => {
                let inputHTML = '';

                if (param.type === 'select') {
                    const options = param.options.map(opt => 
                        `<option value="${opt}" ${opt === param.default ? 'selected' : ''}>${opt}</option>`
                    ).join('');

                    inputHTML = `
                        <select class="param-input select" data-param="${param.name}">
                            ${options}
                        </select>
                    `;
                } else {
                    const inputType = param.type === 'password' ? 'password' : 
                                     param.type === 'email' ? 'email' : 
                                     param.type === 'url' ? 'url' : 
                                     param.type === 'tel' ? 'tel' : 
                                     param.type === 'number' ? 'number' : 'text';

                    inputHTML = `
                        <input type="${inputType}" 
                               class="param-input" 
                               data-param="${param.name}"
                               placeholder="${param.example || param.description || ''}"
                               value="${param.default || ''}">
                    `;
                }

                paramsHTML += `
                    <div class="param-field">
                        <div class="param-header">
                            <div class="param-name">${param.name}</div>
                            ${param.required ? '<div class="param-required">Required</div>' : ''}
                        </div>
                        <div class="param-description">${param.description || 'Parameter'}</div>
                        <div class="param-input-container">
                            ${inputHTML}
                        </div>
                    </div>
                `;
            });
        } else {
            paramsHTML = `
                <div class="param-field">
                    <div class="param-description" style="text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        This endpoint doesn't require any parameters.
                    </div>
                </div>
            `;
        }

        paramGridEl.innerHTML = paramsHTML;

        // Reset response area
        statusBadgeEl.textContent = 'Ready';
        statusBadgeEl.className = 'status-badge status-success';
        responseOutputEl.innerHTML = 'Click "Send Request" to test the API';
        copyResponseBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        sendRequestBtn.disabled = false;
        sendRequestBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Request';

        // Show panel
        testPanel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close test panel
    function closeTestPanel() {
        testPanel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        currentEndpoint = null;
        currentResponse = null;
    }

    // Send API request
    async function sendRequest() {
        if (!currentEndpoint) {
            console.error('No endpoint selected');
            return;
        }

        console.log('Sending request for:', currentEndpoint.name);

        // Get parameter values
        const params = {};
        const paramInputs = paramGridEl.querySelectorAll('.param-input');
        let hasErrors = false;

        paramInputs.forEach(input => {
            const paramName = input.dataset.param;
            let value = input.value;

            // For select elements, use the selected value
            if (input.tagName === 'SELECT') {
                value = input.options[input.selectedIndex].value;
            } else {
                value = value.trim();
            }

            // Find parameter definition
            const paramDef = currentEndpoint.parameters.find(p => p.name === paramName);

            if (paramDef && paramDef.required && !value) {
                input.style.borderColor = '#ef4444';
                input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
                hasErrors = true;
            } else {
                input.style.borderColor = '';
                input.style.boxShadow = '';
                if (value) params[paramName] = value;
            }
        });

        if (hasErrors) {
            statusBadgeEl.textContent = 'Error';
            statusBadgeEl.className = 'status-badge status-error';
            responseOutputEl.innerHTML = 'Please fill in all required parameters.';
            return;
        }

        // Build URL
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = currentEndpoint.path + (queryString ? `?${queryString}` : '');
        const absoluteUrl = apiData.baseUrl + fullUrl;

        testEndpointUrlEl.textContent = fullUrl;

        // Update UI for loading
        sendRequestBtn.disabled = true;
        sendRequestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        statusBadgeEl.textContent = 'Loading';
        statusBadgeEl.className = 'status-badge status-success';
        responseOutputEl.innerHTML = 'Making request...';

        try {
            const startTime = Date.now();
            console.log('Making request to:', absoluteUrl);

            // Make API request
            const response = await fetch(absoluteUrl, {
                method: currentEndpoint.method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const responseTime = Date.now() - startTime;
            console.log('Response received in', responseTime, 'ms');

            // Try to parse JSON
            let data;
            try {
                data = await response.json();
                console.log('Response data:', data);
            } catch (jsonError) {
                // If not JSON, get as text
                const text = await response.text();
                data = { 
                    success: false, 
                    error: 'Response is not valid JSON',
                    raw_response: text.substring(0, 200) 
                };
                console.log('Non-JSON response:', text.substring(0, 200));
            }

            // Update UI
            currentResponse = data;

            if (response.ok && data.success !== false) {
                statusBadgeEl.textContent = `Success • ${responseTime}ms`;
                statusBadgeEl.className = 'status-badge status-success';
            } else {
                statusBadgeEl.textContent = `Error • ${responseTime}ms`;
                statusBadgeEl.className = 'status-badge status-error';
            }

            // Format and display response
            responseOutputEl.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));

        } catch (error) {
            console.error('Request failed:', error);
            statusBadgeEl.textContent = 'Failed';
            statusBadgeEl.className = 'status-badge status-error';
            responseOutputEl.innerHTML = `<span style="color: #ef4444">Error: ${error.message}</span>`;
        } finally {
            sendRequestBtn.disabled = false;
            sendRequestBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Request';
        }
    }

    // JSON syntax highlighting
    function syntaxHighlight(json) {
        if (!json) return '';

        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    // Copy URL to clipboard
    function copyUrl() {
        const url = apiData.baseUrl + testEndpointUrlEl.textContent;
        navigator.clipboard.writeText(url).then(() => {
            copyUrlBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyUrlBtn.innerHTML = '<i class="fas fa-copy"></i> Copy URL';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy URL:', err);
        });
    }

    // Copy response to clipboard
    function copyResponse() {
        if (!currentResponse) {
            alert('No response to copy');
            return;
        }

        const text = JSON.stringify(currentResponse, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            copyResponseBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyResponseBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy response:', err);
        });
    }

    // Open endpoint in new tab
    function openInNewTab() {
        if (!currentEndpoint) return;

        const params = {};
        const paramInputs = paramGridEl.querySelectorAll('.param-input');

        paramInputs.forEach(input => {
            const paramName = input.dataset.param;
            let value = input.value;

            if (input.tagName === 'SELECT') {
                value = input.options[input.selectedIndex].value;
            } else {
                value = value.trim();
            }

            if (value) params[paramName] = value;
        });

        const queryString = new URLSearchParams(params).toString();
        const url = apiData.baseUrl + currentEndpoint.path + (queryString ? `?${queryString}` : '');

        window.open(url, '_blank');
    }

    // Update statistics
    function updateStats() {
        if (!apiData || !apiData.categories) return;

        let totalEndpoints = 0;
        apiData.categories.forEach(cat => {
            totalEndpoints += cat.endpoints.length;
        });
        endpointCountEl.textContent = totalEndpoints;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search with debounce
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                renderAPICategories(e.target.value);
            }, 300);
        });

        // Test panel
        closePanelBtn.addEventListener('click', closeTestPanel);
        overlay.addEventListener('click', closeTestPanel);
        sendRequestBtn.addEventListener('click', sendRequest);
        copyUrlBtn.addEventListener('click', copyUrl);
        copyResponseBtn.addEventListener('click', copyResponse);
        openInNewTabBtn.addEventListener('click', openInNewTab);

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeTestPanel();
        });

        // Enter key in panel triggers send (but not in inputs)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && testPanel.classList.contains('active') && 
                !e.target.classList.contains('param-input') &&
                !e.target.tagName === 'SELECT') {
                sendRequest();
            }
        });

        console.log('✅ Event listeners setup complete');
    }

    // Start waiting for API config
    waitForConfig();
    console.log('🔄 Waiting for API configuration...');
});