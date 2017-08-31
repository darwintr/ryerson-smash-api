import express from 'express';
import db from '../../db';
import Models from '../models/modelIndex';
import bodyParser from 'body-parser';

let router = express.Router();
router.use(bodyParser.urlencoded( { extended: true } ));
router.use(bodyParser.json());
let Player = db.model('Player', Models.PlayerModel);

// TODO: Move exceptions to a separate file/implementation, fix the ugly exception implementation
// TODO: Document this somewhere (probably in a md file)

const handleErr = (e, res) => {
    switch (e) {
        case 'Player exists error':
            res.status(400).send('Bad Request: Player already exists');
            break;
        case 'Player not found error':
            res.status(204).send('Bad Request: Player not found');
            break;
        default:
            res.status(500).send(e.message ? e.message : e);
    }
};

// Builds the query dynamically
const playerQueryBuilder = (tag, name) => {
    let query = {};
    if (tag) {
        query.tag = tag
    }
    if (name) {
        query.name = name
    }
    return query
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

    Player.find(playerQueryBuilder(req.query.tag, req.query.name))
        .then((p, e) => handleGet(p, e))
        .catch((e) => handleErr(e, res));


});

router.put('/', (req, res) => {
    // UPDATE A PLAYER
    // PARAMS: tag and name

    // handler for request; called after query
    const handleUpdate  = (p, e) => {
        if (e) {
            throw e;
        } else if (!p) {
            throw 'Player not found';
        } else {
            res.status(200).send(`Successfully updated Player ${p.name}:${p.tag} to `);
        }
    };

    // Build the update object dynamically
    const buildUpdate = (query) => {
        let updateObject = {},
            fields = ['ntag', 'nname', 'nmain'];

        for (let key in query) {
            if (query.hasOwnProperty(key) && fields.includes(key) ) {
                updateObject[key.substring(1)] = query[key];
            }
        }
        return updateObject;
    };

    if (req.query.tag && req.query.name) {
        Player.findOneAndUpdate(playerQueryBuilder(req.query.tag, req.query.name),
            {$set: buildUpdate(req.query)})
            .then((p, e) => handleUpdate(p, e))
            .catch((e) => handleErr(e, res));
    }

});

router.post('/', (req, res) => {
    // ADD A PLAYER
    // PARAMS: tag and/or name

    console.log(req.body);
    let qName = req.body.name,
        qTag = req.body.tag,
        qMain = req.body.main;

    let newPlayer = new Player({
        name: qName,
        tag: qTag,
        main: qMain});

    newPlayer.save()
        .then((p, e) => {
            if (e) {
                throw 'Database error';
            } else {
                res.status(200).send(`Successfully added Player ${qName}:${qTag}`);
                console.log(p);
            }
        })
        .catch((e) => handleErr(e, res));
});

router.delete('/', (req, res) => {
    // DELETE A PLAYER
    // PARAMS: tag and name ; id else: res: 400 / res.message = "more than one player with that tag, get id"

    // handler for request; called after query
    const handleDelete = (p, e) => {
        if (e) {
            throw e;
        } else if (!p) {
            throw 'Player not found';
        } else {
            res.status(200).send(`Successfully deleted Player ${p.name}:${p.tag}`);
        }
    };

    if (req.query.tag && req.query.name) {
        Player.findOneAndRemove(playerQueryBuilder(req.query.tag, req.query.name))
            .then((p, e) => handleDelete(p, e))
            .catch((e) => handleErr(e, res));
    }


});

module.exports = router;