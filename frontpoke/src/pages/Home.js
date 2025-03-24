import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';


const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 20;
  const navigate = useNavigate();

  //Obtain the pokemon list from pokeapi and DB
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const offset = currentPage * limit;
        const response = await axios.get(`http://localhost:5000/api/pokemon?offset=${offset}`);
        setPokemonList(response.data);
        setFilteredPokemonList(response.data);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };
    fetchPokemon();
  }, [currentPage]); //Dependencia: se ejecuta cuando cambia currentPage


const handleNextPage = () => {
  setCurrentPage((prevPage) => prevPage + 1); //Go next page
};
const handlePreviousPage = () => {
  if (currentPage > 0) {
    setCurrentPage((prevPage) => prevPage - 1); // Go previous page
  }
};

const handlePokemonClick = (id) => {
  console.log('pokemon id:' , id);
  navigate(`/pokemon/${id}`);
}

  return (
    <div className="home-page">
      <h1>Welcome to PokéVerse</h1>
      <p>You will find a big amount of pokemon you can buy</p>


      {/*Container for products (pokemon) */}
      <div className="pokemon-grid">
      
          {filteredPokemonList.map((pokemon, index) => (
            <div key={index} className="pokemon-card" onClick={() => handlePokemonClick(pokemon.pokeapi_id)}>
              <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
              <h3 className="pokemon-name">{pokemon.name}</h3>
              <p className="pokemon-type">{pokemon.types.join(', ')}</p>
              <p className="pokemon-price">${pokemon.price}</p>
            </div>
        ))}
      </div>

      <div className='pagination'>
      <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Prev
        </button>
        <span>Page {currentPage + 1}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default Home;
