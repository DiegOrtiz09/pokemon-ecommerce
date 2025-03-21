const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path : '../.env'});

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

//Make the conection with the DataBase
const {Pool} = require('pg');
const { config } = require('dotenv');

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

//Endpoint for SIGNUP
app.post('/api/signup', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'You need to fill up all the fields' });
    }

    try {
        // Encrypt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Add a new user
        const { rows } = await pool.query(
            'INSERT INTO users (username, pass, email) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, email]
        );

        res.status(201).json({ user: rows[0] });
    } catch (error) {
        console.error('Error adding a new user:', error);
        res.status(500).json({ message: 'Error registering the user', error: error.message });
    }
});

//Endpoint for LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Search user in DB
        const { rows } = await pool.query('SELECT username, pass FROM users WHERE username = $1', [username]);

        if (rows.length === 0) {
            // If the user was not found
            return res.status(404).json({ message: 'User not Found' });
        }

        const user = rows[0];

        // verify the password
        const validPassword = await bcrypt.compare(password, user.pass);
        if (!validPassword) {
            // If the password was incorrect
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        // When both are correct. Generate a jwt token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error durante el login:', error);
        res.status(500).json({ message: 'Error durante el login', error });
    }
});

//Try if there's connection with the DB
/*app.get('/api/test-db', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT NOW()');
      res.json({ message: 'Conexión exitosa', time: rows[0].now });
    } catch (error) {
      res.status(500).json({ message: 'Error en la conexión a la base de datos', error });
    }
  });*/

app.listen(PORT, () => {
    console.log('Server Running on port 5000');
});