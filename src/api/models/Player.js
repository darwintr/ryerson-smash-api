import mongoose  from 'mongoose'
import db from '../../db';
import CHARACTERS from '../constants/Characters';
const Schema = mongoose.Schema;

function validateMain(c) {
    return Object.keys(CHARACTERS).includes(c);
}

const playerSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'PlayerID' },
    name: { type: String, required: true},
    tag: { type: String, required: true},
    main: { type: String,
        validate: {
            validator: validateMain,
            msg: 'Invalid character name'
        },
        required: true,
        lowercase: true
    }
});

playerSchema.index({name: 1, tag: 1}, { unique: true });


playerSchema.plugin(db.autoIncrement.plugin, 'PlayerID');

module.exports = playerSchema;