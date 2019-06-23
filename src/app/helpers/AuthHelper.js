const jwt = require('jsonwebtoken');
const environment = require('../../../src/config/environment');

class AuthHelper {
    static generateToken(user) {
        const token = jwt.sign({id: user._id}, __secret, {
            expiresIn: 86400 // expires in 24 hours
        });
    
        return token;
    }

    static verifyToken(req, res, next) {

        const token = req.headers['x-access-token'];
        if(!token) return res.status(403).send({message: 'No token provided.'});
    
        jwt.verify(token, __secret, function(err, decoded) {
            if(err) return res.status(500).send({message: 'Failed to authenticate token.'});
            
            req.userId = decoded.id;
            next();
        });
    }
}

module.exports = AuthHelper;