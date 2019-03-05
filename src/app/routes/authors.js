const express = require('express');
const router = express.Router();
const Author = require(__root + 'src/app/db/author');
const verifyToken = require(__root + 'src/app/auth/verify-token');

router.post('/author', verifyToken, function(req, res) {
    req.assert('name', 'Name can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return res.status(400).send(validationErrors);

    Author.create(req.body)
    .then(author => {
        console.log('Author created - ID: ' + author.id);
        res.status(200).send(author);
    })
    .catch(err => {
        console.log('Author not created - Error: ' + err);
        res.status(500).send(err);
    });
});

router.get('/author/:id', verifyToken, function(req, res) {
    const id = req.params.id;

    Author.findById(id)
    .then(author => {
        console.log('Author found - ID: ' + author.id)
        res.status(200).send(author);
    })
    .catch(err => {
        console.log('Author not found - Error: ' + err)
        res.status(500).send(err);
    });
});

module.exports = router;