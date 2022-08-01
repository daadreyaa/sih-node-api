// import express from 'express';
// import bodyParser from 'body-parser';

const express = require('express');
const bodyParser = require('body-parser');

var connection = require('./config');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

const userRoute = require('./routes/user');

app.use('/user', userRoute);


app.get('/', (req, res) => {
    res.json({ "data": "Success" });
});

app.get('/test', (req, res) => {
    connection.get('open', async function () {
        const collection = connection.db.collection("hmm");
        collection.find({}).toArray(function (err, data) {
            res.json(data); // it will print your collection data
        });

    });
});



app.listen(PORT, () => console.log(`Server running on port http://127.0.0.1:${PORT}`));
