// Export all controllers from this file to keep server.js clean

let PlayerController = require('./PlayerController');
let MatchController =require('./MatchController');
let SetController = require('./SetController');

module.exports = {
    PlayerController,
    MatchController,
    SetController
};