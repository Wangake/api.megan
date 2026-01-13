// API Categories Configuration
window.apiCategories = [
    {
        id: 'ai',
        name: 'AI Tools',
        icon: 'fas fa-robot',
        endpoints: [
            {
                name: 'AI Chatbot',
                path: '/api/ai/chatbot',
                method: 'GET',
                description: 'AI chatbot conversation endpoint',
                parameters: [
                    { name: 'message', type: 'text', required: true },
                    { name: 'model', type: 'select', options: ['gpt-3.5', 'gpt-4'], default: 'gpt-3.5' }
                ]
            },
            {
                name: 'AI Copilot',
                path: '/api/ai/copilot',
                method: 'GET',
                description: 'AI code assistant and copilot',
                parameters: [
                    { name: 'code', type: 'text', required: true },
                    { name: 'language', type: 'text', default: 'javascript' }
                ]
            }
            // Add 5 more AI endpoints (keep it small)
        ]
    },
    {
        id: 'tools',
        name: 'Tools',
        icon: 'fas fa-tools',
        endpoints: [
            {
                name: 'Base64',
                path: '/api/tools/base64',
                method: 'GET',
                description: 'Base64 encode or decode text',
                parameters: [
                    { name: 'text', type: 'text', required: true },
                    { name: 'action', type: 'select', options: ['encode', 'decode'], default: 'encode' }
                ]
            }
            // Add 5 more Tools endpoints
        ]
    }
    // Add only 3-4 categories initially
];