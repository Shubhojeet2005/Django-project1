import {Link} from 'react-router-dom';
import './navbar.css';
import {useCart} from '../context/CartContext';
function Navbar() {
    const {cartItems} = useCart();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    MyStore
                </Link>
                <div className="navbar-cart">   
                    
                </div>
                <Link to="/cart" className="navbar-cart-link">
                    Cart
                    <span className="cart-count">{cartCount}</span>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;