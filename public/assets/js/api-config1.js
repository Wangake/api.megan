// API Configuration - Part 1 of 4
window.apiConfigPart1 = {
    baseUrl: window.location.origin,
    categories: [
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
                        { name: 'message', type: 'text', required: true, description: 'Message to send to chatbot', example: 'Hello, how are you?' },
                        { name: 'model', type: 'select', required: false, options: ['gpt-3.5', 'gpt-4'], default: 'gpt-3.5', description: 'AI model to use' }
                    ]
                },
                {
                    name: 'AI Copilot',
                    path: '/api/ai/copilot',
                    method: 'GET',
                    description: 'AI code assistant and copilot',
                    parameters: [
                        { name: 'code', type: 'text', required: true, description: 'Code snippet or description', example: 'function to sort array' },
                        { name: 'language', type: 'text', required: false, default: 'javascript', description: 'Programming language' }
                    ]
                },
                {
                    name: 'Gemini AI',
                    path: '/api/ai/gemini',
                    method: 'GET',
                    description: 'Google Gemini AI integration',
                    parameters: [
                        { name: 'prompt', type: 'text', required: true, description: 'Prompt for Gemini AI', example: 'Explain quantum computing' },
                        { name: 'temperature', type: 'number', required: false, default: '0.7', description: 'Creativity temperature (0-1)' }
                    ]
                },
                {
                    name: 'Music Generator',
                    path: '/api/ai/musicgen',
                    method: 'GET',
                    description: 'AI music generation tool',
                    parameters: [
                        { name: 'genre', type: 'text', required: true, description: 'Music genre', example: 'jazz' },
                        { name: 'duration', type: 'number', required: false, default: '30', description: 'Duration in seconds' }
                    ]
                },
                {
                    name: 'Story AI',
                    path: '/api/ai/storyai',
                    method: 'GET',
                    description: 'AI story generator',
                    parameters: [
                        { name: 'genre', type: 'text', required: true, description: 'Story genre', example: 'fantasy' },
                        { name: 'prompt', type: 'text', required: true, description: 'Story idea or prompt', example: 'A dragon in a modern city' }
                    ]
                }
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
                        { name: 'text', type: 'text', required: true, description: 'Text to encode/decode', example: 'Hello World' },
                        { name: 'action', type: 'select', required: true, options: ['encode', 'decode'], default: 'encode', description: 'Action to perform' }
                    ]
                },
                {
                    name: 'QR Code',
                    path: '/api/tools/qrcode',
                    method: 'GET',
                    description: 'Generate QR code from text',
                    parameters: [
                        { name: 'text', type: 'text', required: true, description: 'Text to encode in QR', example: 'https://example.com' },
                        { name: 'size', type: 'number', required: false, default: '200', description: 'QR code size in pixels' }
                    ]
                },
                {
                    name: 'Hash Generator',
                    path: '/api/tools/hash',
                    method: 'GET',
                    description: 'Generate hash from text using various algorithms',
                    parameters: [
                        { name: 'text', type: 'text', required: true, description: 'Text to hash', example: 'password123' },
                        { name: 'algorithm', type: 'select', required: true, options: ['md5', 'sha1', 'sha256', 'sha512'], default: 'sha256', description: 'Hash algorithm' }
                    ]
                },
                {
                    name: 'Text Analysis',
                    path: '/api/tools/analyze',
                    method: 'GET',
                    description: 'Analyze text for word count, characters, etc.',
                    parameters: [
                        { name: 'text', type: 'text', required: true, description: 'Text to analyze', example: 'This is a sample text for analysis.' }
                    ]
                },
                {
                    name: 'Binary Converter',
                    path: '/api/tools/binary',
                    method: 'GET',
                    description: 'Convert text to binary or binary to text',
                    parameters: [
                        { name: 'text', type: 'text', required: true, description: 'Text to convert', example: 'Hello' },
                        { name: 'action', type: 'select', required: true, options: ['encode', 'decode'], default: 'encode', description: 'Conversion direction' }
                    ]
                }
            ]
        }
    ]
};
console.log('✅ API Config Part 1 loaded');