const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const faker = require('faker');
const chai = require('chai');
const _ = require('lodash');
const server = require('../../../index');

/* eslint prefer-destructuring: 0 */
const expect = chai.expect;
chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## User APIs', () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  let user = {
    email,
    password,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  describe('# POST /api/auth/register', () => {
    it('should create a new user', (done) => {
      request(server)
        .post('/api/auth/register')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.not.equal('');
          expect(res.body.token).to.not.equal(undefined);
          expect(res.body.user.email).to.equal(user.email);
          expect(res.body.user.firstName).to.equal(user.firstName);
          expect(res.body.user.lastName).to.equal(user.lastName);
          expect(res.body.user.password).to.equal(undefined); // Password should be removed.
          user = res.body.user;
          user.token = res.body.token;
          done();
        })
        .catch(done);
    });
    it('should not create a new user as duplicate email', (done) => {
      const registerPayload = {
        email,
        password,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      request(server)
        .post('/api/auth/register')
        .send(registerPayload)
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          expect(res.body.message).to.equal('Email must be unique');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should login the new user', (done) => {
      const loginPayload = { email, password };
      request(server)
        .post('/api/auth/login')
        .send(loginPayload)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.not.equal('');
          expect(res.body.token).to.not.equal(undefined);
          expect(res.body.user.email).to.equal(user.email);
          expect(res.body.user.firstName).to.equal(user.firstName);
          expect(res.body.user.lastName).to.equal(user.lastName);
          expect(res.body.user.password).to.equal(undefined); // Password should be removed.
          user = res.body.user;
          user.token = res.body.token;
          done();
        })
        .catch(done);
    });
    it('should error when wrong password is provided', (done) => {
      const loginPayload = { email, password: faker.random.alphaNumeric(8) };
      request(server)
        .post('/api/auth/login')
        .send(loginPayload)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('User email and password combination do not match');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(server)
        .get(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${user.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });

    it('should get user details when token is passed in query', (done) => {
      request(server)
        .get(`/api/users/${user._id}?token=${user.token}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(server)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .set({ Authorization: `Bearer ${user.token}` })
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('No such user exists!');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      user.firstName = faker.name.firstName();
      const payload = _.pick(user, ['firstName', 'lastName', 'email']);
      request(server)
        .put(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${user.token}` })
        .send(payload)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(server)
        .get('/api/users')
        .set({ Authorization: `Bearer ${user.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      const invalidId = '56z787zzz67fc';
      request(server)
        .get(`/api/users/${invalidId}`)
        .set({ Authorization: `Bearer ${user.token}` })
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal(`Cast to ObjectId failed for value "${invalidId}" at path "_id" for model "User"`);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/profile', () => {
    it('should get user profile', (done) => {
      request(server)
        .get('/api/users/profile')
        .set({ Authorization: `Bearer ${user.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });
  });
  describe('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      request(server)
        .delete(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${user.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });
    it('should throw 404 error if the user was already deleted', (done) => {
      request(server)
        .delete(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${user.token}` })
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.be.equal('No such user exists!');
          done();
        })
        .catch(done);
    });
    it('should throw 404 error when requesting user profile when user is deleted', (done) => {
      request(server)
        .get('/api/users/profile')
        .set({ Authorization: `Bearer ${user.token}` })
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.be.equal('No such user exists!');
          done();
        })
        .catch(done);
    });
  });
});
