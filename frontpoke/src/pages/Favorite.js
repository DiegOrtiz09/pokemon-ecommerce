import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import '../styles/Favorite.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavoritePokemons = async () => {
            try {
                const userId = localStorage.getItem("user_id");

                if (!userId) {
                    console.error("Error: user_id no encontrado en localStorage");
                return;
                }
                const response = await axios.get(`http://localhost:5000/api/favorites/${userId}`);
                const favoritesData = response.data;

                const detailedFavorites = await Promise.all(
                    favoritesData.map(async (pokemon) => {
                        const pokeApiResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokeapi_id}`);
                    return { 
                    ...pokemon, 
                    image: pokeApiResponse.data.sprites.front_default, 
                    type: pokeApiResponse.data.types[0].type.name 
                    };
                    })
                );

                setFavorites(detailedFavorites);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        fetchFavoritePokemons();
    }, []);

    //Delete a product from favorite
    const handleRemoveFavorite = async (favoriteId) => {
        try {
            await axios.delete(`http://localhost:5000/api/favorites/${favoriteId}`);
            setFavorites(favorites.filter((pokemon) => pokemon.id !== favoriteId));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    // Go pokemon details
    const handlePokemonClick = (pokemon_id) => {
        navigate(`/pokemon/${pokemon_id}`);
    };

    return (
        <div>
            <h2>Favorite Pokemon List</h2>
            <div className="favorites-container">
                {favorites.map((pokemon) => (
                    <div key={pokemon.pokeapi_id} className="favorite-card" onClick={() => handlePokemonClick(pokemon.pokeapi_id)} style={{ cursor: "pointer" }}>
                        <img src={pokemon.image} alt={pokemon.name} />
                        <p>{pokemon.name} - {pokemon.type}</p>
                        <button onClick={() => handleRemoveFavorite(pokemon.pokeapi_id)}><MdDelete size={20}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
    
    export default Favorites;