const app   = require('express')(),
    bodyParser  = require('body-parser'),
    db          = require('./db'),
    Controllers = require('./api/controllers/controllerIndex'),
    PORT        = process.env.PORT || 3000;

app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());
// ROUTES
app.use('/player', Controllers.PlayerController);
app.use('/match', Controllers.MatchController);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}.`);
});