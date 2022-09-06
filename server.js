const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000);
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

/*
database.remove({}, { multi: true },(err, numRemoved) => {
    console.log(numRemoved)
});
*/

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return; 
        }
        response.json(data);
    });
});

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert();
    response.end();
});

app.post('/deletion', (request, response) => {
    database.remove({_id: request.body.data_id}, {},(err, numRemoved) => {
        if (err) {
            response.end();
            return; 
        }
    });
    database.persistence.compactDatafile()
});