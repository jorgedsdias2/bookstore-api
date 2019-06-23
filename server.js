const app = require('./src/config/custom-express')();

const port = process.env.PORT || 3000;

if(!module.parent) {
    app.listen(port, function() {
        console.log('Express server listening on port ' + port);
    });
}

module.exports = app;