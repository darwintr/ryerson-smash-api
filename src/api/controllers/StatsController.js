import express from 'express';
import db from '../../db';
import Models from '../models/ModelIndex';
import bodyParser from 'body-parser';

let router = express.Router();
router.use(bodyParser.urlencoded( { extended: true } ));
router.use(bodyParser.json());
let Stats = db.Model();

