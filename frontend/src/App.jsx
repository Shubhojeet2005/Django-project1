import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Navbar from './components/Navbar'
import CartPage from "./pages/CartPage";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;