const mongoose = require('mongoose');

const Schema = mongoose.Schema

const UserSchema = new Schema({
    googleId: {
        required: false,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
    },
    photoURL: {
        type: String,
        required: false
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User