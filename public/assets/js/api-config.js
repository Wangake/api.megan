// API Configuration - Complete Version
const apiConfig = {
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
                },
                {
                    name: 'Video AI',
                    path: '/api/ai/video',
                    method: 'GET',
                    description: 'AI video processing tools',
                    parameters: [
                        { name: 'action', type: 'select', required: true, options: ['generate', 'edit', 'enhance'], default: 'generate', description: 'Video action to perform' },
                        { name: 'description', type: 'text', required: true, description: 'Video description', example: 'sunset over mountains' }
                    ]
                },
                {
                    name: 'Video AI 2',
                    path: '/api/ai/video2',
                    method: 'GET',
                    description: 'Advanced AI video generation',
                    parameters: [
                        { name: 'prompt', type: 'text', required: true, description: 'Detailed video prompt', example: 'cinematic shot of space station' },
                        { name: 'style', type: 'select', required: false, options: ['realistic', 'anime', 'cartoon'], default: 'realistic', description: 'Video style' }
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
                },
                {
                    name: 'Morse Code',
                    path: '/api/tools/morse',
                    method: 'GET',
                    description: 'Convert text to morse code or decode morse',
                    parameters: [
                        { name: 'text', type: 'text', required: true, description: 'Text to convert', example: 'SOS' },
                        { name: 'action', type: 'select', required: true, options: ['encode', 'decode'], default: 'encode', description: 'Conversion direction' }
                    ]
                },
                {
                    name: 'Anagram Finder',
                    path: '/api/tools/anagram',
                    method: 'GET',
                    description: 'Find anagrams of a word',
                    parameters: [
                        { name: 'word', type: 'text', required: true, description: 'Word to find anagrams for', example: 'listen' }
                    ]
                },
                {
                    name: 'Palindrome Checker',
                    path: '/api/tools/palindrome',
                    method: 'GET',
                    description: 'Check if text is a palindrome',
                    parameters: [
                        { name: 'text', type: 'text', required: true, description: 'Text to check', example: 'racecar' },
                        { name: 'type', type: 'select', required: false, options: ['check', 'generate'], default: 'check', description: 'Check or generate palindrome' }
                    ]
                },
                {
                    name: 'Acronym Creator',
                    path: '/api/tools/acronym',
                    method: 'GET',
                    description: 'Create acronym from phrase',
                    parameters: [
                        { name: 'phrase', type: 'text', required: true, description: 'Phrase to convert to acronym', example: 'Application Programming Interface' }
                    ]
                },
                {
                    name: 'UUID Generator',
                    path: '/api/tools/uuid',
                    method: 'GET',
                    description: 'Generate UUIDs',
                    parameters: [
                        { name: 'count', type: 'number', required: false, default: '1', description: 'Number of UUIDs to generate' }
                    ]
                },
                {
                    name: 'All-in-One Tools',
                    path: '/api/tools/aio',
                    method: 'GET',
                    description: 'Multiple tools in one endpoint',
                    parameters: [
                        { name: 'tool', type: 'select', required: true, options: ['base64', 'hash', 'binary'], default: 'base64', description: 'Tool to use' },
                        { name: 'text', type: 'text', required: true, description: 'Text to process', example: 'Hello World' }
                    ]
                }
            ]
        },
        {
            id: 'generators',
            name: 'Generators',
            icon: 'fas fa-magic',
            endpoints: [
                {
                    name: 'Random Numbers',
                    path: '/api/generators/random-numbers',
                    method: 'GET',
                    description: 'Generate random numbers within range',
                    parameters: [
                        { name: 'min', type: 'number', required: true, default: '1', description: 'Minimum value' },
                        { name: 'max', type: 'number', required: true, default: '100', description: 'Maximum value' },
                        { name: 'count', type: 'number', required: false, default: '1', description: 'How many numbers to generate' }
                    ]
                },
                {
                    name: 'Fake Data',
                    path: '/api/generators/fake-data',
                    method: 'GET',
                    description: 'Generate fake user data',
                    parameters: [
                        { name: 'type', type: 'select', required: true, options: ['user', 'address', 'company', 'product'], default: 'user', description: 'Type of data to generate' },
                        { name: 'count', type: 'number', required: false, default: '1', description: 'Number of records to generate' }
                    ]
                },
                {
                    name: 'Inspirational Quote',
                    path: '/api/generators/quote',
                    method: 'GET',
                    description: 'Generate random inspirational quote',
                    parameters: []
                },
                {
                    name: 'Random Joke',
                    path: '/api/generators/joke',
                    method: 'GET',
                    description: 'Generate random joke',
                    parameters: []
                }
            ]
        },
        {
            id: 'image',
            name: 'Image Tools',
            icon: 'fas fa-image',
            endpoints: [
                {
                    name: 'Fire Logo Generator',
                    path: '/api/image/firelogo',
                    method: 'GET',
                    description: 'Generate fire effect logos',
                    parameters: [
                        { name: 'text', type: 'text', required: true, description: 'Logo text', example: 'MEGAN' },
                        { name: 'color', type: 'select', required: false, options: ['red', 'blue', 'green', 'purple'], default: 'red', description: 'Fire color' }
                    ]
                },
                {
                    name: 'Flux AI Image',
                    path: '/api/image/flux',
                    method: 'GET',
                    description: 'Flux AI image generation',
                    parameters: [
                        { name: 'prompt', type: 'text', required: true, description: 'Image description', example: 'sunset over mountains' },
                        { name: 'size', type: 'select', required: false, options: ['512x512', '1024x1024', '1920x1080'], default: '512x512', description: 'Image dimensions' }
                    ]
                },
                {
                    name: 'Image Processing',
                    path: '/api/image/image',
                    method: 'GET',
                    description: 'Image processing and manipulation tools',
                    parameters: [
                        { name: 'url', type: 'url', required: true, description: 'Image URL', example: 'https://example.com/image.jpg' },
                        { name: 'action', type: 'select', required: true, options: ['resize', 'crop', 'filter'], default: 'resize', description: 'Action to perform' }
                    ]
                }
            ]
        },
        {
            id: 'validators',
            name: 'Validators',
            icon: 'fas fa-check-circle',
            endpoints: [
                {
                    name: 'Email Validator',
                    path: '/api/validators/email',
                    method: 'GET',
                    description: 'Validate email address format',
                    parameters: [
                        { name: 'email', type: 'email', required: true, description: 'Email to validate', example: 'user@example.com' }
                    ]
                },
                {
                    name: 'JSON Validator',
                    path: '/api/validators/json',
                    method: 'GET',
                    description: 'Validate JSON string',
                    parameters: [
                        { name: 'json', type: 'text', required: true, description: 'JSON string to validate', example: '{"name": "John", "age": 30}' }
                    ]
                },
                {
                    name: 'Phone Validator',
                    path: '/api/validators/phone',
                    method: 'GET',
                    description: 'Validate phone number format',
                    parameters: [
                        { name: 'phone', type: 'tel', required: true, description: 'Phone number to validate', example: '+254712345678' }
                    ]
                },
                {
                    name: 'URL Validator',
                    path: '/api/validators/url',
                    method: 'GET',
                    description: 'Validate URL format',
                    parameters: [
                        { name: 'url', type: 'url', required: true, description: 'URL to validate', example: 'https://example.com' }
                    ]
                },
                {
                    name: 'IP Validator',
                    path: '/api/validators/ip',
                    method: 'GET',
                    description: 'Validate IP address',
                    parameters: [
                        { name: 'ip', type: 'text', required: true, description: 'IP address to validate', example: '8.8.8.8' }
                    ]
                },
                {
                    name: 'Password Strength',
                    path: '/api/validators/password-strength',
                    method: 'GET',
                    description: 'Check password strength',
                    parameters: [
                        { name: 'password', type: 'password', required: true, description: 'Password to check', example: 'Test123!' }
                    ]
                },
                {
                    name: 'Credit Card Validator',
                    path: '/api/validators/credit-card',
                    method: 'GET',
                    description: 'Validate credit card number',
                    parameters: [
                        { name: 'number', type: 'text', required: true, description: 'Credit card number', example: '4111111111111111' }
                    ]
                }
            ]
        },
        {
            id: 'web',
            name: 'Web Tools',
            icon: 'fas fa-globe',
            endpoints: [
                {
                    name: 'HTTP Status Codes',
                    path: '/api/web/http-status',
                    method: 'GET',
                    description: 'Get HTTP status code information',
                    parameters: [
                        { name: 'code', type: 'number', required: true, description: 'HTTP status code', example: '200' }
                    ]
                },
                {
                    name: 'MIME Type Lookup',
                    path: '/api/web/mime-type',
                    method: 'GET',
                    description: 'Get MIME type for file extension',
                    parameters: [
                        { name: 'extension', type: 'text', required: true, description: 'File extension', example: 'html' }
                    ]
                },
                {
                    name: 'User Agent Generator',
                    path: '/api/web/user-agent',
                    method: 'GET',
                    description: 'Get random user agent string',
                    parameters: []
                }
            ]
        },
        {
            id: 'media',
            name: 'Media',
            icon: 'fas fa-photo-video',
            endpoints: [
                {
                    name: 'YouTube Search',
                    path: '/api/media/ytsearch',
                    method: 'GET',
                    description: 'Search YouTube videos',
                    parameters: [
                        { name: 'q', type: 'text', required: true, description: 'Search query', example: 'music' },
                        { name: 'limit', type: 'number', required: false, default: '10', description: 'Number of results' }
                    ]
                },
                {
                    name: 'YouTube Downloader',
                    path: '/api/media/ytdown',
                    method: 'GET',
                    description: 'YouTube video downloader',
                    parameters: [
                        { name: 'url', type: 'url', required: true, description: 'YouTube video URL', example: 'https://youtube.com/watch?v=...' },
                        { name: 'quality', type: 'select', required: false, options: ['low', 'medium', 'high'], default: 'medium', description: 'Video quality' }
                    ]
                }
            ]
        },
        {
            id: 'social',
            name: 'Social Media',
            icon: 'fas fa-share-alt',
            endpoints: [
                {
                    name: 'Facebook Tools',
                    path: '/api/social/facebook',
                    method: 'GET',
                    description: 'Facebook data and tools',
                    parameters: [
                        { name: 'action', type: 'select', required: true, options: ['profile', 'post', 'download'], default: 'profile', description: 'Action to perform' },
                        { name: 'url', type: 'url', required: true, description: 'Facebook URL', example: 'https://facebook.com/...' }
                    ]
                },
                {
                    name: 'Instagram Tools',
                    path: '/api/social/instagram',
                    method: 'GET',
                    description: 'Instagram data and tools',
                    parameters: [
                        { name: 'action', type: 'select', required: true, options: ['profile', 'post', 'reels'], default: 'profile', description: 'Action to perform' },
                        { name: 'username', type: 'text', required: true, description: 'Instagram username', example: 'instagram' }
                    ]
                },
                {
                    name: 'TikTok Tools',
                    path: '/api/social/tiktok',
                    method: 'GET',
                    description: 'TikTok data and tools',
                    parameters: [
                        { name: 'action', type: 'select', required: true, options: ['video', 'profile', 'trending'], default: 'video', description: 'Action to perform' },
                        { name: 'url', type: 'url', required: true, description: 'TikTok URL', example: 'https://tiktok.com/...' }
                    ]
                },
                {
                    name: 'X (Twitter) Tools',
                    path: '/api/social/x',
                    method: 'GET',
                    description: 'X (formerly Twitter) data and tools',
                    parameters: [
                        { name: 'action', type: 'select', required: true, options: ['tweet', 'profile', 'search'], default: 'tweet', description: 'Action to perform' },
                        { name: 'username', type: 'text', required: false, description: 'Twitter username', example: 'twitter' }
                    ]
                }
            ]
        },
        {
            id: 'time',
            name: 'Time Tools',
            icon: 'fas fa-clock',
            endpoints: [
                {
                    name: 'Timestamp',
                    path: '/api/time/timestamp',
                    method: 'GET',
                    description: 'Get current timestamp',
                    parameters: []
                },
                {
                    name: 'Timezone Converter',
                    path: '/api/time/timezone',
                    method: 'GET',
                    description: 'Convert time between timezones',
                    parameters: [
                        { name: 'from', type: 'text', required: true, default: 'UTC', description: 'Source timezone', example: 'UTC' },
                        { name: 'to', type: 'text', required: true, default: 'Africa/Nairobi', description: 'Target timezone', example: 'Africa/Nairobi' }
                    ]
                }
            ]
        },
        {
            id: 'youtube',
            name: 'YouTube Tools',
            icon: 'fab fa-youtube',
            endpoints: [
                {
                    name: 'YouTube Search',
                    path: '/api/youtube/ytsearch',
                    method: 'GET',
                    description: 'Search YouTube videos',
                    parameters: [
                        { name: 'q', type: 'text', required: true, description: 'Search query', example: 'music' },
                        { name: 'limit', type: 'number', required: false, default: '10', description: 'Number of results' }
                    ]
                },
                {
                    name: 'YouTube Downloader',
                    path: '/api/youtube/ytdown',
                    method: 'GET',
                    description: 'YouTube video downloader',
                    parameters: [
                        { name: 'url', type: 'url', required: true, description: 'YouTube video URL', example: 'https://youtube.com/watch?v=...' },
                        { name: 'quality', type: 'select', required: false, options: ['low', 'medium', 'high'], default: 'medium', description: 'Video quality' }
                    ]
                }
            ]
        }
    ]
};

// Calculate total endpoints
function calculateTotalEndpoints() {
    let total = 0;
    apiConfig.categories.forEach(category => {
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
    console.log(`✅ API Configuration loaded successfully - ${totalEndpoints} endpoints across ${apiConfig.categories.length} categories`);
});