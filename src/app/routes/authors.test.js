const chai = require('chai');
const expect = chai.expect;
const request = require("supertest");
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mongoose = require('mongoose');
const rewire = require('rewire');
const jwt = require('jsonwebtoken');

const app = rewire('../../../server');

const sandbox = sinon.createSandbox();

describe('Route Author', function() {
    let sampleAuthor;
    let anotherAuthor;
    let listAuthors;
    let findStub;
    let jwtStub;

    let getApp = function(params, callbak) {
        request(app).get(params.url)
        .send(params.data)
        .set('x-access-token', params.token)
        .expect(params.status)
        .end(callbak);
    }

    let postApp = function(params, callbak) {
        request(app).post(params.url)
        .send(params.data)
        .set('x-access-token', params.token)
        .expect(params.status)
        .end(callbak);
    }

    beforeEach(function() {
        sampleAuthor = { name: 'Anyauthor' };
        anotherAuthor = { name: 'Anotherauthor' };

        listAuthors = [
            sampleAuthor,
            anotherAuthor
        ];

        sandbox.restore();
        findStub = sandbox.stub(mongoose.Model, 'find').resolves(listAuthors);
        jwtStub = sandbox.stub(jwt, 'verify').callsArgWith(2, false, {});
    });

    afterEach(function() {
        sandbox.restore();
    });
    
    context('POST /', function() {
        it('should catch 500 error if there is one', function(done) {
            sandbox.restore();
            findStub = sandbox.stub(mongoose.Model, 'find').rejects(new Error('fake'));
            jwtStub = sandbox.stub(jwt, 'verify').callsArgWith(2, false, {});

            getApp({
                url: '/api/authors',
                author: {},
                status: 500,
                token: 'token-test-1'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(findStub).to.have.been.calledOnce;
                expect(jwtStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('error').to.equal('fake');
                done();
            });
        });

        it('should return a list of authors', function(done) {
            getApp({
                url: '/api/authors',
                data: {},
                status: 200,
                token: 'token-test-2'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(findStub).to.have.been.calledOnce;
                expect(result.body).to.have.nested.property('authors[0].name').to.equal('Anyauthor');
                expect(result.body).to.have.nested.property('authors[1].name').to.equal('Anotherauthor');
                done();
            });
        });
    });
    
    // context('POST /author', function() {});

    // context('GET /author/:id', function() {});

    // context('PUT /author/:id', function() {});

    // context('DELETE /author/:id', function() {});
});
