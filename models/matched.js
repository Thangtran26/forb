const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchedSchema = new Schema({
    userid: {type: String, default: ""},
    socketid: {type: String, default: ""},
    username: {type: String, default: ""},
    avatar: {type: String, default:""},

});
const Match = mongoose.model('match',matchedSchema);
module.exports = Match;
