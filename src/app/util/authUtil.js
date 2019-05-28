const jwt = require('jsonwebtoken');

class AuthUtil {
    generateToken(user) {
        const token = jwt.sign({id: user._id}, __secret, {
            expiresIn: 86400 // expires in 24 hours
        });
    
        return token;
    }
}

module.exports = new AuthUtil;