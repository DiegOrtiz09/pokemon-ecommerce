import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/PokemonDetail.css';

const PokemonDetail = () => {
const { id } = useParams();
const [pokemon, setPokemon] = useState(null);
const [pokeapiData, setPokeapiData] = useState(null);

useEffect(() => {
    const fetchPokemonDetails = async () => {
        try {
            //Obtain data from local API (DB data)
            const response = await axios.get(`http://localhost:5000/api/pokemon/${id}`);
            setPokemon(response.data);

            //Obtain the rest of data from pokeAPI
            const pokeapiResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${response.data.pokeapi_id}`);
            setPokeapiData(pokeapiResponse.data);
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    };

    fetchPokemonDetails();
}, [id]);

if (!pokemon || !pokeapiData) {
    return <div>Loading...</div>;
}

const handleAddToCart = async () => {
    //const user = JSON.parse(localStorage.getItem("user_id"));
    const userId = localStorage.getItem("user_id");
    console.log("User ID:", userId);//
    console.log("Pokemon:", pokemon);  // Esto mostrará si `pokemon` es undefined o incorrecto
    console.log("Pokemon ID:", pokemon?.id); // Esto mostrará el id o undefined si no existe


    if (!userId) {  
        alert("You have to be logged in to add products in the shopping cart");
        return;
    }
    try{
        console.log("Data sent to API:", {
            user_id: userId,
            pokemon_id: pokemon.id
        });
        const response = await axios.post('http://localhost:5000/api/cart', {
            user_id: userId,
            pokemon_id: pokemon.id,
            quantity: 1,
        });
        alert('Product Added to Cart')
    } catch(error){
        console.error('Error adding to cart: ', error);
        alert('It Was an Error adding to Cart');
    }
};




const handleAddToFavorites = async (pokemonId) => {
    const userId = localStorage.getItem("user_id");
    console.log("User ID:", userId);
    console.log("Pokemon:", pokemon);  // Esto mostrará si `pokemon` es undefined o incorrecto
    console.log("Pokemon ID:", pokemon?.id); // Esto mostrará el id o undefined si no existe

    if (!userId) {
        alert("You have to be logged in to add Pokémon to favorites");
        return;
    }

    try {
        const response = await axios.post("http://localhost:5000/api/favorites", {
            user_id: userId,
            pokemon_id: pokemonId,
        });

        alert(response.data.message || "Pokémon added to favorites!");
    } catch (error) {
        console.error("Error adding to favorites:", error);
        alert("There was an error adding to favorites.");
    }
};


return (
    <div className='pokemon-detail-container'>
        <div className="pokemon-info">
            <h1>{pokemon?.name}</h1>
            <img src={pokeapiData.sprites.front_default} alt={pokemon?.name} className="pokemon-detail-image" />
        </div>
        <div className='pokemon-data'>
            <p><strong>Pokedex:</strong> {pokemon?.pokeapi_id}</p>
            <p><strong>Types:</strong> {pokeapiData.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Abilities:</strong> {pokeapiData.abilities.map(a => a.ability.name).join(', ')}</p>
            <p><strong>Generation:</strong> {pokeapiData.game_indices.length > 0 ? pokeapiData.game_indices[0].version.name : "Unknown"}</p>
            <p><strong>Price:</strong> ${pokemon?.price}</p>
            <button className="favorite-button" onClick={() => handleAddToFavorites(pokemon.id)}>Add to Favorites</button>
            <button className="cart-button" onClick={handleAddToCart}>Add to Cart</button>
        </div>
    </div>
);

};

export default PokemonDetail;