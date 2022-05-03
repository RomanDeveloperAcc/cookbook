const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const db = require('../assets/constants/db');

const Recipe = require('../models/recipe.model');

const RecipeHistory = require('../models/recipe-history.model');

const api = require('./auth');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    err ? console.log(err) : console.log('Connected to db');
})

router.post('/', api.verifyToken, (req, res) => {
    let recipeData = req.body;
    console.log(recipeData);
    let recipe = new Recipe(recipeData);
    recipe.creationDate = Date.now();

    recipe.save((err, recipe) => {
        if (err) console.log(err);
        else res.status(200).send(recipe);
    })
});

router.get('/', api.verifyToken, (req, res) => {
    Recipe.find({}, (err, docs) => {
        if (err) return console.log(err);
        else if (!docs[0]) res.status(404).send('Recipes are not found');
        else {
            const recipes = docs.reverse();
            res.status(200).send(recipes);
        }
    });
});

router.get('/new', api.verifyToken, (req, res) => {
    Recipe.find({}, (err, docs) => {
        if (err) return console.log(err);
        else if (!docs[0]) res.status(404).send('Recipes are not found');
        else {
            const recipes = docs.reverse().slice(0, 3);
            res.status(200).send(recipes);
        }
    });
});

router.get('/:id', api.verifyToken, (req, res) => {
    const id = +req.params.id;
    Recipe.findOne({ recipeId: id }, (err, docs) => {
        if (err) return console.log(err);
        else if(!docs) res.status(404).send('Recipe is not found');
        else res.status(200).send(docs);
    });


});

router.put('/:id', api.verifyToken, (req, res) => {
    const id = +req.params.id;
    Recipe.findOneAndUpdate({ recipeId: id },
                            { title: req.body.title, description: req.body.description },
                            { new: true },
                            (err, result) => {
        if (err) return console.log(err);
        else if (!result) res.status(404).send('Recipe is not found');
        else res.status(200).send(result);
    });
});

router.delete('/:id', api.verifyToken, (req, res) => {
    const id = +req.params.id;
    Recipe.findOneAndDelete({ recipeId: id},
                            (err, result) => {
        if (err) return console.log(err);
        else if(!result) res.status(404).send('Recipe is not found');
        else res.status(200).send(result);
    });

    RecipeHistory.deleteMany({ recipeId: id },
        (err) => {
            if (err) return console.log(err);
    });
});

module.exports = router;
