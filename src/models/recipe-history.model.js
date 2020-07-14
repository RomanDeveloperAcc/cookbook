const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
const db = require('../assets/constants/db');

const connection = mongoose.createConnection(db);

autoIncrement.initialize(connection);

const recipeHistorySchema = new Schema({
    parentId: {
        type: Number,
        unique: false
    },
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

recipeHistorySchema.plugin(autoIncrement.plugin, {model: 'recipe-history', field: 'recipeId'});
module.exports = mongoose.model('recipe-history', recipeSchema, 'recipes-history');
