const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const db = require('../assets/constants/db');

const RecipeHistory = require('../models/recipe-history.model');

const api = require('./auth');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    err ? console.log(err) : console.log('Connected to db');
})

router.post('/', api.verifyToken, (req, res) => {
    let recipeHistoryData = req.body;
    let recipeHistory = new RecipeHistory(recipeHistoryData);
    recipeHistory.creationDate = Date.now();

    recipeHistory.save((err, recipe) => {
        if (err) console.log(err);
        else res.status(200).send(recipe);
    })

});

router.get('/:id', api.verifyToken, (req, res) => {
    const id = +req.params.id;

    RecipeHistory.find({parentId: id}, (err, docs) => {
        if (err) return console.log(err);
        else if (!docs[0]) res.status(404).send('Recipes are not found');
        else {
            const recipes = docs.reverse();
            res.status(200).send(recipes);
        }
    });
});

router.get('/item/:id', api.verifyToken, (req, res) => {
    const id = +req.params.id;

    RecipeHistory.findOne({ recipeId: id }, (err, docs) => {
        if (err) return console.log(err);
        else if (!docs) res.status(404).send('Recipe is not found');
        else res.status(200).send(docs);
    });
});

module.exports = router;
