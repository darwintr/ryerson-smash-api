import mongoose  from 'mongoose'
import db from '../../db';
import CHARACTERS from '../constants/Characters';
import STAGES from '../constants/Stages';
const Schema = mongoose.Schema;

function validateMain(c) {
    return Object.keys(CHARACTERS).includes(c);
}

let stageObj = { wins: { type: Number, default: 0 } , losses: { type: Number, default: 0 } };

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
    },
    secondary: {
        type: String,
        validate: {
            validator: validateMain,
            msg: 'Invalid character name'
        },
        lowercase: true
    },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    stages: {
        bf: stageObj,
        dl: stageObj,
        ps: stageObj,
        fd: stageObj,
        ys: stageObj,
        other: stageObj
    }
});

playerSchema.index({name: 1, tag: 1}, { unique: true });
playerSchema.plugin(db.autoIncrement.plugin, 'PlayerID');

export default playerSchema;