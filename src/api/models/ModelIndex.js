// Export all models from this file to keep server.js clean

let PlayerModel = require('./Player');
let MatchModel = require('./Match');

module.exports = {
    PlayerModel,
    MatchModel
};