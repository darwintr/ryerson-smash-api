let express = require('express');
let Models = require('../models/ModelIndex');
let db = require('../../db');
let bodyParser = require('body-parser');
let Rating = require('../lib/rating');

let router = express.Router();

let Match = db.model('Match', Models.MatchModel);

router.get("/", (req, res) => {

});

router.post("/", (req, res) => {

});

router.put("/", (req, res) => {

});

router.delete("/", (req, res) => {

});





