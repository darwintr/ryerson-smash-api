const router    = require('express').Router(),
bodyParser      = require('body-parser');

router.use(bodyParser.urlencoded( { extended: true } ));

router.post('/', (req, res) => {
    // ADD A USER
});

router.get('/', (req, res) => {
    // GET ALL USERS
});

module.exports = router;