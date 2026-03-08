import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRouter from "./components/PrivateRouter";
import OrderHistory from "./pages/OrderHistory";
import About from "./pages/About";
import SidePanel from "./components/SidePanel";
import SpringLeaves from "./components/SpringLeaves";

function App() {
  return (
    <Router>
      <div className="App">
        <SpringLeaves />
        <Navbar />
        <div className="app-shell">
          <SidePanel />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route element={<PrivateRouter />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrderHistory />} />
              </Route>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;