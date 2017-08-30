import express from 'express';
import db from '../../db';
import Models from '../models/modelIndex';
import bodyParser from 'body-parser';

let router = express.Router();
router.use(bodyParser.urlencoded( { extended: true } ));
router.use(bodyParser.json());
let Player = db.model('Player', Models.PlayerModel);

// TODO: Move exceptions to a separate file/implementation

const handleErr = (e, res) => {
    switch (e) {
        case 'Player exists error':
            res.status(400).send('Bad Request: Player already exists');
            break;
        default:
            res.status(500).send(e.message ? e.message : e);
    }
};

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
            .catch((e) => handleErr(e, res));
    } else {
        Player.find({ name: req.query.name, tag: req.query.tag })
            .then((p, e) => handleGet(p, e))
            .catch((e) => handleErr(e, res));
    }


});

router.put('/', (req, res) => {
    // UPDATE A PLAYER
    // PARAMS: tag and/or name

    // TODO: update route

    console.log(req.body);
    let qName = req.body.name,
        qTag = req.body.tag,
        qMain = req.body.main;


});

router.post('/', (req, res) => {
    // ADD A PLAYER
    // PARAMS: tag and/or name

    console.log(req.body);
    let qName = req.body.name,
        qTag = req.body.tag,
        qMain = req.body.main.toLowerCase();

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
                })
                .catch((e) => handleErr(e, res));;
        })
        .catch((e) => handleErr(e, res));
});

router.delete('/', (req, res) => {
    // DELETE A PLAYER
    // PARAMS: tag and/or name ; id else: res: 400 / res.message = "more than one player with that tag, get id"

    // TODO: delete route
});

module.exports = router;