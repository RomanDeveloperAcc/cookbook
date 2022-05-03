require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();

const db = require('../assets/constants/db');

const User = require('../models/user.model');

let refreshTokens = [];

mongoose.connect(db, { useNewUrlParser: true }, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log('Success');
    }
});

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized');
    }

    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null') {
        return res.status(401).send('Unauthorized');
    }

    let payload = jwt.verify(token, process.env.ACCESS_TOKEN);

    if(!payload) {
        return res.status(403).send('Bad request');
    }

    req.userId = payload.subject;
    next();
}

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '10000s' });
}

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === 'null') res.status(401).message('Unauthorized');
    if (!refreshTokens.includes(refreshToken)) res.status(403).message('Bad request');
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, data) => {
        if (err) res.status(401).message('Unauthorized');

        console.log(data);
        /*const accessToken = generateAccessToken(data);
        res.json({ accessToken });*/
    });
});

router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

router.get('/', (req, res) => {
    res.send('Get from /api');
});

router.post('/signup', (req, res) => {
    let userData = req.body;
    let newUser = new User(userData);
    User.findOne({email: userData.email}, (err, user) => {
        if (!user) {
            newUser.save((err, registeredUser) => {
                if(err) {
                    res.send(err);
                } else {
                    let payload = {
                        subject: registeredUser.userId
                    };
                    let token = generateAccessToken(payload);
                    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN);
                    refreshTokens.push(refreshToken);
                    res.status(200).send({ token, refreshToken });
                }
            });
        }
        else {
            res.send('Bad request');
        }
    });
});

router.post('/signin', (req, res) => {
    let userData = req.body;

    User.findOne({email: userData.email}, (err, user) => {
        if(err) {
            res.status(404).send('User not found')
        } else {
            if(!user) {
                res.status(401).send('Invalid email');
            } else if(user.password !== userData.password) {
                res.status(401).send('Invalid password');
            } else {
                let payload = {
                    subject: user.id
                }
                let token = generateAccessToken(payload);
                let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN);
                refreshTokens.push(refreshToken);
                res.status(200).send({ token, refreshToken });
            }
        }
    });
});

router.get('/events', verifyToken, (req, res) => {
    let events = [{
        "name": "hello"
    },
        {
            "name": "world"
        }];
    res.json(events);
});

router.get('/spec', (req, res) => {
    let events = [{
        "name": "hello"
    },
        {
            "name": "world"
        }];
    res.json(events);
});

module.exports = router;
module.exports.verifyToken = verifyToken;
