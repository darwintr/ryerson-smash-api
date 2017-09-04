const app   = require('express')(),
    bodyParser  = require('body-parser'),
    db          = require('./db'),
    Controllers = require('./api/controllers/controllerIndex'),
    PORT        = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

// ROUTES
app.use('/player', Controllers.PlayerController);
app.use('/match', Controllers.MatchController);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}.`);
});