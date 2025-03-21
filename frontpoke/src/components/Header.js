import React from 'react';


const Header = (setIsAuthenticated) => {

  return (
    <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h1>Tienda de Pokémon</h1>
      <nav>
        <a href="/home" style={{marginRight: '10px'}}>Home</a>
        <a href='/login'>Log Out</a>
      </nav>
    </header>
  );
};

export default Header;