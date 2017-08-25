const app   = require('express')(),
bodyParser  = require('body-parser'),
db          = require('./db'),
PORT        = process.env.PORT || 3000;

app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());

// ROUTES
const PlayerController = require('./api/controllers/PlayerController');
app.use('/player', PlayerController);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}.`);
});
