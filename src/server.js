import app from 'express';
import bodyParser from 'body-parser';
import Controllers from './api/controllers/controllerIndex';

PORT        = process.env.PORT || 3000;
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json);

// ROUTES
app.use('/player', Controllers.PlayerController);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}.`);
});
