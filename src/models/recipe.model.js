const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recipeSchema = new Schema({
    title: String,
    description: String,
    creationDate: Date
});

module.exports = mongoose.model('recipe', recipeSchema, 'recipes');
