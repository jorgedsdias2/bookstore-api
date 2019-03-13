global.__root = __dirname + '/';
global.__app = __root + 'src/app/';

const app = require('./src/config/custom-express')();

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});

module.exports = app;