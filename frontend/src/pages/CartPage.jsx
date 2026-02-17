import { useCart } from "../context/CartContext";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const navigate = useNavigate();
    const { cartItems, total,removeFromCart, addToCart, updateCartItem } = useCart();

    // const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

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
                        {cartItems.map((item) => {
                            const itemId = item.id; // Cart item ID for update operations
                            const productId = item.product?.id || item.product_id; // Product ID for remove operations
                            const productName = item.product?.name || item.product_name;
                            const productPrice = item.product?.price || item.product_price || 0;
                            const productImage = item.product?.image || item.product_image;
                            const productDescription = item.product?.description;
                            
                            return (
                                <div key={itemId || productId} className="cart-item">
                                    <div className="cart-item-image-wrapper">
                                        {productImage ? (
                                            <img 
                                                src={productImage} 
                                                alt={productName}
                                                className="cart-item-image"
                                            />
                                        ) : (
                                            <div className="cart-item-placeholder">No Image</div>
                                        )}
                                    </div>
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{productName}</h3>
                                        {productDescription && (
                                            <p className="cart-item-description">{productDescription}</p>
                                        )}
                                        <p className="cart-item-price">${Number(productPrice).toFixed(2)}</p>
                                        <div className="quantity-controls">
                                            <button 
                                                className="quantity-btn decrease"
                                                onClick={() => handleDecreaseQuantity(itemId, item.quantity)}
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button 
                                                className="quantity-btn increase"
                                                onClick={() => handleIncreaseQuantity(itemId, item.quantity)}
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-subtotal">
                                        <p className="subtotal-label">Subtotal</p>
                                        <p className="subtotal-value">${(Number(productPrice) * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button 
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(productId)}
                                        aria-label="Remove item"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="cart-summary">
                        <div className="cart-summary-content">
                            <div className="cart-summary-row">
                                <span className="summary-label">Subtotal</span>
                                <span className="summary-value">${total.toFixed(2)}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span className="summary-label">Shipping</span>
                                <span className="summary-value">Free</span>
                            </div>
                            <div className="cart-summary-divider"></div>
                            <div className="cart-summary-row total">
                                <span className="summary-label">Total</span>
                                <span className="summary-value">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            className="checkout-btn"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;