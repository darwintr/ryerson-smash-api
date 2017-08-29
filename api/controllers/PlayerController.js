const router        = require('express').Router(),
    db              = require('../../db'),
    PlayerSchema    = require('../models/Player'),
    c               = require('../constants/Characters');
    bodyParser      = require('body-parser');


router.use(bodyParser.urlencoded( { extended: true } ));
let Player = db.model('Player', PlayerSchema);

router.get('/', (req, res) => {

    // GET ALL PLAYERS
    // PARAMS: none

    // TODO: send status codes

    Player.find()
        .then((err, p) => {
        if (err) {
            console.log(err);
        } else {
            console.log(p);
            res.status(200);
            res.send(p);
        }
    });

});

router.put('/', (req, res) => {
    // UPDATE A PLAYER
    // PARAMS: tag and/or name

    console.log(req.query);
    let qName = req.query.name,
        qTag = req.query.tag,
        qMain = req.query.main;


});

router.post('/', (req, res) => {
    // ADD A PLAYER
    // PARAMS: tag and/or name

    console.log(req.query);
    let qName = req.query.name,
        qTag = req.query.tag,
        qMain = req.query.main.toLowerCase();

    // Send 400 if parameters are empty or main is not a valid Character
    if (!qName || !qTag || !c.CHARACTERS[qMain]) {
        return res.status(400).send('Bad Request');
    }

    // Check if player already exists, if it doesn't then add the player
    Player.find({ name: qName, tag: qTag })
        .then((p, e) => {
            return new Promise((resolve) => {
                    if (e) {
                        throw 'Database error';
                    }
                    if (p.length) {
                        console.log(p);
                        throw 'Player exists error'
                    }
                    resolve();
                }
            )
        })
        .then(() => {
            let newPlayer = new Player({
                name: qName,
                tag: qTag,
                main: qMain});

            newPlayer.save()
                .then((p, e) => {
                    if (e) {
                        throw 'Database error';
                    } else {
                        res.status(200).send('Successfully added Player');
                        console.log(p);
                    }
                });
        })
        .catch((e) => {
            console.log(e);
            switch(e) {
                case 'Database error':
                    res.status(500).send(e);
                    break;
                case 'Player exists error':
                    res.status(400).send('Bad Request: Player already exists');
                    break;
            }
        });
});

router.delete('/', (req, res) => {
    // DELETE A PLAYER
    // PARAMS: tag and/or name ; id else: res: 400 / res.message = "more than one player with that tag, get id"
});

module.exports = router;