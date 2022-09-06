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
database.persistence.compactDatafile()
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
    database.insert(data);
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

app.post('/update', (request, response) => {
    const data = request.body;
    database.update(
        {_id: data._id},
        { $set: { 
            data_name: data.data_name,
            data_alias: data.data_alias,
            data_description: data.data_description,
            data_modified: data.data_modified
        } },
        {}, 
        function (err, numReplaced) {
            if (err) {
                response.end();
                return;
            }
        }
    );
    database.persistence.compactDatafile()
});