let express = require('express');
let Models = require('../models/ModelIndex');
let db = require('../../db');
let bodyParser = require('body-parser');

let router = express.Router();

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

    console.log('POST /match : ')
    console.log(req.body);

    if(!req.body.players || !req.body.stage){
        return res.status(400).send('Bad Request');
    }

    let pids = [];
    let winners = [];
    let losers = [];
    for( let player in req.body.players){
        if (req.body.players.hasOwnProperty(player)) {
            let p = req.body.players[player]
            console.log(p);
            pids.push(p._playerID);
            if (p.winner) {
                winners.push(p._playerID);
            } else {
                losers.push(p._playerID)
            }
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

    Player.updateMany({_id: {$in: winners} },
            {$inc: {wins: 1, [`stages.${req.body.stage}.wins`]: 1}})
        .then((p, e) => {
            if (e) {
                throw 'Database error: while updating winners'
            } else {
                console.log('Successfully updated wins')
            }
        }).catch((e) => {
            console.log(e);
            res.status(400).send(e);
        });

    Player.updateMany({_id: {$in: losers} },
            {$inc: {losses: 1, [`stages.${req.body.stage}.losses`]: 1}})
        .then((p, e) => {
            if (e) {
                throw 'Database error: while updating losers'
            } else {
                console.log('Successfully updated losses')
            }
        }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
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