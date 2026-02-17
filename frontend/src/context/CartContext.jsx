import {createContext,useContext,useState,useEffect,useMemo} from "react";

const CartContext=createContext();

export const CartProvider=({children})=>{
    const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL;
    const [cartItems,setCartItems]=useState([]);
    const [loading,setLoading]=useState(true);

    // Calculate count and total from cartItems
    const count = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const price = item.product?.price || item.product_price || 0;
            return sum + (Number(price) * item.quantity);
        }, 0);
    }, [cartItems]);

    //Fetch Cart from BE
    const fetchCart= async () => {
        try {
            if (!baseUrl) {
                console.error("Base URL not configured");
                setLoading(false);
                return;
            }
           
            const res= await fetch(`${baseUrl}/api/cart/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
            });
            if(!res.ok) {
                throw new Error("Failed to fetch cart");
            }
            const data = await res.json();
            setCartItems(data.items || data || []);
           
        } catch(error) {
            console.error("Error fetching cart:",error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchCart();
    },[baseUrl])

    // Function to add item to cart
    const addToCart= async (product, quantity = 1) => {
        try{
            if (!baseUrl) {
                console.error("Base URL not configured");
                return;
            }
            const res = await fetch(`${baseUrl}/api/cart/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity
                })
            });
            if(!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to add item to cart");
            }
            const data = await res.json();
            // Update cart items from response
            setCartItems(data.items || []);
           
        } catch(error) {
            console.error("Error adding to cart:",error);
            throw error;
        }
    };

    // Remove item from cart
    const removeFromCart= async (productId) => {
        try {
            if (!baseUrl) {
                console.error("Base URL not configured");
                return;
            }
           
            const res = await fetch(`${baseUrl}/api/cart/remove/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    product_id: productId
                })
            });
            if(!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to remove item from cart");
            }
            const data = await res.json();
            // Update cart items from response
            setCartItems(data.items || []);
          
        } catch(error) {
            console.error("Error removing from cart:",error);
            // Fallback to local state update
            setCartItems(prevItems => prevItems.filter(item => {
                const itemProductId = item.product?.id || item.product_id;
                return itemProductId !== productId;
            }));
        }
    };

    // Clear cart
    const clearCart=()=>{
        setCartItems([]);
    };

    // Update item quantity
    const updateCartItem= async (itemId, quantity) => {
        try {
            if (!baseUrl) {
                console.error("Base URL not configured");
                return;
            }

            const res = await fetch(`${baseUrl}/api/cart/update-quantity/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    item_id: itemId,
                    quantity: quantity
                })
            });
            if(!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to update cart item");
            }
            // Refresh cart after update
            fetchCart();
           
        } catch(error) {
            console.error("Error updating cart item:",error);
            throw error;
        }
    };

    return(
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            updateCartItem,
            count,
            total,
            loading,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart=()=>{
    const context=useContext(CartContext);
    if(!context){
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
