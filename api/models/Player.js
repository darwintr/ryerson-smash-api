const mongoose  = require('mongoose'),
    autoIncrement   = require('mongoose-auto-increment'),
    db              = require('../../db');
    Schema          = mongoose.Schema;

autoIncrement.initialize(db);

const playerSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'PlayerID' },
    name: String,
    tag: String,
    main: String
});

playerSchema.plugin(autoIncrement.plugin, 'PlayerID');

module.exports = playerSchema;