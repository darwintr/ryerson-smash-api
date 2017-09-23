let mongoose = require('mongoose');
let db = require('../../db');

const Schema = mongoose.Schema;

const setSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'SetID' },
    matches : {type: [Number], ref: 'Match' }
});

matchSchema.plugin(db.autoIncrement.plugin, 'SetID');

module.exports = setSchema;