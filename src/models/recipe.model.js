const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recipeSchema = new Schema({
    recipeId: {
        type: Number,
        unique : true,
        required : true
    },
    title: {
        type: String,
        unique : false,
        required : true
    },
    description: {
        type: String,
        unique : false,
        required : true
    },
    creationDate: {
        type: Date,
        unique : false
    },
});

module.exports = mongoose.model('recipe', recipeSchema, 'recipes');
