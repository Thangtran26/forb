const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, default:""},
    gmail: {type: String, default:""},
    password: {type: String, default:""},
    name: {type: String, default:""},
    avatar: {type: String, default:""},
    sex: {type: String, default:"others"},
    age: {type: Number, default: 10},
    birthday: {type: String, default:""},
    interest:{type: String, default:"all"},
    career: {type: String, default:""},
    address: {type: String, default:""},
    description: {type: String, default:""},
    userlikedme: Array,
    minage :{type: Number, default: 0},
    maxage: {type: Number, default: 100},
    image: {type: String, default:""},
    token: String,
    date: Array,
});
const User = mongoose.model('users',userSchema);
module.exports = User;
