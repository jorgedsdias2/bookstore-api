const express = require('express');
const router = express.Router();
const User = require(__root + 'src/app/db/user');

router.get('/user/:id', function(req, res) {
    const id = req.params.id;
    User.findById(id, function(err, user) {
        if(err) res.status(500).send(err);
        res.status(200).json(user);
    });
});

module.exports = router;