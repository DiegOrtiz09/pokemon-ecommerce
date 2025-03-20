const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//Get route to obtain the pokemon list (first 20 pokemon)
app.get('/api/pokemon', async (req, res) => {
    try{
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
        res.json(response.data.results);
    } catch (error){
        res.status(500).json({ message: 'Error Fetching Pokemon Data' });
    } 
});

const {Pool} = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl:{
        rejectUnauthorized: false, 
    },
});

pool.on('connect', () =>{
    console.log('Connected to postgreSQL DataBase in Render');
});
pool.on('error', (err) =>{
    console.log('Error connecting the Database: ', err);
});

app.listen(PORT, () => {
    console.log('Server Running on port 5000');
});