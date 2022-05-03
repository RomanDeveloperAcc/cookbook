const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const db = require('../assets/constants/db');

const connection = mongoose.createConnection(db);

autoIncrement.initialize(connection);

const userSchema = new Schema({
    userId: {
        type: Number,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required : true
    },
    password: {
        type: String,
        unique: false,
        required : true,
        minlength: [8, 'Password is not strong!']
    },
});

userSchema.plugin(autoIncrement.plugin, {model: 'user', field: 'userId'});
module.exports = mongoose.model('user', userSchema, 'auth');
