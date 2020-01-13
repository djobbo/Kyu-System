const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const queueSchema = new Schema({
    playerID: String,
    state: String,
    bracket: String
});

module.exports = mongoose.model('Queue', queueSchema);