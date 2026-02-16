import { useCart } from "../context/CartContext";
import "./CartPage.css";

function CartPage() {
    const { cartItems, removeFromCart, addToCart, updateCartItem } = useCart();

    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    const handleDecreaseQuantity = (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateCartItem(productId, currentQuantity - 1);
        } else {
            removeFromCart(productId);
        }
    };

    const handleIncreaseQuantity = (productId, currentQuantity) => {
        updateCartItem(productId, currentQuantity + 1);
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1 className="cart-title">Your Cart</h1>
                {cartItems.length > 0 && (
                    <p className="cart-item-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
                )}
            </div>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <p className="empty-cart-text">Your cart is empty</p>
                    <a href="/" className="empty-cart-link">Continue Shopping</a>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.product.id} className="cart-item">
                                <div className="cart-item-image-wrapper">
                                    {item.product.image ? (
                                        <img 
                                            src={item.product.image} 
                                            alt={item.product.name}
                                            className="cart-item-image"
                                        />
                                    ) : (
                                        <div className="cart-item-placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.product.name}</h3>
                                    {item.product.description && (
                                        <p className="cart-item-description">{item.product.description}</p>
                                    )}
                                    <p className="cart-item-price">${Number(item.product.price).toFixed(2)}</p>
                                    <div className="quantity-controls">
                                        <button 
                                            className="quantity-btn decrease"
                                            onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button 
                                            className="quantity-btn increase"
                                            onClick={() => handleIncreaseQuantity(item.product.id, item.quantity)}
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item-subtotal">
                                    <p className="subtotal-label">Subtotal</p>
                                    <p className="subtotal-value">${(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <button 
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item.product.id)}
                                    aria-label="Remove item"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <div className="cart-summary-content">
                            <div className="cart-summary-row">
                                <span className="summary-label">Subtotal</span>
                                <span className="summary-value">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span className="summary-label">Shipping</span>
                                <span className="summary-value">Free</span>
                            </div>
                            <div className="cart-summary-divider"></div>
                            <div className="cart-summary-row total">
                                <span className="summary-label">Total</span>
                                <span className="summary-value">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="checkout-btn">Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;