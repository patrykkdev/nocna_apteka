// App.js - dopasowany do Twojej struktury
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Scanner from "./pages/Scanner/Scanner";
import Products from "./pages/Products/Products";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import { CartProvider } from "./contexts/CartContext";
import "./App.css";
import Cart from "./components/Cart/Cart";
import Watch from "./components/Watch/Watch";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          {/* <Layout> */}
          <Routes>
            <Route
              path="/"
              element={<Cart title="Koszyk" canProceedCart={true} />}
            />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/finalize" element={<CheckoutPage />} />
          </Routes>
          {/* </Layout> */}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
