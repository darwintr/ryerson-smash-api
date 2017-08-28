const router    = require('express').Router(),
bodyParser      = require('body-parser');

router.use(bodyParser.urlencoded( { extended: true } ));

router.get('/', (req, res) => {
    // GET ALL USERS
});

router.put('/', (req, res) => {
    // UPDATE A PLAYER
    // PARAMS: tag and/or name
});

router.post('/', (req, res) => {
    // ADD A PLAYER
    // PARAMS: tag and/or name
});

router.delete('/', (req, res) => {
    // DELETE A PLAYER
    // PARAMS: tag and/or name ; id else: res: 400 / res.message = "more than one player with that tag, get id"
});

module.exports = router;