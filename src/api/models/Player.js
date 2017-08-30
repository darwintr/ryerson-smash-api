import mongoose  from 'mongoose'
import db from '../../db';
const Schema = mongoose.Schema;



const playerSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'PlayerID' },
    name: String,
    tag: String,
    main: String
});

playerSchema.plugin(db.autoIncrement.plugin, 'PlayerID');

module.exports = playerSchema;