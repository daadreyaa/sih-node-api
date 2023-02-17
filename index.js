const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authenticateToken, authenticateTokenForUser } = require('./utils/JWTFunctions');
const jwt = require('jsonwebtoken');


var connection = require('./utils/config');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.json())
app.use(cors());

const developerRoute = require('./routes/developer');
const userRoute = require('./routes/user');

app.use('/developer', developerRoute);
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

app.post('/demo', authenticateTokenForUser, (req, res) => {
    console.log('demo triggered')
    console.log(req.body)
    // console.log(req.user)
    res.json({ message: req.body })
    // res.send('hello');
})

app.post('/jwtDecode', (req, res) => {
    jwt.verify(req.body.token, 'qwertyuiopasdfghjklzxcvbnm', (err, data) => {
        if (err) res.sendStatus(403)
        else res.json({ data: data })
    })
})


app.listen(PORT, () => console.log(`Server running on port http://127.0.0.1:${PORT}`));
