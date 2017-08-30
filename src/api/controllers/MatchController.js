import express from 'express';
import db from '../../db';
import MatchSchema from '../models/Match';
import * as charas from '../constants/Characters';
import * as stages from '../constants/Stages'
import bodyParser from 'body-parser';

let router = express.Router();
//router.use(bodyParser.urlencoded( { extended: true } ));
router.use(bodyParser.json);
let Match = db.model('Match', MatchSchema);
