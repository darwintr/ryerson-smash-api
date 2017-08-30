import mongoose  from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema;

const matchSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'MatchID' },
    players: [[String, String]],
    winners: [Number],
    stage: String

});

matchSchema.plugin(autoIncrement.plugin, 'MatchID');

module.exports = matchSchema;