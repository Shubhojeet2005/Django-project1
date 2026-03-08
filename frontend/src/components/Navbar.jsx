import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import SidePanel from "./SidePanel";

function Navbar() {
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-left">
                        <button
                            className="menu-toggle"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                        <div className="navbar-links desktop-only">
                            <Link to="/" className="nav-link">Shop All</Link>
                            <Link to="/about" className="nav-link">Our Story</Link>
                        </div>
                    </div>

                    <Link to="/" className="navbar-logo">
                        MyStore.studio
                    </Link>

                    <div className="navbar-right">
                        <Link to="/login" className="nav-link desktop-only">
                            Account
                        </Link>
                        <Link to="/cart" className="navbar-cart-link">
                            Cart
                            <span className="cart-count">{cartCount > 0 ? cartCount : 0}</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* The Corner Sidebar Overlay */}
            <SidePanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
}

export default Navbar;