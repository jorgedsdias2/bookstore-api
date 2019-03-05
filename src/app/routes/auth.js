const express = require('express');
const router = express.Router();
const User = require(__root + 'src/app/db/user');
const verifyToken = require(__root + 'src/app/auth/verify-token');

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const env = require(__root + 'src/config/environment');

router.post('/login', function(req, res) {
    req.assert('email', 'Email can not be empty or invalid').notEmpty().isEmail();
    req.assert('password', 'Password can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return res.status(400).send(validationErrors);

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) return res.status(500).send(err);
        if(!user) return res.status(404).send({message: 'No user found.'});

        const passwordIsValid = bcryptjs.compareSync(req.body.password, user.password);
        if(!passwordIsValid) return res.status(401).send({auth: false, token: null});

        const token = jwt.sign({id: user._id}, env.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({auth: true, token: token});
    });
});

router.get('/logout', function(req, res) {
    res.status(200).send({auth: false, token: null});
});

router.post('/register', function(req, res) {
    req.assert('email', 'Email can not be empty or invalid').notEmpty().isEmail();
    req.assert('password', 'Password can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return res.status(400).send(validationErrors);
    
    const hashedPassword = bcryptjs.hashSync(req.body.password, 8);
    const userdata = {email: req.body.email, password: hashedPassword};

    User.create(userdata, function(err, user) {
        if(err) return res.status(500).send(err);

        const token = jwt.sign({id: user._id}, env.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({auth: true, token: token});
    });
});

router.get('/me', verifyToken, function(req, res) {
    User.findById(req.userId, {password: 0}, function(err, user) {
        if(err) return res.status(500).send(err);
        if(!user) return res.status(404).send({message: 'No user found.'});
            
        res.status(200).send(user);
    });
});

module.exports = router;