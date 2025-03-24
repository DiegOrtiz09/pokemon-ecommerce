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
                localStorage.setItem("user_id", data.id); // Save user_id
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
      {/* image section */}
      <div className="image-section">
        <img src="/images/pokeimg.png" alt="Imagen de Login" />
      </div>

      <div className='form-container'>
      {/* form section */}
      <div className="form-section">
        <h2>Hello! <br/> Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              placeholder='Username'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              placeholder='Password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
        <p className='signup-text'>
          You don't have an account?
        </p>
        <button type="button" onClick={() => navigate('/signup')} className='signup-button'>
          Sign Up
        </button>
      </div>
      </div>
    </div>
  );
};

export default Login;
