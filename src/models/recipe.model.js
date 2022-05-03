const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
const db = require('../assets/constants/db');

const connection = mongoose.createConnection(db);

autoIncrement.initialize(connection);

const recipeSchema = new Schema({
    recipeId: {
        type: Number,
        unique : true
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
        unique : true
    },
});

recipeSchema.plugin(autoIncrement.plugin, {model: 'recipe', field: 'recipeId'});
module.exports = mongoose.model('recipe', recipeSchema, 'recipes');
