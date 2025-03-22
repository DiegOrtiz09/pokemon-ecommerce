import React, { useEffect, useState } from 'react';
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

return (
    <div className="pokemon-detail">
        <h1>{pokemon?.name}</h1>
        <img src={pokeapiData.sprites.front_default} alt={pokemon?.name} className="pokemon-detail-image" />
        <p><strong>Pokedex:</strong> {pokemon?.pokeapi_id}</p>
        <p><strong>Types:</strong> {pokeapiData.types.map(t => t.type.name).join(', ')}</p>
        <p><strong>Abilities:</strong> {pokeapiData.abilities.map(a => a.ability.name).join(', ')}</p>
        <p><strong>Generation:</strong> {pokeapiData.game_indices.length > 0 ? pokeapiData.game_indices[0].version.name : "Unknown"}</p>
        <p><strong>Price:</strong> ${pokemon?.price}</p>
        <button className="favorite-button">Add to Favorites</button>
        <button className="cart-button">Add to Cart</button>
    </div>
);

};

export default PokemonDetail;