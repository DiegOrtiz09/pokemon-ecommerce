CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE pokemon (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    pokeapi_id INT UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    pokemon_id INT REFERENCES pokemon(id),
    quantity INT NOT NULL
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    pokemon_id INT REFERENCES pokemon(id)
);