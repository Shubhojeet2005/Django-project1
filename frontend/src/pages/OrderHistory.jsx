import { useEffect, useState } from "react";
import "./OrderHistory.css";
import { authFetch } from "../utils/auth";

function OrderHistory() {
  const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!baseUrl) {
        setError("Backend URL is not configured.");
        setLoading(false);
        return;
      }

      try {
        const res = await authFetch(`${baseUrl}/api/orders/history/`, {
          method: "GET",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.error || "Failed to load your orders. Please try again."
          );
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [baseUrl]);

  return (
    <div className="order-history-page">
      <header className="order-history-header">
        <h1>Order history</h1>
        <p>See everything you’ve purchased so far.</p>
      </header>

      {loading && <p className="order-history-state">Loading your orders…</p>}
      {error && <p className="order-history-state error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="order-history-state">
          You don’t have any orders yet. Once you check out, they’ll appear
          here.
        </p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="order-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-main">
                <h2 className="order-product-name">
                  {order.product?.name ?? "Product"}
                </h2>
                {order.product?.description && (
                  <p className="order-product-desc">
                    {order.product.description}
                  </p>
                )}
              </div>
              <div className="order-meta">
                <div className="order-row">
                  <span>Qty</span>
                  <span>{order.quantity}</span>
                </div>
                <div className="order-row">
                  <span>Total</span>
                  <span>₹{Number(order.total_price).toFixed(2)}</span>
                </div>
                <div className="order-row">
                  <span>Placed on</span>
                  <span>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;

