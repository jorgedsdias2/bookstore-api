const express = require('express');
const router = express.Router();
const User = require(__root + 'src/app/db/user');
const verifyToken = require(__root + 'src/app/auth/verify-token');

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const env = require(__root + 'src/config/environment');

router.post('/register', function(req, res) {
    
    const hashedPassword = bcryptjs.hashSync(req.body.password, 8);
    const userdata = {email: req.body.email, password: hashedPassword};

    User.create(userdata, function(err, user) {
        if(err) return res.status(500).send(err);

        const token = jwt.sign({id: user._id}, env.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).json({auth: true, token: token});
    });
});

router.get('/me', verifyToken, function(req, res) {
    User.findById(req.userId, {password: 0}, function(err, user) {
        if(err) return res.status(500).send(err);
        if(!user) return res.status(404).send('No user found.');
            
        res.status(200).json(user);
    });
});

module.exports = router;