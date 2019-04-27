const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const User = require(__app + 'db/user');
const verifyToken = require(__app + 'auth/verify-token');
const logger = require(__app + 'services/logger');
const errorUtil = require(__app + 'util/errorUtil');

router.post('/login', function(req, res) {
    let message;

    req.assert('email', 'Email can not be empty or invalid').notEmpty().isEmail();
    req.assert('password', 'Password can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return res.status(400).json(validationErrors);

    User.findOne({email: req.body.email}).then(user => {
        const passwordIsValid = (user ? bcryptjs.compareSync(req.body.password, user.password): false);
        if(user && passwordIsValid) {
            const token = jwt.sign({id: user._id}, __secret, {
                expiresIn: 86400 // expires in 24 hours
            });
    
            message = 'User ' + user.name + ' is authenticated';
            logger.info(message);
            res.status(200).json({message: message, token: token});
        } else {
            message = 'Authentication failed for User: ' + req.body.email;
            logger.error(message);
            res.status(401).json({message: message});
        }
    }).catch(err => {
        errorUtil.handleError(res, err);
    });
});

router.get('/logout', function(req, res) {
    res.status(200).json({token: null});
});

router.post('/register', function(req, res) {
    let message;

    req.assert('email', 'Email can not be empty or invalid').notEmpty().isEmail();
    req.assert('name', 'Name can not be empty').notEmpty();
    req.assert('password', 'Password can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return res.status(400).json(validationErrors);
    
    const hashedPassword = bcryptjs.hashSync(req.body.password, 8);
    const userdata = {email: req.body.email, name: req.body.name, password: hashedPassword};

    User.create(userdata).then(user => {
        const token = jwt.sign({id: user._id}, __secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        message = user.name + ' registered';
        logger.info(message);
        res.status(200).json({message: message, token: token});
    }).catch(err => {
        errorUtil.handleError(res, err);
    });
});

router.get('/me', verifyToken, function(req, res) {
    User.findById(req.userId).then(user => {
        if(user) {
            message = user.name + ' is authorized';
            logger.info(message);
            res.status(200).json({message: message, user: user});
        } else {
            message = 'User not authorized';
            logger.error(message);
            return res.status(401).json({message: message});
        }
    }).catch(err => {
        errorUtil.handleError(res, err);
    });
});

module.exports = router;