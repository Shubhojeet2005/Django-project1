import "./productCard.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { isAuthenticated } from "../utils/auth";

function ProductCard({ product }) {
  const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL || "";
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const imageSrc = product.image
    ? `${baseUrl.replace(/\/$/, "")}${product.image}`
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // If the user is not logged in, send them to the login page
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    try {
      await addToCart(product);
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card-link">
      <article className="product-card" role="article">
        <div className="product-media">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
          ) : (
            <div className="product-image-placeholder" aria-hidden="true">
              No image
            </div>
          )}
        </div>
        <div className="product-body">
          <h3 className="product-title">{product.name}</h3>
          {product.description && (
            <p className="product-desc">{product.description}</p>
          )}
          <div className="product-footer">
            <span className="product-price">${Number(product.price).toFixed(2)}</span>
            <button
              className="product-cta"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to cart
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;