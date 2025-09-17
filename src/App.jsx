import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Scanner from "./pages/Scanner/Scanner";
import Products from "./pages/Products/Products";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import { CartProvider } from "./contexts/CartContext";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Scanner />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/products" element={<Products />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
