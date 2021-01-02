const request = require('supertest')
const app = require('../src/app')
const factory = require('./factories')
const Usr = require('../src/models/user')
const faker = require('faker')

describe('SignUp', () => {

  beforeEach(async () => {
    await Usr.deleteMany()
  })

  it('should create a new user', async () => {

    let response = await request(app)
      .post('/signup')
      .send({
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

    expect(response.status).toBe(201)

  })

  it('should not create a new user when there are missing fields', async () => {

    let response = await request(app)
      .post('/signup')
      .send({
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

    expect(response.status).toBe(400)

  })

  it('should not create a new user when there are invalid fields', async () => {

    let response = await request(app)
      .post('/signup')
      .send({
        firstName: '',
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

    expect(response.status).toBe(400)

  })

  it('should not create a new user when the email already exists', async () => {

    let user = await factory.create('User')

    let response = await request(app)
      .post('/signup')
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: user.email,
        password: faker.internet.password(),
        phones: [
          {
            number: faker.phone.phoneNumber('99#######'),
            area_code: faker.random.number(99),
            country_code: faker.phone.phoneNumber('+###')
          }
        ]
      })

    expect(response.status).toBe(400)

  })

})


describe('SignIn', () => {

  beforeEach(async () => {
    await Usr.deleteMany()
  })
    
  it('should authenticate with valid credentials', async () => {

    let user = await factory.create('User', { password: '123456' })

    // console.log(user)

    let response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(200)

  })

  it('should not authenticate with invalid credentials', async () => {

    let user = await factory.create('User')

    let response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(401)

  })

  it('should return a JWT when authenticated with valid credentials', async () => {

    let user = await factory.create('User', { password: '123456' })

    let response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.body).toHaveProperty('token')

  })

})

describe('Me', () => {

  beforeEach(async () => {
    await Usr.deleteMany()
  })
    
  it("should return user's information when called with a valid JWT", async () => {

    let response
    let user = await factory.create('User', { password: '123456' })

    response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        password: '123456'
      })

    let token = response.body.token

    response = await request(app)
      .get('/me')
      .set({
        authorization: 'Bearer ' + token
      })

    expect(response.status).toBe(200)

  })

  it("should not return user's information when called with a invalid JWT", async () => {

    let response
    let user = await factory.create('User', { password: '123456' })

    response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        password: '123456'
      })

    let token = response.body.token

    response = await request(app)
      .get('/me')
      .set({
        authorization: token
      })

    expect(response.status).toBe(401)

  })

  it("should not return user's information when called with a valid JWT of a user that doesn't exist", async () => {

    let response
    let user = await factory.create('User', { password: '123456' })

    response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        password: '123456'
      })

    let token = response.body.token

    await Usr.deleteMany()

    response = await request(app)
      .get('/me')
      .set({
        authorization: 'Bearer ' + token
      })

    expect(response.status).toBe(404)

  })

})
