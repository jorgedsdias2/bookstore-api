const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');
const database = require(__root + 'src/config/database');

module.exports = () => {
    const app = express();

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
    
    app.get('/api', function(req, res) {
        res.status(200).send('API works.');
    });

    const auth = require(__root + 'src/app/routes/auth');
    app.use('/api/auth', auth);

    return app;
}