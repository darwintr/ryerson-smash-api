import express from 'express';
import db from '../../db';
import Models from '../models/ModelIndex';
import * as charas from '../constants/Characters';
import * as stages from '../constants/Stages'
import bodyParser from 'body-parser';

let router = express.Router();
router.use(bodyParser.urlencoded( { extended: true } ));
router.use(bodyParser.json());

let Player = db.model('Player', Models.PlayerModel);
let Match = db.model('Match', Models.MatchModel);

router.get('/', (req, res) => {
    let queries = {};
    if(req.query.id){
        queries._id = parseInt(req.query.id);
    }

    Match.find(queries)
        .then((p, e) => {
            if(e){
                throw 'Database error';
            } else{
                if(p.length)
                    return res.status(200).send(p);
                else
                    return res.status(404).send("MatchID not found.");
            }
        })
        .catch((e) => {
            return res.status(500).send(e);
        });
});

router.post('/', (req, res) => {

    console.log(req.body);
    if(!req.body.players || !req.body.stage){
        return res.status(400).send('Bad Request');
    }

    let pids = [];
    for( let player in req.body.players){
        if (req.body.players.hasOwnProperty(player)) {
            console.log(req.body.players[player]);
            pids.push(req.body.players[player]._playerID);
        }

    }

    Player.find({_id: {$in: pids}})
        .then((p, e) => {
            return new Promise((resolve) => {
                    console.log(p);
                    if (e) {
                        throw 'Database error';
                    }
                    if (p.length!==req.body.players.length) {
                        console.log(p);
                        throw 'Player does not exist error'
                    }
                    resolve();
                }
            )
        }).then(()=> {
            let newMatch =  new Match({
                players: req.body.players,
                stage: req.body.stage
            });
            newMatch.save()
                    .then((p, e) => {
                        if (e) {
                            throw 'error';
                        } else {
                            res.status(200).send('Successfully added Match');
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.status(400).send(err.message.replace(', ', '\n'));
                    });

        }).catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });

});

router.put('/', (req, res) => {
    if(!req.body.players && !req.body.stage){
        return res.status(400).send('Bad Request');
    }
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