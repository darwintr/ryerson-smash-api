import mongoose  from 'mongoose'
import db from '../../db';
import * as charas from './../constants/Characters';
import * as stages from './../constants/Stages';

const Schema = mongoose.Schema;

const stageArray = [];
for(var stage in stages.STAGES){
    stageArray.push(stage);
}
const charaArray = [];

for(var char in charas.CHARACTERS){
    charaArray.push(char);
}

const participantSchema = new Schema({
    tag : {type: String, required: [true, "Need a player Tag"]},
    character: {type: String, enum: charaArray, required: [true, "Need a character"]},
    winner: {type: Boolean, required: [true, 'Need whether they won or not.']}
}, {_id: false});

const matchSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'MatchID' },
    players: {type : [participantSchema], required: [true, "Need players"], validate: [minArray, 'Can only have 2-4 players in']},
    stage: {type: String, enum: stageArray, required: [true, "Need a stage."]}

});

function minArray(val){
    return val.length > 1 && val.length < 5;
}

matchSchema.plugin(db.autoIncrement.plugin, 'MatchID');

module.exports = matchSchema;