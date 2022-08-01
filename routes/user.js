const express = require('express');
const router = express.Router();
const User = require('../models/UserModal');


router.get('/', (req, res) => {
    res.send('User API');
});

router.post('/signup', (req, res) => {
    let user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    user.setPassword(req.body.password);

    user.save()
        .then(data => {
            res.json({ message: "User added Successfully" });
        })
        .catch(err => {
            res.json({ message: "Failed to add User" });
        });
});


router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user.validPassword(req.body.password)) {
            res.json({ message: "User Logged In" });
        } else {
            res.json({ message: "Wrong Password" })
        }
    }).catch(err => {
        res.json({ message: "User Not Found" });
    });

});

module.exports = router;