import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";
import './ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL || "http://localhost:8000";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/products/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [baseUrl]);

    return (
        <div className="product-list-page">
            <HeroCarousel />
            <header className="page-header">
                <h1 className="page-title">The Spring Collection</h1>
                <p className="page-subtitle">Picks of the season</p>
            </header>
            {loading && <p className="loading">Loading products...</p>}
            {error && <p className="error">Error: {error}</p>}
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default ProductList;
