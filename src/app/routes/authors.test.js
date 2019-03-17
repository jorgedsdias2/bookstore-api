const chai = require('chai');
const expect = chai.expect;
const request = require("supertest");
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mongoose = require('mongoose');
const rewire = require('rewire');

const app = rewire('../../../server');

const sandbox = sinon.createSandbox();

describe('Route Author', function() {
    context('POST /author', function() {});

    context('GET /author/:id', function() {});

    context('PUT /author/:id', function() {});

    context('DELETE /author/:id', function() {});
});