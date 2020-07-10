const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recipeSchema = new Schema({
    recipeId: Number,
    title: String,
    description: String,
    creationDate: Date
});

module.exports = mongoose.model('recipe', recipeSchema, 'recipes');
