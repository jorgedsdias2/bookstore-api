const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mongoose = require('mongoose');
const rewire = require('rewire');
const jwt = require('jsonwebtoken');

const app = rewire('../../../server');
const restHelper = require('../helpers/RestHelper')(app);

const sandbox = sinon.createSandbox();

describe('Route Author', function() {
    let anyAuthor;
    let anotherAuthor;
    let listAuthors;
    let findStub;
    let createStub;
    let findUpdateStub;
    let findRemoveStub;
    let findByIdStub;
    let jwtStub;

    beforeEach(function() {
        anyAuthor = { id: 1, name: 'Anyauthor' };
        anotherAuthor = { id: 2, name: 'Anotherauthor' };

        listAuthors = [
            anyAuthor,
            anotherAuthor
        ];

        sandbox.restore();
        findStub = sandbox.stub(mongoose.Model, 'find').resolves(listAuthors);
        createStub = sandbox.stub(mongoose.Model, 'create').resolves(anyAuthor);
        findUpdateStub = sandbox.stub(mongoose.Model, 'findByIdAndUpdate').resolves(anyAuthor);
        findRemoveStub = sandbox.stub(mongoose.Model, 'findByIdAndRemove').resolves(anyAuthor);
        findByIdStub = sandbox.stub(mongoose.Model, 'findById').resolves(anyAuthor);
        jwtStub = sandbox.stub(jwt, 'verify').callsArgWith(2, false, {});
    });

    afterEach(function() {
        sandbox.restore();
    });
    
    context('POST /', function() {
        it('should return a list of authors', function(done) {
            restHelper.get({
                url: '/api/authors',
                data: {},
                status: 200,
                token: 'any-token'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(findStub).to.have.been.calledOnce;
                expect(jwtStub).to.have.been.calledOnce;
                expect(result.body).to.have.nested.property('authors[0].name').to.equal('Anyauthor');
                expect(result.body).to.have.nested.property('authors[1].name').to.equal('Anotherauthor');
                done();
            });
        });
    });
    
    context('POST /author', function() {
        it('should return 400 if name is invalid', function(done) {
            restHelper.post({
                url: '/api/authors/author',
                data: {},
                status: 400,
                token: 'any-token'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(jwtStub).to.have.been.calledOnce;
                expect(result.body.error).to.have.nested.property('name.msg').to.equal('Name can not be empty');
                done();
            });
        });
        
        it('should save an author', function(done) {
            restHelper.post({
                url: '/api/authors/author',
                data: {name: anyAuthor.name},
                status: 200,
                token: 'any-token'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(jwtStub).to.have.been.calledOnce;
                expect(createStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('message').to.equal(result.body.author.name + ' as created');
                done();
            });
        });
    });

    context('PUT /author/:id', function() {
        it('should return 400 if name is invalid', function(done) {
            restHelper.put({
                url: '/api/authors/author/' + anyAuthor.id,
                data: {},
                status: 400,
                token: 'any-token'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(jwtStub).to.have.been.calledOnce;
                expect(result.body.error).to.have.nested.property('name.msg').to.equal('Name can not be empty');
                done();
            });
        });

        it('should update an author', function(done) {
            restHelper.put({
                url: '/api/authors/author/' + anyAuthor.id,
                data: {name: anyAuthor.name},
                status: 200,
                token: 'any-token'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(jwtStub).to.have.been.calledOnce;
                expect(findUpdateStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('message').to.equal(result.body.author.name +  ' as updated');
                done();
            });
        });
    });

    context('DELETE /author/:id', function() {
        it('should remove an author', function(done) {
            restHelper.delete({
                url: '/api/authors/author/' + anyAuthor.id,
                status: 200,
                token: 'any-token'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(jwtStub).to.have.been.calledOnce;
                expect(findRemoveStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('message').to.equal(anyAuthor.name + ' was deleted');
                done();
            });
        });
    });

    context('GET /author/:id', function() {
        it('should return an author', function(done) {
            restHelper.get({
                url: '/api/authors/author/' + anyAuthor.id,
                status: 200,
                token: 'any-token'
            }, function(err, result) {
                expect(err).to.not.exist;
                expect(jwtStub).to.have.been.calledOnce;
                expect(findByIdStub).to.have.been.calledOnce;
                expect(result.body).to.have.property('message').to.equal(anyAuthor.name + ' as found');
                expect(result.body).to.have.property('author').to.deep.include(anyAuthor);
                done();
            });
        });
    });
});