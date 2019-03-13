const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');
const morgan = require('morgan');

require(__root + 'src/config/database');
require(__root + 'src/config/environment');
const logger = require(__app + 'services/logger');

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
    
    app.get('/api', function(req, res) {
        res.status(200).json({message: 'API works.'});
    });

    const auth = require(__root + 'src/app/routes/auth');
    const authors = require(__root + 'src/app/routes/authors');
    
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