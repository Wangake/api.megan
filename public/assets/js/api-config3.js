// API Configuration - Part 3 of 4
window.apiConfigPart3 = {
    categories: [
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
                }
            ]
        }
    ]
};
console.log('✅ API Config Part 3 loaded');