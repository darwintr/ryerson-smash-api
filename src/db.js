import AUTH from './auth';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

mongoose.Promise = global.Promise;
const db = mongoose.connect(AUTH.DBURL, { useMongoClient: true } );

autoIncrement.initialize(db);

module.exports = db;
