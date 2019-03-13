const jwt = require('jsonwebtoken');

const env = require(__root + 'src/config/environment');

function verifyToken(req, res, next) {

    const token = req.headers['x-access-token'];
    if(!token) return res.status(403).send({auth: false, message: 'No token provided.'});

    jwt.verify(token, env.secret, function(err, decoded) {
        if(err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;