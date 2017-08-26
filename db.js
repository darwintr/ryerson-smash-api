const AUTH = require('./auth');

const db = require('mongoose');

db.connect(`mongodb://${AUTH.USER}:${AUTH.PASS}@ds161483.mlab.com:61483/ryerson-smash-db`, { useMongoClient: true } );


module.exports = db;