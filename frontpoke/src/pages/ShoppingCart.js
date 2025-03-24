import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import '../styles/ShoppingCart.css';

const ShoppingCart = ({ userId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();


//Get pokemon in the Shopping Cart
const fetchCartItems = async () =>{
    try{
        const userId = localStorage.getItem("user_id");
        const response = await axios.get('http://localhost:5000/api/cart', {
            params: {user_id: userId},
        });

        const cartData = response.data;
        const updatedCart = await Promise.all(
            cartData.map(async (item) =>{
                const pokeResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${item.pokeapi_id}`);
                return {
                    ...item,
                    name: pokeResponse.data.name,
                    image_url: pokeResponse.data.sprites.front_default,
                    price: item.price,
                };
            })
        );
        setCartItems(updatedCart);
    } catch(error){
        console.error('Error Fetching Cart items: ', error);
    }
};

//Calculate the total
const fetchCartTotal = async () => {
    try{
        const response = await axios.get('http://localhost:5000/api/cart/total', {
            params: {user_id: userId},
        });
        setTotal(response.data.total);
    }catch(error){
        console.error('Error Fetching Cart Total: ', error);
    }
};

useEffect(() =>{
    fetchCartItems();
    fetchCartTotal();
}, [userId]);

const handleCheckout = async () => {
    navigate('/checkout');
    try {
        await axios.delete('http://localhost:5000/api/cart');
        setCartItems([]);
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Error processing your purchase. Try again.');
    }
    
};

const handleDeleteItem = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/api/cart/${id}`);
        setCartItems(cartItems.filter(item => item.id !== id));
        fetchCartTotal();
    } catch (error) {
        console.error('Error deleting the product from Shopping cart:', error);
        alert('Error deleting the product. Try again.');
    }
}

return (
    <div className="shopping-cart">
        <h1>Your Shopping Cart</h1>
        <div className="cart-items">
            {cartItems.map((item) =>(
                <div key={item.id} className="cart-item">
                    <img src={item.image_url} className="cart-item-image" />
                    <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price}</p>
                        <p>Subtotal: ${item.price * item.quantity}</p>
                        <button onClick={() => handleDeleteItem(item.id)}> <MdDelete size={20}/></button>
                    </div>
                </div>
            ))}
        </div>
        <div className="cart-total">
            <h3>Total: ${total}</h3>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
    </div>
);
};

export default ShoppingCart;