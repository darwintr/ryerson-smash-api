import express from 'express';
import db from '../../db';
import PlayerSchema from '../models/Player';
import * as c from '../constants/Characters';
import bodyParser from 'body-parser';

let router = express.Router();
router.use(bodyParser.urlencoded( { extended: true } ));
let Player = db.model('Player', PlayerSchema);

// TODO: Move exceptions to a separate file/implementation

const handleErr = (e) => {
    switch (e) {
        case 'Database error':
            res.status(500).send(e);
            break;
        case 'Player exists error':
            res.status(400).send('Bad Request: Player already exists');
            break;
    }
}

router.get('/', (req, res) => {

    // GET PLAYER by TAG/NAME, GET ALL IF NO PARAMS
    // PARAMS: tag and/or name

    const handleGet = (p, e) => {
        if (e) {
            throw 'Database Error';
        } else {
            console.log(p);
            res.status(200);
            return res.send(p);
        }
    };

    // Find all if no tag and name are inputted
    // Otherwise find document with tag and name
    if (!req.query.tag && !req.query.name) {
        Player.find()
            .then((p, e) => handleGet(p, e))
            .catch((e) => handleErr(e));
    } else {
        Player.find({ name: req.query.name, tag: req.query.tag })
            .then((p, e) => handleGet(p, e))
            .catch((e) => handleErr(e));
    }


});

router.put('/', (req, res) => {
    // UPDATE A PLAYER
    // PARAMS: tag and/or name

    // TODO: update route

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
        .catch((e) => handleErr(e));
});

router.delete('/', (req, res) => {
    // DELETE A PLAYER
    // PARAMS: tag and/or name ; id else: res: 400 / res.message = "more than one player with that tag, get id"

    // TODO: delete route
});

module.exports = router;