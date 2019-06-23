const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');
const morgan = require('morgan');

require('../../src/config/database');
require('../../src/config/environment');
const logger = require('../app/services/logger');

module.exports = () => {
    const app = express();
    
    app.use(morgan("common", {
        stream: {
            write: function(mensagem) {
                logger.info(mensagem);
            }
        }
    }));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method
            delete req.body._method
            return method
        }
    }));
    
    app.use(expressValidator());

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
        next();
    });
    
    app.get('/api', function(req, res) {
        res.status(200).json({message: 'API works.'});
    });

    const auth = require('../app/routes/auth');
    const authors = require('../app/routes/authors');
    
    app.use('/api/auth', auth);
    app.use('/api/authors', authors);

    // 404
    app.use((req, res, next) => {
        return res.status(404).json({message: '404 - Page Not Found.'});
    });

    // 500
    app.use((err, req, res) => {
        res.status = err.status || 500;
        return res.json({message: res.status + '. An unknown error has occured.'});
    });

    return app;
}