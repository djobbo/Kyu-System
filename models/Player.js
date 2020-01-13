const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    userID: String,
    bracket: String
});

module.exports = mongoose.model('Player', playerSchema);