const logger = require(__app + 'services/logger');

class ErrorUtil {
    handleError(res, err) {
        if (err instanceof Error) {
            logger.error(err.message);
            return res.status(500).json({message: err.message});
        }
    
        logger.error(err);
        return res.status(500).json({message: err});
    }

    handleValidationErrors(res, validationErrors) {
        return res.status(400).json({messsage: 'Validation errors', error: validationErrors});
    }
}

module.exports = new ErrorUtil;