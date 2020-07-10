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
            if (recipe.id === 0) recipe.id++;
            else recipe.id = 0;
            res.status(200).send(recipe);
        }
    })

});

router.get('/', (req, res) => {
    Recipe.find({}, (err, docs) => {
        if (err) return console.log(err);
        else res.status(200).send(docs);
    });
});

router.get('/:id', (req, res) => {
    const id = +req.params.id;
    Recipe.find({ recipeId: id }, (err, docs) => {
        if (err) return console.log(err);
        else res.status(200).send(docs);
    });
});

router.put('/:id', (req, res) => {
    const id = +req.params.id;
    Recipe.updateOne({ recipeId: id }, { title: req.body.title, description: req.body.description }, (err, result) => {
        if (err) return console.log(err);
        else {
            Recipe.find({ recipeId: id }, (err, docs) => {
                if (err) return console.log(err);
                else res.status(200).send(docs);
            });
        }
    });
});

router.delete('/:id', (req, res) => {
    const id = +req.params.id;
    Recipe.remove({ recipeId: id}, (err, result) => {
        if (err) return console.err;
        else {
            Recipe.find({}, (err, docs) => {
                if (err) return console.log(err);
                else res.status(200).send(docs);
            });
        }
    });
});

module.exports = router;
