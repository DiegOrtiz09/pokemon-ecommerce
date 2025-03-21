import React from 'react';
import { FaHome, FaSignOutAlt, FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';


const Header = (setIsAuthenticated) => {

  return (
    <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h1>PokéVerse</h1>

      {/*Search Bar*/}
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>
        <FaSearch style={{ marginRight: '5px', color: 'gray' }} />
        <input 
          type="text" 
          placeholder="Buscar Pokémon..." 
          style={{ border: 'none', outline: 'none', padding: '5px', width: '400px' }} 
        />
      </div>

      <nav>
        <a href="/home" style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
        <FaHome size={20} /> Home</a>
        <a href='/login' style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
        <FaSignOutAlt size={20} /> LogOut</a>
        <a href="/favorites" style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
          <FaHeart size={30} /></a>
        <a href="/cart" style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
          <FaShoppingCart size={30} /></a>
      </nav>
    </header>
  );
};

export default Header;