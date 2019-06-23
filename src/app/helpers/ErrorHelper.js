const logger = require('../services/logger');

class ErrorHelper {
    static error(res, err) {
        logger.error(err.message);
        return res.status(500).json({message: err.message});
    }

    static validations(res, validationErrors) {
        return res.status(400).json({messsage: 'Validation errors', error: validationErrors});
    }
}

module.exports = ErrorHelper;