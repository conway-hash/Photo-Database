const express = require('express');
const multer = require('multer');
const Datastore = require('nedb');
const path = require('path')
const fs = require('fs')

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
        cb(null, Date.now() + '--' + Buffer.from(file.originalname, 'latin1').toString('utf8'));
    },
});

const upload = multer({ storage: fileStorageEngine })

/*
//reset databases
text_database.remove({}, { multi: true },(err, numRemoved) => {
    console.log(numRemoved)
});
text_database.persistence.compactDatafile()

files_database.remove({}, { multi: true },(err, numRemoved) => {
    console.log(numRemoved)
});
files_database.persistence.compactDatafile()
*/

let data_array = ''
app.post('/sort', (request, response) => {
    data_array = request.body
    text_database.find({}, function(err, data){
        if (err) {
            response.end();
            return; 
        }
        response.send({ 
            length: data.length
        });
    })
});

app.get('/fetchtext', (request, response) => {
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
app.post('/uploadtext', (request, response) => {
    const data = request.body;
    data_id = data._id
    text_database.insert(data);
    response.end();
});

app.post('/updatetext', (request, response) => {
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
            data_modified: data.data_modified,
            data_main_image: data.data_main_image
        } },
        {}, 
        function (err, numReplaced) {
            if (err) {
                response.end();
                return;
            }
        }
    );
    data_id = data._id
    text_database.persistence.compactDatafile()
    response.end();
});

app.post("/uploadfiles", upload.array("files"),(req, res) => {
    const data = req.files
    data.forEach((arrayItem,index) => {
        const namefix = Buffer.from(arrayItem.originalname, 'latin1').toString('utf8')
        arrayItem.originalname = namefix
        arrayItem.id = data_id;
        arrayItem._id = data_id + '--' + Date.now() + '--' + index
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

app.post('/deletefolder', (request, response) => {
    const value = request.body.data_id
    text_database.remove({_id: value}, {},(err, numRemoved) => {
        if (err) {
            response.end();
            return; 
        }
    });
    text_database.persistence.compactDatafile()
    files_database.find({ id: value }, function(err, data){
        if (err) {
            response.end();
            return; 
        }
        for (item of data) {
            fs.unlink(item.path, (err) => {
                if (err) {
                    throw err;
                }
            });
        }
    })
    files_database.remove({ id: value },  { multi: true },(err, numRemoved) => {
        if (err) {
            response.end();
            return; 
        }
    });
    files_database.persistence.compactDatafile()
    response.end();
});

app.post('/deletefiles', (request, response) => {
    const array = request.body.array
    for (array_item of array) {
        files_database.find({ _id: array_item }, function(err, data){
            if (err) {
                response.end();
                return; 
            }
            for (data_item of data) {
                fs.unlink(data_item.path, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        })
        files_database.remove({ _id: array_item },  { multi: true },(err, numRemoved) => {
            if (err) {
                response.end();
                return; 
            }
        });
        files_database.persistence.compactDatafile()
    }
    response.end();
});

let data_boolean = ''
app.post("/namecheck", (req, res) => {
    if (req.body._id !== undefined) {
        text_database.findOne({$and: [
                { data_name: req.body.data_name },
                { _id: req.body._id }
            ]}, function(err, data){
            if (err) {
                response.end();
                return; 
            }
            if (data !== null) {
                data_boolean = false
            } else {
                text_database.findOne({ data_name: req.body.data_name }, function(err, data2){
                    if (err) {
                        response.end();
                        return; 
                    }
                    if (data2 !== null) {
                        data_boolean = true
                    } else {
                        data_boolean = false
                    }
                })
            }
        })
    } else {
        text_database.findOne({ data_name: req.body.data_name }, function(err, data){
            if (err) {
                response.end();
                return; 
            }
            if (data !== null) {
                data_boolean = true
            } else {
                data_boolean = false
            }
        })
    }
    res.end()
})

app.get("/namecheck", (req, res) => {
    if (data_boolean) {
        res.json({ name_check_data : true });
    } else {
        res.json({ name_check_data : false });
    }
    data_boolean = ''
})

