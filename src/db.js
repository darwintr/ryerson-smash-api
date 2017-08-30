import AUTH from './auth';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const db = mongoose.connect(AUTH.DBURL, { useMongoClient: true } );
db.Promise = global.Promise;
autoIncrement.initialize(db);

module.exports = db;
