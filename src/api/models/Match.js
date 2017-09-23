let mongoose = require('mongoose');
let db = require('../../db');
let CHARACTERS =  require('./../constants/Characters');
let STAGES = require('./../constants/Stages');

const Schema = mongoose.Schema;

function validateCharacter(c){
    return Object.keys(CHARACTERS).includes(c);
}

function validateStage(c){
    return Object.keys(STAGES).includes(c);
}

function minArray(val){
    return val.length > 1 && val.length < 5;
}

function checkWinnerCount(val){
    let winCount = Math.floor(val.length/2);
    for(let player in val){
        if(val[player].winner){winCount-=1;}
    }
    return winCount===0;
}

const playerValidators = [
    {validator: minArray, msg : 'Can only have 2-4 players in'},
    {validator: checkWinnerCount, msg: 'Your winner count is off.' }];

const participantSchema = new Schema({
    //tag : {type: String, required: [true, "Need a player Tag"]},
    //name : {type : String, required: [true, "Need player name"]},
    _playerID: {type: Number, ref: 'Player', required: [true, "need a player ID"]},
    character: {type: String, validate: validateCharacter, required: [true, "Need a character"]},
    winner: {type: Boolean, required: [true, 'Need whether they won or not.']}
}, {_id: false});

const matchSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'MatchID' },
    players: {type : [participantSchema], required: [true, "Need players"], validate: minArray},
    stage: {type: String, validate: validateStage , required: [true, "Need a stage."]}

});

matchSchema.path('players').validate(checkWinnerCount, "Your winner count is off.");
/*
participantSchema.pre('validate', function(next) {
    Players.find({_id: this.player})
        .then((p, e) => {
            return new Promise((resolve) => {
                    if (e) {
                        throw 'Database error';
                    }
                    if (p.length) {
                        resolve(true)
                    }
                    resolve(false);
                }
            )
        });
});
*/
matchSchema.plugin(db.autoIncrement.plugin, 'MatchID');

module.exports = matchSchema;