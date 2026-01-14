// API Categories Data Only
window.apiCategories = [
    // AI Tools - First category
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
            },
            // Add remaining 5 AI endpoints but SIMPLIFIED
            {
                name: 'Gemini AI',
                path: '/api/ai/gemini',
                method: 'GET',
                description: 'Google Gemini AI integration',
                parameters: [
                    { name: 'prompt', type: 'text', required: true },
                    { name: 'temperature', type: 'number', default: '0.7' }
                ]
            },
            {
                name: 'Music Generator',
                path: '/api/ai/musicgen',
                method: 'GET',
                description: 'AI music generation tool',
                parameters: [
                    { name: 'genre', type: 'text', required: true },
                    { name: 'duration', type: 'number', default: '30' }
                ]
            },
            {
                name: 'Story AI',
                path: '/api/ai/storyai',
                method: 'GET',
                description: 'AI story generator',
                parameters: [
                    { name: 'genre', type: 'text', required: true },
                    { name: 'prompt', type: 'text', required: true }
                ]
            },
            {
                name: 'Video AI',
                path: '/api/ai/video',
                method: 'GET',
                description: 'AI video processing tools',
                parameters: [
                    { name: 'action', type: 'select', options: ['generate', 'edit', 'enhance'], default: 'generate' },
                    { name: 'description', type: 'text', required: true }
                ]
            },
            {
                name: 'Video AI 2',
                path: '/api/ai/video2',
                method: 'GET',
                description: 'Advanced AI video generation',
                parameters: [
                    { name: 'prompt', type: 'text', required: true },
                    { name: 'style', type: 'select', options: ['realistic', 'anime', 'cartoon'], default: 'realistic' }
                ]
            }
        ]
    },
    // Tools - Second category
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
            },
            {
                name: 'QR Code',
                path: '/api/tools/qrcode',
                method: 'GET',
                description: 'Generate QR code from text',
                parameters: [
                    { name: 'text', type: 'text', required: true },
                    { name: 'size', type: 'number', default: '200' }
                ]
            }
            // Add other tools endpoints similarly (keep it SIMPLE)
        ]
    }
    // Add other categories but with SIMPLIFIED data
];