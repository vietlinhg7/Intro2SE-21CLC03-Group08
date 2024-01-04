const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    hoTen: String,
    email: String,
    sdt: String,
    role: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;