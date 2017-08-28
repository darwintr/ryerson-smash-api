const AUTH = require('./auth');
const db = require('mongoose');

db.connect(AUTH.DBURL, { useMongoClient: true } );


module.exports = db;
