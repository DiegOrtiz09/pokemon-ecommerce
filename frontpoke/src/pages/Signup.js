import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                username,
                password,
                email,
            });

            if (response.status === 201) {
                alert('User Registred Successfuly');
                navigate('/login'); // Go login after signing up
            }
        } catch (error) {
            console.error('Failed registering user:', error);
            alert('Failed registering user');
        }
    };

    return (
        <div className='signup-page'>
            <div className='image-signup-section'>
                <img src="/images/pokeimg.png" alt="SignUp image" />
            </div>

            <div className='form-signup-container'>
                <div className='form-signup-section'>
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='input-signup-group'>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        </div>
                        <button type="submit" className='register-button'>Sign Up</button>
                    </form>
                    <button type='button' onClick={() => navigate('/login')} className='enter-button'>I already have an account</button>
                </div>
            </div>
            
        </div>
    );
};

export default Signup;