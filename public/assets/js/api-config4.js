// API Configuration - Part 4 of 4
window.apiConfigPart4 = {
    categories: [
        {
            id: 'validators-continued',
            name: 'Validators (Continued)',
            icon: 'fas fa-check-circle',
            endpoints: [
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
console.log('✅ API Config Part 4 loaded');