const express = require('express');
const multer = require('multer');
const Datastore = require('nedb');
const path = require('path')

const app = express();
app.listen(3000);
app.use(express.static('public'));
app.use("/files", express.static(path.join(__dirname + "/files")))
app.use(express.json({limit: '1mb'}));

const text_database = new Datastore('text_database.db');
text_database.loadDatabase();

const files_database = new Datastore('files_database.db');
files_database.loadDatabase();

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./files")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: fileStorageEngine })
/*
text_database.remove({}, { multi: true },(err, numRemoved) => {
    console.log(numRemoved)
});
text_database.persistence.compactDatafile()
*/

/*
files_database.remove({}, { multi: true },(err, numRemoved) => {
    console.log(numRemoved)
});
files_database.persistence.compactDatafile()
*/

let data_array = ''
app.post('/sort', (request, response) => {
    data_array = request.body
    response.end();
});

app.get('/api', (request, response) => {
    if (data_array.keyword_value) {
        if (data_array.filter_value === 'date_u') {
            text_database.find({$or: [
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
            text_database.find({$or: [
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
            text_database.find({$or: [
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
            text_database.find({}).sort({ _id: data_array.direction_value }).exec(function(err, data){
                if (err) {
                    response.end();
                    return; 
                }
                response.json(data);
            })
        } else if (data_array.filter_value === 'date_m') {
            text_database.find({}).sort({ data_modified: data_array.direction_value }).exec(function(err, data){
                if (err) {
                    response.end();
                    return; 
                }
                response.json(data);
            })
        } else if (data_array.filter_value === 'name') {
            text_database.find({}).sort({ data_name: data_array.direction_value }).exec(function(err, data){
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

let data_id = ''
app.post('/api', (request, response) => {
    const data = request.body;
    data_id = data._id
    text_database.insert(data);
    response.end();
});

app.post("/multiple", upload.array("files"),(req, res) => {
    const data = req.files
    data.forEach(function (arrayItem) {
        arrayItem.id = data_id;
        files_database.insert(arrayItem)
    });
    data_id =''
    res.end()
})

let data_id1 = ''
app.post("/fetchsend", (req, res) => {
    data_id1 = req.body.data_id
    res.end()
})

app.get("/fetchrecieve", (req, res) => {
    files_database.find({ id: data_id1 }, function(err, data){
        if (err) {
            response.end();
            return; 
        }
        res.json(data);
    })
    data_id1 = ''
})

app.post('/deletion', (request, response) => {
    text_database.remove({_id: request.body.data_id}, {},(err, numRemoved) => {
        if (err) {
            response.end();
            return; 
        }
    });
    text_database.persistence.compactDatafile()
    response.end();
});

app.post('/update', (request, response) => {
    const data = request.body;
    text_database.update(
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
    text_database.persistence.compactDatafile()
    response.end();
});