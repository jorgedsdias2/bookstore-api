const chai = require('chai');
const expect = chai.expect;
const request = require("supertest");
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const rewire = require('rewire');

const app = rewire('../../../server');

const sandbox = sinon.createSandbox();

describe('Route Auth', function() {
    let sampleUser;
    let findStub;
    let createStub;
    const unHashedPassword = '123456';
    const hashedPassword = bcryptjs.hashSync(unHashedPassword, 8);

    let postApp = function(params, callbak) {
        request(app).post(params.url)
        .send(params.data)
        .expect(params.status)
        .end(callbak);
    }

    beforeEach(function() {
        sampleUser = {
            email: 'admin-test@bookstore.com.br',
            name: 'Admin',
            password: hashedPassword
        };

        sandbox.restore();
        findStub = sandbox.stub(mongoose.Model, 'findOne').resolves(sampleUser);
        createStub = sandbox.stub(mongoose.Model, 'create').resolves(sampleUser);
    });

    afterEach(function() {
        sandbox.restore();
    });

    context('POST /login', function() {
        it('should catch 500 error if there is one', function(done) {
            sandbox.restore();
            findStub = sandbox.stub(mongoose.Model, 'findOne').rejects(new Error('fake'));

            postApp({
                url: '/api/auth/login',
                data: {email: sampleUser.email, password: unHashedPassword},
                status: 500
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(findStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('error').to.equal('fake');
                done();
            });
        });

        it('should return 400 if email or password is invalid', function(done) {
            postApp({
                url: '/api/auth/login',
                data: {},
                status: 400
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(result.body).to.have.nested.property('email.msg').to.equal('Email can not be empty or invalid');
                expect(result.body).to.have.nested.property('password.msg').to.equal('Password can not be empty');
                done();
            });
        });

        it('should return 401 unauthorized if email or password is incorrect', function(done) {
            postApp({
                url: '/api/auth/login',
                data: {email: sampleUser.email, password: 'wrong password'},
                status: 401
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(result.body).to.have.property('message').to.equal('Authentication failed for User: ' + sampleUser.email);
                done();
            });
        });

        it('should login a user success', function(done) {
            postApp({
                url: '/api/auth/login',
                data: {email: sampleUser.email, password: unHashedPassword},
                status: 200
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(findStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('message').to.equal('User ' + sampleUser.name + ' is authenticated');
                done();
            });
        });
    });

    context('GET /logout', function() {
        it('should logout user and return token null', function(done) {
            request(app).get('/api/auth/logout')
            .expect(200)
            .end(function(err, result) {
                expect(err).to.not.exist;
                expect(result.body).to.have.property('token').null;
                done();
            });
        });
    });

    context('POST /register', function() {
        it('should catch 500 error if there is one', function(done) {
            sandbox.restore();
            findStub = sandbox.stub(mongoose.Model, 'create').rejects(new Error('fake'));

            postApp({
                url: '/api/auth/register',
                data: {email: sampleUser.email, name: sampleUser.name, password: unHashedPassword},
                status: 500
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(findStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('error').to.equal('fake');
                done();
            });
        });

        it('should return 400 if email, name or password is invalid', function(done) {
            postApp({
                url: '/api/auth/register',
                data: {},
                status: 400
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(result.body).to.have.nested.property('email.msg').to.equal('Email can not be empty or invalid');
                expect(result.body).to.have.nested.property('name.msg').to.equal('Name can not be empty');
                expect(result.body).to.have.nested.property('password.msg').to.equal('Password can not be empty');
                done();
            });
        });

        it('should user registered', function(done) {
            postApp({
                url: '/api/auth/register',
                data: {email: sampleUser.email, name: sampleUser.name, password: unHashedPassword},
                status: 200
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(createStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('message').to.equal(sampleUser.name + ' registered');
                done();
            });
        });
    });
});
