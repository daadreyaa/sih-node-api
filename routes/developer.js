const express = require('express');
const router = express.Router();
const Developer = require('../models/DeveloperModel');
const Domain = require('../models/DomainModel');
const { generateAccessToken, authenticateToken } = require('../utils/JWTFunctions');
const { randomBytes } = require('crypto');
const { default: axios } = require('axios');
require('dotenv/config');
const RedirectUrl = require('../models/RedirectUrlModel')


router.get('/', (req, res) => {
    res.send('User API');
});

router.post('/signup', (req, res) => {

    accessToken = randomBytes(64).toString('hex');

    let developer = new Developer({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        accessToken: accessToken
    });

    developer.setPassword(req.body.password);

    developer.save()
        .then(data => {
            // let tokenData = generateAccessToken({
            //     devId: data._id,
            // });
            axios.post('http://127.0.0.1:5000/developer/domainRegister', {
                devId: data._id,
                domainName: req.body.domainName,
                puzzles: [1],
            }).then((value) => {
                console.log(value)
                res.json({ message: "User added Successfully", accessToken: accessToken, secretKey: value.secretKey })
            }).catch((err) => console.log(err))
        })
        .catch(err => {
            res.json({ message: "Failed to add User", err: err });
        });
});


router.post('/login', (req, res) => {
    Developer.findOne({ email: req.body.email }).then(developer => {
        if (developer.validPassword(req.body.password)) {
            let tokenData = generateAccessToken({
                devId: req.body.devId,
            });
            res.json({ message: "User Logged In", "devId": developer['_id'], "token": tokenData });
        } else {
            res.json({ message: "Wrong Password" })
        }
    }).catch(err => {
        res.json({ message: "User Not Found" });
    });

});


router.post('/domainRegister', (req, res) => {

    let secretKey = randomBytes(64).toString('hex');

    let domain = new Domain({
        devId: req.body.devId,
        domainName: req.body.domainName,
        secretKey: secretKey,
        puzzles: req.body.puzzles,
    });

    domain.save()
        .then(data => {
            res.json({ message: "Data added Successfully", devId: req.body.devId, secretKey: secretKey });
        })
        .catch(err => {
            res.json({ message: "Failed to add Data", err: err });
        });
});


router.post('/getDevToken', (req, res) => {
    Developer.findById(req.body.devId)
        .then((value) => res.json({ token: value.accessToken }))
        .catch((err) => console.log(err))
})


router.post('/redirectUrls', (req, res) => {
    const redirectUrl = RedirectUrl({
        devId: req.body.devId,
        signUpRedirectUrl: req.body.signUpRedirectUrl,
        loginSuccessUrl: req.body.loginSuccessUrl,
        loginFailureUrl: req.body.loginFailureUrl
    })

    redirectUrl.save()
        .then((value) => console.log(value))
        .catch((err) => console.log(err))
})


module.exports = router;