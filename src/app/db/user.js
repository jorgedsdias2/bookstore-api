const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});

const User = mongoose.model('User', UserSchema);

userdata = {email: 'admin@bookstore.com.br', password: bcryptjs.hashSync('admin', 8)};
User.findOneAndUpdate({email: userdata.email}, userdata, {upsert: true}, function (err, user) {
    if(err) console.log(err);
    if(!user) {
        console.log('User admin is created.');
    }
});

module.exports = User;