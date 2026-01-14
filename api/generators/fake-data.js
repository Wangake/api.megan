const { faker } = require('@faker-js/faker');

module.exports = async function fakeDataHandler(req, res, startTime) {
  const {
    type = 'user',
    count = 1,
    locale = 'en'
  } = req.query;

  faker.locale = locale;

  const limit = Math.min(parseInt(count) || 1, 20);
  const records = [];

  for (let i = 0; i < limit; i++) {
    let record;

    switch (type) {
      case 'user':
        record = {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          avatar: faker.image.avatar(),
          created_at: faker.date.past()
        };
        break;

      case 'company':
        record = {
          id: faker.string.uuid(),
          name: faker.company.name(),
          industry: faker.company.buzzPhrase(),
          domain: faker.internet.domainName(),
          email: faker.internet.email(),
          location: faker.location.city()
        };
        break;

      case 'address':
        record = {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          country: faker.location.country(),
          postal_code: faker.location.zipCode()
        };
        break;

      case 'product':
        record = {
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
          category: faker.commerce.department()
        };
        break;

      default:
        return {
          success: false,
          error: 'Invalid type',
          supported_types: ['user', 'company', 'address', 'product']
        };
    }

    records.push(record);
  }

  return {
    success: true,
    generator: 'faker-js',
    type,
    count: records.length,
    records
  };
};