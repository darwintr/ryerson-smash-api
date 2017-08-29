import AUTH from './auth';
import mongoose from 'mongoose';


const db = mongoose.connect(AUTH.DBURL, { useMongoClient: true } );
db.Promise = global.Promise;

module.exports = db;
