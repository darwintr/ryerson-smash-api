let express = require('express');
let Models = require('../models/ModelIndex');
let db = require('../../db');
let bodyParser = require('body-parser');
let Rating = require('../lib/rating');

let router = express.Router();

let Player = db.model('Player', Models.PlayerModel);
let Match = db.model('Match', Models.MatchModel);



const  matchQueryValidator = (query) => {
    let queryObject = {};
    if(query.players && query.players!==[]) {
        queryObject.players = {};
        queryObject.players.$all = [];
    }
    if (query.stage)
        queryObject.stage = query.stage;


    for(let index in query.players){
        if(!query.players[index]._playerID && !query.players[index].character)
            return {};
        let playerObject = {};
        if(query.players[index].hasOwnProperty('_playerID'))
            playerObject._playerID = query.players[index]._playerID;
        if(query.players[index].hasOwnProperty('character'))
            playerObject.character = query.players[index].character;
        if(query.players[index].hasOwnProperty('winner')) {
            playerObject.winner = query.players[index].winner;
        }
        console.log({"$elemMatch": playerObject});
        queryObject.players.$all.push({"$elemMatch": playerObject});
    }

    return queryObject;
}

router.post('/search', (req, res) => {

    console.log('GET /match/search');
    let queries = matchQueryValidator(req.body);
    console.log(queries);
    Match.find(queries).populate('players._playerID')
        .then((p, e) => {
            if(e){
                throw 'Database error';
            } else{
                if(p.length) {
                    console.log(p);
                    return res.status(200).send(p);
                }
                else
                    return res.status(204).send("Matches not found.");
            }
        })
        .catch((e) => {
            return res.status(500).send(e);
        });
});

router.get('/:id', (req, res) => {

    console.log('GET /match/:id');
    console.log(req.params.id);

    if (Number.isInteger(parseInt(req.params.id))) {
        Match.findById(req.params.id).populate('players._playerID')
            .then((p, e) => {
                if(e){
                    throw 'Database error';
                } else{

                    if(p!==null) {
                        return res.status(200).send([p]);
                    }
                    else
                        return res.status(204).send("MatchID not found.");
                }
            })
            .catch((e) => {
                return res.status(500).send(e);
            });
    }else{
        return res.status(400).send('Bad Request');
    }


});

router.post('/', (req, res) => {

    console.log('POST /match');
    console.log(req.body);

    if(!req.body.players || !req.body.stage){
        return res.status(400).send('Bad Request');
    }

    let pids = [];
    let winners = [];
    let losers = [];
    let r = new Rating();
    let ratingW, ratingL;

    for( let player in req.body.players){
        if (req.body.players.hasOwnProperty(player)) {
            let p = req.body.players[player];
            console.log(p);
            pids.push(p._playerID);
            if (p.winner) {
                winners.push(p._playerID);
            } else {
                losers.push(p._playerID)
            }
        }

    }
    let newMatch =  new Match({
        players: req.body.players,
        stage: req.body.stage
    });
    newMatch.validate()
        .then((p, e) => {
            if(e) {
                throw 'Invalid match error'
            }
        })
        .then(() =>{
            Player.find({_id: {$in: pids}})
                .then((p, e) => {
                    return new Promise((resolve) => {
                        console.log(p);
                        if (e) {
                            throw 'Database error';
                        }
                        if (p.length !==req.body.players.length) {
                            console.log(p);
                            throw 'Player does not exist error'
                        }

                        // Rating only supports 1 vs. 1 for now.
                        // There's probably a better way to do this..
                        if (p.length === 2) {
                            // Determine the winner/loser
                            let w, l;
                            if (winners.includes(p[0]._id)) {
                                w = p[0];
                                l = p[1];
                            } else {
                                l = p[0];
                                w = p[1];
                            }
                            // Determine expected score
                            w.expected = r.expected(w.rating, l.rating);
                            l.expected = 1 - w.expected;
                            // Calculate new rating
                            ratingW = Math.round(r.calculateElo(w.rating, w.expected, 1));
                            ratingL = Math.round(r.calculateElo(l.rating, l.expected, 0));

                            console.log(ratingW, ratingL);
                        }

                        resolve();
                    })
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
                            res.status(200).send('Successfully added match.');

                        }
                    }).catch((err) => {
                        console.log(err);
                        res.status(400).send(err.message.replace(', ', '\n'));
                });

                Player.updateMany({_id: {$in: winners} },
                    {$inc: {wins: 1, [`stages.${req.body.stage}.wins`]: 1},
                        $set: {rating: ratingW}})
                    .then((p, e) => {
                        if (e) {
                            throw 'Database error'
                        } else {
                            console.log('Successfully updated wins')
                        }
                    });

                Player.updateMany({_id: {$in: losers} },
                    {$inc: {losses: 1, [`stages.${req.body.stage}.losses`]: 1},
                        $set: {rating: ratingL}})
                    .then((p, e) => {
                        if (e) {
                            throw 'Database error'
                        } else {
                            console.log('Successfully updated losses')
                        }
                    });

            }).catch((err) => {
                res.status(400).send(err);
            });

        }).catch((err) => {
            return res.status(400).send(err);
    });

});

router.put('/:id', (req, res) => {
    if(!req.params.id){
        return res.status(400).send('Bad Request');
    }

    Player.findOneAndUpdate({_id: parseInt(req.params.id)},
        {$set: matchQueryValidator(req.body)})
        .then((p, e) => {
            if(e){
                throw 'Database error';
            } else{
                if(p.length)
                    return res.status(200).send(p);
                else
                    return res.status(204).send("Match not found.");
            }
        })
        .catch((e) => {
            return res.status(500).send(e);
        });

});

router.delete('/:id', (req, res) => {

    console.log('DELETE /match')

    if(!req.params.id){
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

router.delete('/', (req, res) => {
    if(req.query.confirmation){
        Match.remove({})
            .then((p, e) => {
                res.status(200).send('All deleted');
            });
    }
});

module.exports = router;