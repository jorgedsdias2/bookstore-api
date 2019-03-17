const logger = require(__app + 'services/logger');

class ErrorUtil {
    handleError(res, err) {
        if (err instanceof Error) {
            logger.error(err.message);
            return res.status(500).json({ error: err.message });
        }
    
        logger.error(err);
        return res.status(500).json(err);
    }
}

module.exports = new ErrorUtil;