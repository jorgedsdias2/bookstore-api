const request = require('supertest');

class RestUtil {
    constructor(app) {
        this._app = app;
    }

    get(params, callbak) {
        if(!params.token) params.token = '';
        request(this._app).get(params.url)
        .send(params.data)
        .set('x-access-token', params.token)
        .expect(params.status)
        .end(callbak);
    }
    
    post(params, callbak) {
        if(!params.token) params.token = '';
        request(this._app).post(params.url)
        .send(params.data)
        .set('x-access-token', params.token)
        .expect(params.status)
        .end(callbak);
    }
    
    put(params, callbak) {
        if(!params.token) params.token = '';
        request(this._app).put(params.url)
        .send(params.data)
        .set('x-access-token', params.token)
        .expect(params.status)
        .end(callbak);
    }
    
    delete(params, callbak) {
        if(!params.token) params.token = '';
        request(this._app).delete(params.url)
        .set('x-access-token', params.token)
        .expect(params.status)
        .end(callbak);
    }
}

module.exports = function(app) {
    return new RestUtil(app);
}