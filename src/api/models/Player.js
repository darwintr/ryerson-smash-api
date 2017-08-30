import mongoose  from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import db from '../../db';

const Schema = mongoose.Schema;



const playerSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'PlayerID' },
    name: String,
    tag: String,
    main: String
});

playerSchema.plugin(autoIncrement.plugin, 'PlayerID');

module.exports = playerSchema;