import { useEffect,useState } from "react";
import ProductCard from "../components/productCard";
import './ProductList.css';


function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/products`);
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
            <header className="page-header">
                <h1 className="page-title">Product List</h1>
                <p className="page-subtitle">Browse our selection</p>
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
