const mysql = require('mysql');
const config = {
    host:       'localhost',
    user:       'user',
    password:   'pass',
    database:   'test'
};

const db = mysql.createConnection(config, (err) => {
    if (err) {
        console.error('Error creating connection: ' + err.stack);
        return;
    }
    console.log('Successfully created connection to database');
});

// Uncomment when REAL database is setup
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting: ' + err.stack);
//         return;
//     }
//     console.log('Successfully connected to database');
// });

module.exports = db;