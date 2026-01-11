const faker = require('faker');

module.exports = async function fakeDataHandler(req, res, startTime) {
    const { 
        type = 'user', 
        count = 1,
        locale = 'en_US',
        seed 
    } = req.query;
    
    const countNum = Math.min(parseInt(count), 100);
    
    if (seed) {
        faker.seed(parseInt(seed));
    }
    
    let data = [];
    const generators = {
        user: () => ({
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            address: {
                street: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode(),
                country: faker.address.country()
            },
            company: faker.company.companyName(),
            job: faker.name.jobTitle(),
            avatar: faker.image.avatar(),
            website: faker.internet.url(),
            bio: faker.lorem.paragraph()
        }),
        product: () => ({
            id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            material: faker.commerce.productMaterial(),
            color: faker.commerce.color(),
            image: faker.image.imageUrl(),
            rating: faker.datatype.float({ min: 1, max: 5, precision: 0.1 }),
            inStock: faker.datatype.boolean()
        }),
        company: () => ({
            id: faker.datatype.uuid(),
            name: faker.company.companyName(),
            catchPhrase: faker.company.catchPhrase(),
            bs: faker.company.bs(),
            logo: faker.image.business(),
            type: faker.company.companySuffix(),
            industry: faker.commerce.department(),
            founded: faker.date.past(30).getFullYear(),
            employees: faker.datatype.number({ min: 10, max: 10000 })
        })
    };
    
    const generator = generators[type] || generators.user;
    
    for (let i = 0; i < countNum; i++) {
        data.push(generator());
    }
    
    return {
        success: true,
        type: type,
        count: countNum,
        locale: locale,
        seed_used: seed || 'random',
        data: data,
        schema: Object.keys(data[0] || {}),
        formats: {
            json: data,
            csv: convertToCSV(data),
            xml: convertToXML(data, type)
        }
    };
};

function convertToCSV(data) {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => 
        headers.map(header => JSON.stringify(obj[header] || '')).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
}

function convertToXML(data, type) {
    const items = data.map(item => 
        Object.entries(item).map(([key, value]) => 
            `<${key}>${value}</${key}>`
        ).join('')
    );
    return `<?xml version="1.0"?><${type}s>${items.map(item => `<${type}>${item}</${type}>`).join('')}</${type}s>`;
}