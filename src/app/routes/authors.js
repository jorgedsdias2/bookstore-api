const express = require('express');
const router = express.Router();

const Author = require(__app + 'db/author');
const verifyToken = require(__app + 'auth/verify-token');
const logger = require(__app + 'services/logger');
const errorUtil = require(__app + 'util/errorUtil');

router.get('/', verifyToken, function(req, res) {
    Author.find({}).then(authors => {
        res.status(200).send({authors: authors});
    }).catch(err => {
        errorUtil.handleError(res, err);
    });
});

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
        errorUtil.handleError(res, err);
    });
});

router.put('/author/:id', verifyToken, function(req, res) {
    let message = '';

    req.assert('name', 'Name can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return res.status(400).send(validationErrors);

    Author.findByIdAndUpdate(req.params.id, req.body).then(author => {
        message = 'Author updated - ID: ' + author.id;
        logger.info(message);
        res.status(200).send({message: message, author: author});
    }).catch(err => {
        errorUtil.handleError(res, err);
    });
});

router.delete('/author/:id', verifyToken, function(req, res) {
    let message = '';

    Author.findByIdAndRemove(req.params.id).then(author => {
        message = author.name + ' was deleted';
        logger.info(message);
        res.status(200).send({message: message});
    }).catch(err => {
        errorUtil.handleError(res, err);
    });
});

router.get('/author/:id', verifyToken, function(req, res) {
    let message = '';
    const id = req.params.id;
    
    Author.findById(id).then(author => {
        if(author) {
            console.log(id);
            console.log(author);
            message = 'Author found - ID: ' + author.id;
            logger.info(message);
            res.status(200).send({message: message, author: author});
        } else {
            message = 'Author not found - ID: ' + id;
            logger.error(message);
            res.status(404).send({message: message});
        }
    }).catch(err => {
        errorUtil.handleError(res, err);
    });
});

module.exports = router;