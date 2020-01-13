const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    playerIDs: [String]
});

module.exports = mongoose.model('Team', teamSchema);