import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token); // Save token in localstorage
                setIsAuthenticated(true); // Update the authentication status
                navigate('/home'); // Redirigir a la página de inicio
            } else {
                alert(data.message || 'User or Password incorrect');
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            alert('Error durante el login');
        }
    };


  return (
    <div className="login-page">
      {/* Sección de la imagen */}
      <div className="image-section">
        <img src="https://via.placeholder.com/500" alt="Imagen de Login" />
      </div>

      {/* Sección del formulario */}
      <div className="form-section">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
