import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/home');
    };

    return (
        <div className="checkout-success">
            <img src="/images/pokeimg.png" alt="img-poke" />
            <h1>Thanks for your purchase!</h1>
            <p>Your order has been process successfuly.</p>
            <button onClick={handleReturnHome}>Back Home</button>
        </div>
    );
};

export default Checkout;