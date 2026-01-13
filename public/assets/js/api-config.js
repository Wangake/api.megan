// API Configuration - This will be loaded first
const apiConfig = {
    baseUrl: window.location.origin,
    categories: [
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
                    name: 'Hash',
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
                    name: 'Binary',
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
                    name: 'Anagram',
                    path: '/api/tools/anagram',
                    method: 'GET',
                    description: 'Find anagrams of a word',
                    parameters: [
                        { name: 'word', type: 'text', required: true, description: 'Word to find anagrams for', example: 'listen' }
                    ]
                },
                {
                    name: 'Palindrome',
                    path: '/api/tools/palindrome',
                    method: 'GET',
                    description: 'Check if text is a palindrome',
                    parameters: [
                        { name: 'text', type: 'text', required: true, description: 'Text to check', example: 'racecar' },
                        { name: 'type', type: 'select', required: false, options: ['check', 'generate'], default: 'check', description: 'Check or generate palindrome' }
                    ]
                },
                {
                    name: 'Acronym',
                    path: '/api/tools/acronym',
                    method: 'GET',
                    description: 'Create acronym from phrase',
                    parameters: [
                        { name: 'phrase', type: 'text', required: true, description: 'Phrase to convert to acronym', example: 'Application Programming Interface' }
                    ]
                },
                {
                    name: 'UUID',
                    path: '/api/tools/uuid',
                    method: 'GET',
                    description: 'Generate UUIDs',
                    parameters: [
                        { name: 'count', type: 'number', required: false, default: '1', description: 'Number of UUIDs to generate' }
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
                    name: 'Credit Card Validator',
                    path: '/api/validators/credit-card',
                    method: 'GET',
                    description: 'Validate credit card number',
                    parameters: [
                        { name: 'number', type: 'text', required: true, description: 'Credit card number', example: '4111111111111111' }
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
                }
            ]
        },
        {
            id: 'generators',
            name: 'Generators',
            icon: 'fas fa-magic',
            endpoints: [
                {
                    name: 'Random Number',
                    path: '/api/generators/random-number',
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
                        { name: 'type', type: 'select', required: true, options: ['user', 'address', 'company'], default: 'user', description: 'Type of data to generate' }
                    ]
                },
                {
                    name: 'Quote',
                    path: '/api/generators/quote',
                    method: 'GET',
                    description: 'Generate random inspirational quote',
                    parameters: []
                },
                {
                    name: 'Joke',
                    path: '/api/generators/joke',
                    method: 'GET',
                    description: 'Generate random joke',
                    parameters: []
                }
            ]
        },
        {
            id: 'web',
            name: 'Web Tools',
            icon: 'fas fa-globe',
            endpoints: [
                {
                    name: 'HTTP Status',
                    path: '/api/web/http-status',
                    method: 'GET',
                    description: 'Get HTTP status code information',
                    parameters: [
                        { name: 'code', type: 'number', required: true, description: 'HTTP status code', example: '200' }
                    ]
                },
                {
                    name: 'MIME Type',
                    path: '/api/web/mime-type',
                    method: 'GET',
                    description: 'Get MIME type for file extension',
                    parameters: [
                        { name: 'extension', type: 'text', required: true, description: 'File extension', example: 'html' }
                    ]
                },
                {
                    name: 'User Agent',
                    path: '/api/web/user-agent',
                    method: 'GET',
                    description: 'Get random user agent string',
                    parameters: []
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
                    name: 'Timezone',
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
            id: 'media',
            name: 'Media',
            icon: 'fas fa-photo-video',
            endpoints: [
                {
                    name: 'YouTube Search',
                    path: '/api/youtube/ytsearch',
                    method: 'GET',
                    description: 'Search YouTube videos',
                    parameters: [
                        { name: 'q', type: 'text', required: true, description: 'Search query', example: 'music' }
                    ]
                }
            ]
        }
    ]
};

// Log that config is loaded
console.log('✅ API Configuration loaded successfully');