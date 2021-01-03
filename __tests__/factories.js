const { factory } = require('factory-girl')
const faker = require('faker')

const User = require('../src/models/User')

// sets locale to BR
faker.locale = "pt_BR";

factory.define('User', User, {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phones: [
        {
            number: faker.phone.phoneNumber('99#######'),
            area_code: faker.random.number(99),
            country_code: faker.phone.phoneNumber('+###')
        }
    ]
})

module.exports = factory

