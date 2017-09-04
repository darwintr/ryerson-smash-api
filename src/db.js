let AUTH = require('./auth');
let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;
const db = mongoose.connect(AUTH.DBURL, { useMongoClient: true } );

autoIncrement.initialize(db);

db.autoIncrement = autoIncrement;
module.exports = db;

