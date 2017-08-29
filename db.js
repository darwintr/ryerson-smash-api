const AUTH = require('./auth');
const db = require('mongoose');

db.Promise = global.Promise;
db.connect(AUTH.DBURL, { useMongoClient: true } );


module.exports = db;
