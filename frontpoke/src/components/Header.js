import React from 'react';
import { FaHome, FaSignOutAlt, FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';


const Header = (setIsAuthenticated) => {

  return (
    <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h1>PokéVerse</h1>

      <nav>
        <a href="/home" style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
        <FaHome size={20} /> Home</a>
        <a href='/login' style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
        <FaSignOutAlt size={20} /> LogOut</a>
        <a href="/favorite" style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
          <FaHeart size={30} /></a>
        <a href="/cart" style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
          <FaShoppingCart size={30} /></a>
      </nav>
    </header>
  );
};

export default Header;