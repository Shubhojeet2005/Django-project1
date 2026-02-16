import {createContext,useContext,useState} from "react";

const CartContext=createContext();

export const CartProvider=({children})=>{
    const [cartItems,setCartItems]=useState([]);
    const [count,setCount]=useState(0);


    // Function to add item to cart
    const addToCart=(product) => {
        const existingItem=cartItems.find(item=>item.product.id===product.id);
        if(existingItem){
            setCartItems(cartItems.map(item=>
                item.product.id===product.id
                ?{...item,quantity:item.quantity+1}
                :item
            ));
        }else{
            setCartItems([...cartItems,{product,quantity:1}]);
        }
    };

////remove item from cart
    const removeFromCart=(productId)=>{
        setCartItems(cartItems.filter(item=>item.product.id!==productId));
    };

    // Clear cart
    const clearCart=()=>{
        setCartItems([]);
    };

    //update item quantity
    const updateCartItem=(productId,quantity)=>{
        setCartItems(cartItems.map(item=>{
            if(item.product.id===productId){
                return {...item,quantity};
            }
            return item;
        }));
    };

    return(
        <CartContext.Provider value={{cartItems,addToCart,removeFromCart,clearCart,updateCartItem,count,setCount}}>
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
