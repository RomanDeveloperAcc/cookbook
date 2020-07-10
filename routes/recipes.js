const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const DB = 'mongodb+srv://dbuser:dbuserpass@cluster0-uy5xu.mongodb.net/cookbook?retryWrites=true&w=majority';

const Recipe = require('../models/recipe.model');

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    err ? console.log(err) : console.log('Connected to db');
})

router.post('/', (req, res) => {
    let recipeData = req.body;
    let recipe = new Recipe(recipeData);

    recipe.save((err, recipe) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send(recipe);
        }
    })

});

router.get('/', (req, res) => {
    res.send('Get from api');
});

router.get('/:id', (req, res) => {
    res.send('Get from api');
});

router.put('/', (req, res) => {
    res.send('Get from api');
});

router.delete('/', (req, res) => {
    res.send('Get from api');
});

module.exports = router;
