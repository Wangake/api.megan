// API Configuration - Part 2 of 4
window.apiConfigPart2 = {
    categories: [
        {
            id: 'tools-continued',
            name: 'Tools (Continued)',
            icon: 'fas fa-tools',
            endpoints: [
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
        }
    ]
};
console.log('✅ API Config Part 2 loaded');