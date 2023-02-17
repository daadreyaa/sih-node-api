const express = require('express');
const router = express.Router();
const { authenticateToken, generateAccessTokenForUser, authenticateTokenForUser } = require('../utils/JWTFunctions');
const Domain = require('../models/DomainModel');
const User = require('../models/UserModel')
const axios = require('axios');
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");


// const request = require('request');
// const http = require('http');


router.get('/', (req, res) => {
    res.json({ message: "User Route" })
})

router.post('/puzzleList', (req, res) => {

    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]

    Domain.findOne({ devId: req.body.devId, domainName: req.body.domainName }).then(result => res.json({
        message: {
            puzzles: result['puzzles'],
            // token: token
        }
    })).catch(err => res.sendStatus(404))
})

router.post('/puzzleSelected', authenticateToken, (req, res) => {
    Domain.findOne({ devId: req.body.devId, domainName: req.body.domainName }).then(result => {
        const data = {
            name: 'John Doe',
            job: 'Content Writer'
        };

        axios.post('http://127.0.0.1:5000/demo', data)
            .then((response) => {
                console.log(`Status: ${response.status}`);
                console.log('Body: ', response.data);
                res.json({ message: response.data })
            }).catch((err) => {
                console.error(err);
            });
    })
})

router.post('/login', authenticateToken, (req, res) => {
    Domain.findOne({ devId: req.body.devId, domainName: req.body.domainName }).then(result => {
        if (req.body.puzzleId in result['puzzleId']) {
            const userToken = generateAccessTokenForUser({
                puzzleId: req.body.puzzleId
            })
            res.json({ message: { userToken: userToken } });
            return
        }
        else res.sendStatus(403)
    }
    ).catch(err => res.sendStatus(403))

})

router.post('/storePassword', (req, res) => {
    const user = User({
        email: req.body.email,
        domainName: req.body.domainName,
        password: req.body.password
    })

    user.save()
        .then(data => {
            res.json({ message: "Password saved successfully" });
        })
        .catch(err => {
            res.json({ message: err });
        });
})

router.post('/puzzleSolution', (req, res) => {
    User.findOne({ email: req.body.email, domainName: req.body.domainName })
        .then(async (value) => {
            console.log(req.body.password)
            console.log(value.password)
            bcrypt.compare(req.body.password, value.password).then((value) => {
                if (value) res.json({ message: 1 })
                else res.json({ message: 0 })
            })
            // console.log(validPassword)
            // console.log(value); if (value.password == req.body.password) res.json({ message: "Success" })
            // else res.json({ message: "Failure" })
        })
        .catch((err) => console.log(err))
})

router.post('/updatePassword', (req, res) => {
    console.log(req.body)
    User.updateOne({ email: req.body.email }, { $set: { password: req.body.password } })
        .then((value) => { console.log(value); res.json({ message: "Updated" }) })
        .catch((err) => console.log(err))
})



router.post('/otpThroughMail', async (req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "projectsample221@gmail.com", // generated ethereal user
            pass: "neaadiuczptampqn", // generated ethereal password
        },
    });

    console.log(req.body)

    // console.log(transporter)

    let info = await transporter.sendMail({
        from: 'API SERVER', // sender address
        to: req.body.toEmail, // list of receivers
        subject: "Password Reset", // Subject line
        text: "This is your password reset OTP", // plain text body
        html: "<b>" + req.body.otp + "</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.json({ message: "OTP Sent" })
}
)


module.exports = router;