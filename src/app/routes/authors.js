const express = require('express');
const router = express.Router();

const Author = require(__app + 'db/author');
const verifyToken = require(__app + 'auth/verify-token');
const logger = require(__app + 'services/logger');

router.post('/author', verifyToken, function(req, res) {
    let message = '';

    req.assert('name', 'Name can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return res.status(400).send(validationErrors);

    Author.create(req.body).then(author => {
        message = 'Author created - ID: ' + author.id;
        logger.info(message);
        res.status(200).send({message: message, author: author});
    }).catch(err => {
        handleError(res, err);
    });
});

router.get('/author/:id', verifyToken, function(req, res) {
    let message = '';
    const id = req.params.id;
    
    Author.findById(id).then(author => {
        if(author) {
            message = 'Author found - ID: ' + author.id;
            logger.info(message);
            res.status(200).send({message: message, author: author});
        } else {
            message = 'Author not found - ID: ' + id;
            logger.info(message);
            res.status(404).send({message: message});
        }
    }).catch(err => {
        handleError(res, err);
    });
});

function handleError(res, err) {
    if (err instanceof Error) {
        logger.info(err.message);
        return res.status(500).json({ error: err.message });
    }

    logger.info(err);
    return res.status(500).json(err);
}

module.exports = router;
