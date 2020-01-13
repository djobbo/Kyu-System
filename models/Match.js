const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    teamIDs: [String],
    bracket: String,
    state: String,
    score: String
});

module.exports = mongoose.model('Match', matchSchema);