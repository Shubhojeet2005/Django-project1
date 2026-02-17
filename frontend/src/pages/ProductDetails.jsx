import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";
import { useCart } from "../context/CartContext";
function ProductDetails() {
  const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL;
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setcount]=useState(0);
  const {addToCart} = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/products/${id}/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && baseUrl) {
      fetchProduct();
    }
  }, [id, baseUrl]);

  if (loading) return <div className="product-details-state">Loading...</div>;
  if (error) return <div className="product-details-state">Error: {error}</div>;
  if (!product) return <div className="product-details-state">Product not found</div>;

  return (
    <div className="product-details">
      <div className="product-details-header">
        <Link to="/" className="back-link">
          ← Back to products
        </Link>
      </div>
      <div className="product-details-body">
        <h1 className="product-details-title">{product.name}</h1>
        {product.description && (
          <p className="product-details-desc">{product.description}</p>
        )}
        <div className="product-details-meta">
          <span className="product-details-price">
            ${Number(product.price)}
          </span>
          {product.category && (
            <span className="product-details-category">
              {product.category.name || product.category}
            </span>

            
          )}
          <button
            className="product-details-cta"
            onClick={() => {addToCart(product.id);
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;