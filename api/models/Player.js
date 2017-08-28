const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: String,
    tag: String,
    main: String
});


module.exports = playerSchema;