import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/App.css';
import Header from './components/Header';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

/*useEffect(() => {
  const authStatus = localStorage.getItem('isAuthenticated');
  setIsAuthenticated(authStatus === 'true')
}, []);*/
useEffect(() => {
  const token = localStorage.getItem('token');
  setIsAuthenticated(!!token); //It turns the token in boolean
}, []);

if (isAuthenticated === null) return <div>Loading...</div>; // Evita render hasta confirmar autenticación

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
};

const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup'; // Hide Header in login and signup

  return (
    <div>
      {showHeader && <Header />} {/* It shows Header just if it isn'n login */}
      <Routes>
        <Route path='/signup' element={<Signup /> }/>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirige a login si la ruta no existe */}
      </Routes>
    </div>
  );
};

export default App;
