import "./productCard.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL || "";
  const { addToCart } = useCart();
  const imageSrc = product.image
    ? `${baseUrl.replace(/\/$/, "")}${product.image}`
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
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