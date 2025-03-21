import React, { useEffect, useState } from 'react';
import '../styles/Home.css'

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);

  //Simulacion de una lista de pokemon
  useEffect(() =>{
    const mockPokemonList = [
      {name: 'Pikachu', 
        type:'Electric', 
        price:100, 
        image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'},
        { name: 'Bulbasaur', 
          type: 'Planta', 
          price: 120, 
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
        { name: 'Charmander', 
          type: 'Fire', 
          price: 110, 
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' }
    ];
    setPokemonList(mockPokemonList);
  }, []);


  return (
    <div className="home-page">
      <h1>Welcome to PokéVerse</h1>
      <p>You will find a big amount of pokemon you can buy</p>

      {/*Container for products (pokemon) */}
        <div className="pokemon-grid">
          {pokemonList.map((pokemon, index) => (
            <div key={index} className="pokemon-card">
              <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
              <h3 className="pokemon-name">{pokemon.name}</h3>
              <p className="pokemon-type">{pokemon.type}</p>
              <p className="pokemon-price">${pokemon.price}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
