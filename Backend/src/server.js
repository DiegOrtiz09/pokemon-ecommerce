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

//Get route to obtain the pokemon list (first 20 pokemon)
app.get('/api/pokemon', async (req, res) => {
    try {
        const offset = req.query.offset || 0; //obtain the offset from query (0 por defecto)
        const limit = 20;

        // Get the first 20 pokemon
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonList = response.data.results;

        // Get pokemon details and add it to the database
        const pokemonDetails = await Promise.all(
            pokemonList.map(async (pokemon) => {
                const details = await axios.get(pokemon.url);
                const pokeapiId = details.data.id;
                const name = details.data.name;
                const types = details.data.types.map(t => t.type.name);
                const abilities = details.data.abilities.map(a => a.ability.name);

                // Generate the price deppending on its type and abilities
                const price = generatePrice(types, abilities);

                // Save pokemon in DB
                await pool.query(
                    `INSERT INTO pokemon (name, pokeapi_id, price, stock)
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT (pokeapi_id) DO NOTHING`,
                    [name, pokeapiId, price, 0] // Stock inicial: 0
                );

                return {
                    name: name,
                    pokeapi_id: pokeapiId,
                    image: details.data.sprites.front_default,
                    types: types,
                    abilities: abilities,
                    price: price,
                };
            })
        );

        res.json(pokemonDetails);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        res.status(500).json({ message: 'Error Fetching Pokemon Data' });
    }
});

//Get pokemon details
app.get('/api/pokemon/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('SELECT * FROM pokemon WHERE pokeapi_id = $1', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Pokémon not found' });
        }
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        res.status(500).json({ message: 'Error fetching Pokémon details' });
    }
});

//Generate the price of the pokemon
const generatePrice = (types, abilities) => {
    // Prices deppending on its type
    const typePrices = {
        'fire': 120,
        'water': 110,
        'grass': 100,
        'electric': 130,
        'dragon': 200,
        'psychic': 150,
        'fighting': 140,
        'flying': 110,
        'poison': 100,
        'ground': 120,
        'rock': 130,
        'ice': 110,
        'bug': 90,
        'ghost': 150,
        'steel': 160,
        'fairy': 140,
        'dark': 130,
        'normal': 100,
    };

    // adjust by special abilities
    const abilityAdjustments = {
        'levitate': 20,
        'intimidate': 15,
        'speed-boost': 25,
        'wonder-guard': 50,
        'magic-guard': 30,
    
    };

    // Calculate the price deppending on its type
    const basePrice = types.reduce((maxPrice, type) => {
        return Math.max(maxPrice, typePrices[type] || 100);
    }, 100);

    // Calculate adding abilities
    const abilityAdjustment = abilities.reduce((total, ability) => {
        return total + (abilityAdjustments[ability] || 0);
    }, 0);

    // Final Price
    const finalPrice = basePrice + abilityAdjustment;

    return finalPrice;
};

//Logic of the shopping cart
app.post('/api/cart', async (req, res) => {
    try {
        const { user_id, pokemon_id, quantity } = req.body;

        // Get pokemon price from DB
        const pokemonResult = await pool.query('SELECT price FROM pokemon WHERE id = $1', [pokemon_id]);
        const price = pokemonResult.rows[0].price;

        // put it in shopping cart
        const result = await pool.query(
            'INSERT INTO cart (user_id, pokemon_id, quantity, price) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, pokemon_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity RETURNING *;',
            [user_id, pokemon_id, quantity, price]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
});

//Get the cart data
app.get('/api/cart', async (req, res) => {
    const { user_id } = req.query;
    try {
        
        const result = await pool.query(
            `SELECT cart.id, cart.user_id, cart.quantity, cart.price, 
            pokemon.pokeapi_id FROM cart JOIN pokemon ON 
            cart.pokemon_id = pokemon.id WHERE cart.user_id = $1`,
            [user_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Error fetching cart items' });
    }
});


//Calculate the paid of the cart
app.get('/api/cart/total', async (req, res) => {
    try {
        const { user_id } = req.query;

        result = await pool.query(
            'SELECT SUM(price * quantity) AS total FROM cart WHERE user_id = $1',
        [user_id]
        );

        res.json({ total: result.rows[0].total || 0 });
    } catch (error) {
        console.error('Error calculating total:', error);
        res.status(500).json({ message: 'Error calculating total' });
    }
});

//Endpoint to delete data of the Shoping cart
app.delete('/api/cart', async (req, res) => {
    try {
        await pool.query('DELETE FROM cart');

        res.json({ message: 'Cart emptied' });
    } catch (error) {
        console.error('Error empting the cart:', error);
        res.status(500).json({ message: 'Error empting the cart:' });
    }
});

//Endpoint to delete just 1 item from shopping cart
app.delete('/api/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM cart WHERE id = $1', [id]);
        res.json({ message: 'Product Deleted' });
    } catch (error) {
        console.error('Error deleting the product:', error);
        res.status(500).json({ message: 'Error deleting de product' });
    }
});

//Endpoint to add a product to favorites
app.post('/api/favorites', async (req, res) => {
    try {
        const { user_id, pokemon_id } = req.body;

        const result = await pool.query(
            'INSERT INTO favorites (user_id, pokemon_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
            [user_id, pokemon_id]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({ message: 'Already in favorites' });
        }

        res.json({ message: 'Added to favorites', data: result.rows[0] });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Error adding to favorites' });
    }
});

//Enpoint to delete from favorites
app.delete("/api/favorites/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(`DELETE FROM favorites WHERE id = $1`, [id]);

        res.json({ message: "Pokémon eliminado de favoritos" });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Enpoint to get favorites list
app.get("/api/favorites/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
        `SELECT favorites.id, pokemon.name, pokemon.pokeapi_id
        FROM favorites
        JOIN pokemon ON favorites.pokemon_id = pokemon.id
        WHERE favorites.user_id = $1`, 
        [user_id]
    );      
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Error fetching favorites" });
  }
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
        const { rows } = await pool.query('SELECT id, username, pass FROM users WHERE username = $1', [username]);

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

        res.json({ token, id: user.id });
    } catch (error) {
        console.error('Error durante el login:', error);
        res.status(500).json({ message: 'Error durante el login', error });
    }
});

app.listen(PORT, () => {
    console.log('Server Running on port 5000');
});