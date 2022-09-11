const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000);
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

/*FOR SEARCH HISTORY TAB*//*
const search_history = new Datastore('search_history.db');
search_history.loadDatabase();
*/

/*
database.remove({}, { multi: true },(err, numRemoved) => {
    console.log(numRemoved)
});
database.persistence.compactDatafile()
*/

let data_array = ''
app.post('/sort', (request, response) => {
    data_array = request.body
    /*FOR SEARCH HISTORY TAB*//*
    const data = request.body;
    search_history.insert(data);
    */
    response.end();
});

app.get('/api', (request, response) => {
    
    /*FOR SEARCH HISTORY TAB*//*
    search_history.find({}, (err, data) => {
        if (err) {
            response.end();
            return; 
        }
        console.log(data)
        value = data
    });
    */
    if (data_array.keyword_value) {
        if (data_array.filter_value === 'date_u') {
            database.find({$or: [
                { data_name_lc: new RegExp(data_array.keyword_value.toLowerCase()) },
                { data_alias_lc: new RegExp(data_array.keyword_value.toLowerCase()) },
                { data_description_lc: new RegExp(data_array.keyword_value.toLowerCase()) }
                ]}
            ).sort({ _id: data_array.direction_value }).exec(function(err, data){
                if (err) {
                    response.end();
                    return; 
                }
                response.json(data);
            })
        } else if (data_array.filter_value === 'date_m') {
            database.find({$or: [
                { data_name_lc: new RegExp(data_array.keyword_value.toLowerCase()) },
                { data_alias_lc: new RegExp(data_array.keyword_value.toLowerCase()) },
                { data_description_lc: new RegExp(data_array.keyword_value.toLowerCase()) }
                ]}
            ).sort({ data_modified: data_array.direction_value }).exec(function(err, data){
                if (err) {
                    response.end();
                    return; 
                }
                response.json(data);
            }) 
        } else if (data_array.filter_value === 'name') {
            database.find({$or: [
                { data_name_lc: new RegExp(data_array.keyword_value.toLowerCase()) },
                { data_alias_lc: new RegExp(data_array.keyword_value.toLowerCase()) },
                { data_description_lc: new RegExp(data_array.keyword_value.toLowerCase()) }
                ]}
            ).sort({ data_name: data_array.direction_value }).exec(function(err, data){
                if (err) {
                    response.end();
                    return; 
                }
                response.json(data);
            }) 
        }
    } else {
        if (data_array.filter_value === 'date_u') {
            database.find({}).sort({ _id: data_array.direction_value }).exec(function(err, data){
                if (err) {
                    response.end();
                    return; 
                }
                response.json(data);
            })
        } else if (data_array.filter_value === 'date_m') {
            database.find({}).sort({ data_modified: data_array.direction_value }).exec(function(err, data){
                if (err) {
                    response.end();
                    return; 
                }
                response.json(data);
            })
        } else if (data_array.filter_value === 'name') {
            database.find({}).sort({ data_name: data_array.direction_value }).exec(function(err, data){
                if (err) {
                    response.end();
                    return; 
                }
                response.json(data);
            })
        }
    }
    data_array = ''
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
            data_name_lc: data.data_name.toLowerCase(),
            data_alias: data.data_alias,
            data_alias_lc: data.data_alias.toLowerCase(),
            data_description: data.data_description,
            data_description_lc: data.data_description.toLowerCase(),
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