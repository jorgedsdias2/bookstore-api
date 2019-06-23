const express = require('express');
const router = express.Router();

const Author = require('../db/author');
const logger = require('../services/logger');
const authHelper = require('../helpers/AuthHelper');
const errorHelper = require('../helpers/ErrorHelper');

router.get('/', authHelper.verifyToken, function(req, res) {
    Author.find({}).then(authors => {
        res.status(200).send({authors: authors});
    }).catch(err => {
        errorHelper.error(res, err);
    });
});

router.post('/author', authHelper.verifyToken, function(req, res) {
    let message = '';

    req.assert('name', 'Name can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return errorHelper.validations(res, validationErrors);

    Author.create(req.body).then(author => {
        message = author.name + ' as created';
        logger.info(message);
        res.status(200).send({message: message, author: author});
    }).catch(err => {
        errorHelper.error(res, err);
    });
});

router.put('/author/:id', authHelper.verifyToken, function(req, res) {
    let message = '';

    req.assert('name', 'Name can not be empty').notEmpty();

    const validationErrors = req.validationErrors(true);

    if(validationErrors) return errorHelper.validations(res, validationErrors);

    Author.findByIdAndUpdate(req.params.id, req.body).then(author => {
        message = author.name + ' as updated';
        logger.info(message);
        res.status(200).send({message: message, author: author});
    }).catch(err => {
        errorHelper.error(res, err);
    });
});

router.delete('/author/:id', authHelper.verifyToken, function(req, res) {
    let message = '';

    Author.findByIdAndRemove(req.params.id).then(author => {
        message = author.name + ' was deleted';
        logger.info(message);
        res.status(200).send({message: message});
    }).catch(err => {
        errorHelper.error(res, err);
    });
});

router.get('/author/:id', authHelper.verifyToken, function(req, res) {
    let message = '';
    const id = req.params.id;
    
    Author.findById(id).then(author => {
        message = author.name + ' as found';
        logger.info(message);
        res.status(200).send({message: message, author: author});
    }).catch(err => {
        errorHelper.error(res, err);
    });
});

module.exports = router;