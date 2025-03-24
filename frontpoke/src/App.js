import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/App.css';
import Header from './components/Header';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import Favorite from './pages/Favorite'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

useEffect(() => {
  const token = localStorage.getItem('token');
  setIsAuthenticated(!!token); //It turns the token in boolean
}, []);

if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
};

const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
        setUserId(Number(storedUserId));
    }
  }, []);

  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <div>
      {showHeader && <Header />} {/* It shows Header just if it isn'n login */}
      <Routes>
        <Route path='/signup' element={<Signup /> }/>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/cart" element={isAuthenticated ? <ShoppingCart userId={userId} /> : <Navigate to="/login" />}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favorite" element={isAuthenticated ? <Favorite userId={userId} /> : <Navigate to="/login" />}/>
        <Route path="*" element={<Navigate to="/login" />} /> {/* Go login if the route doesnot exist */}
        
      </Routes>
    </div>
  );
};

export default App;
