let express = require('express');
let db = require('../../db');
let Models = require('../models/ModelIndex');
let bodyParser = require('body-parser');

let router = express.Router();
router.use(bodyParser.urlencoded( { extended: true } ));
router.use(bodyParser.json());
let Player = db.model('Player', Models.PlayerModel);

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

const handleGet = (p, e, res) => {
    if (e) {
        throw 'Database Error';
    } else {
        console.log(p);
        res.status(200).send(p);
    }
};

router.get('/', (req, res) => {

    // GET PLAYER by TAG/NAME, GET ALL IF NO PARAMS
    // PARAMS: tag and/or name

    console.log('GET /player');

    Player.find(playerQueryBuilder(req.query.tag, req.query.name))
        .then((p, e) => handleGet(p, e, res))
        .catch((e) => handleErr(e, res));


});

router.get('/:id', (req, res) => {

    // GET PLAYER by ID

    console.log('GET /player/:id');

    if (Number.isInteger(req.params.id)) {
        Player.findById(req.params.id)
            .then((p, e) => handleGet(p, e, res))
            .catch((e) => handleErr(e, res));
    }
});

router.put('/', (req, res) => {

    // UPDATE A PLAYER INFO (name, tag, main)
    // PARAMS: tag and name

    console.log('PUT /player');

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

    console.log('POST /player')

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

    console.log('DELETE /player')

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