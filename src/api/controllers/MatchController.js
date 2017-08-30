import express from 'express';
import db from '../../db';
import Models from '../models/ModelIndex';
import * as charas from '../constants/Characters';
import * as stages from '../constants/Stages'
import bodyParser from 'body-parser';

let router = express.Router();
router.use(bodyParser.urlencoded( { extended: true } ));
router.use(bodyParser.json());
let Match = db.model('Match', Models.MatchModel);

router.get('/', (req, res) => {

    Match.find()
        .then((p, e) => {
            if(e){
                throw 'Database error';
            } else{
                res.status(200).send(p)
            }
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});

router.post('/', (req, res) => {
    console.log(req.body);
    if(!req.body.players || !req.body.stage){
        return res.status(400).send('Bad Request');
    }

    let newMatch =  new Match({
        players: req.body.players,
        winners: req.body.winners,
        stage: req.body.stage
    });



    newMatch.save()
        .then((p, e) => {
            if (e) {
                throw 'Database error';
            } else {
                res.status(200).send('Successfully added Match');
                //console.log(p);
            }
        }, function(err){
            //console.log(err);
            res.status(400).send(err.message.replace(', ', "\n"));
        });
});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {
    if(!req.query.id){
        return res.status(400).send("Bad Request");
    }

    Match.findByIdAndRemove({_id : req.query.id})
        .then((p, e) =>{
            if(e){
                res.status(400).send("Failed to delete");
            }else{
                res.status(200).send("Match deleted");
            }
        });
});

module.exports = router;