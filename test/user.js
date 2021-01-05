const chai = require('chai');
const chaiHttp = require('chai-http');
const dotenv = require('dotenv');
const UserModel = require('../src/models/user');

// Setup test dot env
dotenv.config({path: '.env.test'});

const server = require('../src/app');

const should = chai.should();
chai.use(chaiHttp);

before((done) => {
  // Clear database
  UserModel.deleteMany({}, {}, () => {
    done();
  });
});

describe('User', () => {
  const example = {
    firstName: "Maradona",
    lastName: "Morais",
    phones: [{
      number: 852,
      area_code: 74,
      country_code: "+55"
    }],
    password: "strong_password",
    email: "maradona@hotmail.com"
  };

  let token;

  describe('POST /signup', () => {

    it('Should signup a new user', (done) => {
      chai.request(server)
        .post('/signup')
        .send(example)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');

          token = res.body.token;
  
          done();
        });
    });

    it('Should not accept missing values', (done) => {
      for (let field in example) {
        let exampleClone = {...example};
        delete exampleClone[field];

        chai.request(server)
          .post('/signup')
          .send(exampleClone)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('message');
            res.body.should.have.property('errorCode', 400);
          });
      }
      done();
    });

    it('Should not accept already registered emails', (done) => {
      chai.request(server)
        .post('/signup')
        .send(example)
        .end((err, res) => {
          res.body.should.have.property('message', 'E-mail already exists');
          res.body.should.have.property('errorCode', 400);
          res.should.have.status(400);
          
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('Should sign a user in', (done) => {
      chai.request(server)
        .post('/signin')
        .send({
          email: 'maradona@hotmail.com',
          password: 'strong_password'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');

          done();
        });
    });

    it('Should not accept wrong password', (done) => {
      chai.request(server)
        .post('/signin')
        .send({
          email: 'maradona@hotmail.com',
          password: 'string_password'
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('errorCode', 401);
          res.body.should.have.property('message', 'Invalid e-mail or password');

          done();
        });
    });

    it('Should not signin not existing email', (done) => {
      chai.request(server)
        .post('/signin')
        .send({
          email: 'maradana@hotmail.com',
          password: 'strong_password'
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('errorCode', 401);
          res.body.should.have.property('message', 'Invalid e-mail or password');

          done();
        });
    });

    it('Should not accept empty values', (done) => {
      chai.request(server)
        .post('/signin')
        .send({})
        .end((err, res) => {
          res.should.has.status(400);
          res.body.should.have.property('message', 'Missing fields');
          res.body.should.have.property('errorCode', 400);

          done();
        });
    });
  });

  describe('GET /me', () => {
    it('Should return user data', (done) => {
      chai.request(server)
        .get('/me')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.has.status(200);
          res.body.should.have.property('firstName', 'Maradona');
          res.body.should.have.property('lastName', 'Morais');
          res.body.should.have.property('email', 'maradona@hotmail.com');
          
          done();
        });
    });

    it('Should request token', (done) => {
      chai.request(server)
        .get('/me')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message', 'Unauthorized');
          res.body.should.have.property('errorCode', 401);

          done();
        });
    });
  });
});

after(() => {
  process.exit();
})