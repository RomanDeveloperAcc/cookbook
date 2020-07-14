const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const recipes = require('./src/routes/recipes');
const PORT = process.env.port || 3000;


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/recipes', recipes);
app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(PORT, () => {
    console.log('Success');
});
