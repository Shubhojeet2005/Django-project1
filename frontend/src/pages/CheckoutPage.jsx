import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authFetch, isAuthenticated } from "../utils/auth";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const { clearCart, total } = useCart();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      const createOrderRes = await authFetch(`${baseUrl}/api/payments/create/`, {
        method: "POST",
      });
      const orderData = await createOrderRes.json().catch(() => ({}));

      if (!createOrderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize payment");
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MyStore.studio",
        description: "Payment for your order",
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await authFetch(`${baseUrl}/api/payments/verify/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                name: form.name,
                address: form.address,
                phone: form.phone
              })
            });
            const verifyData = await verifyRes.json().catch(() => ({}));

            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            setMessage("Payment successful! Redirecting to home...");
            clearCart();
            setTimeout(() => navigate("/"), 2000);
          } catch (err) {
            setError(err.message || "Payment verification failed.");
            setLoading(false);
          }
        },
        prefill: {
          name: form.name,
          contact: form.phone,
        },
        theme: {
          color: "#e6a6a6", // Dusty rose color from Ahn Studio palette
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function () {
        setError("Payment Failed. Please try again.");
        setLoading(false);
      });

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong initializing payment.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setError("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    if (!baseUrl) {
      setError("Configuration error: backend URL is not set.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    if (form.payment_method === "CreditCard") {
      handleOnlinePayment();
      return;
    }

    try {
      const res = await authFetch(`${baseUrl}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          total,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order. Please try again.");
      }

      setMessage("Order placed successfully! Redirecting to home...");
      clearCart();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-summary">
          <span className="summary-label">Order Total:</span>
          <span className="summary-amount">₹{total.toFixed(2)}</span>
        </div>

        {message && <div className="checkout-message success">{message}</div>}
        {error && <div className="checkout-message error">{error}</div>}

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter your full address"
              value={form.address}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="payment_method">Payment Method</label>
            <select
              id="payment_method"
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="CreditCard">Online Payment</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <button type="submit" className="checkout-button" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;