const jwt = require('jsonwebtoken');
require('dotenv/config');

function generateAccessToken(data) {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

function generateAccessTokenForUser(data) {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_USER, { expiresIn: process.env.JWT_EXPIRES_IN })
}

function authenticateTokenForUser(req, res, next) {
    console.log(req.headers)
    const authHeader = req.headers['authorization']
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_USER, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}



module.exports = { generateAccessToken, authenticateToken, generateAccessTokenForUser, authenticateTokenForUser }