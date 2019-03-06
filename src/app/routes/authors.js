const express = require('express');
const router = express.Router();
const Author = require(__root + 'src/app/db/author');
const verifyToken = require(__root + 'src/app/auth/verify-token');

let status = 0;
let message = '';

router.post('/author', verifyToken, function(req, res) {
    req.assert('name', 'Name can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return res.status(400).send({error: validationErrors});

    Author.create(req.body)
    .then(author => {
        message = 'Author created - ID: ' + author.id;
        console.log(message);
        res.status(200).send({message: message, author: author});
    })
    .catch(err => {
        message = 'Author not created.';
        console.log(message);
        res.status(500).send({message: message, error: err});
    });
});

router.get('/author/:id', verifyToken, function(req, res) {
    const id = req.params.id;
    
    Author.findById(id)
    .then(author => {
        if(!author) {
            message = 'Author not found - ID: ' + id;
            status = 404;
        } else {
            message = 'Author found - ID: ' + author.id;
            status = 200;
        }
        
        console.log(message);
        res.status(status).send({message: message, author: author});
    })
    .catch(err => {
        message = 'Author error.';
        console.log(message);
        res.status(500).send({message: message, error: err});
    });
});

module.exports = router;
