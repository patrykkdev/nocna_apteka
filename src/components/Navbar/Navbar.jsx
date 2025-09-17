import React from "react";
import { NavLink } from "react-router-dom";
import { Scan, Package, BarChart3, Settings, ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { getTotalItems } = useCart();

  const navItems = [
    { path: "/scanner", icon: Scan, label: "Skaner" },
    { path: "/products", icon: Package, label: "Produkty" },
    { path: "/reports", icon: BarChart3, label: "Raporty" },
    { path: "/settings", icon: Settings, label: "Ustawienia" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1 className={styles.title}>🌙 NOCNA APTEKA</h1>
        </div>

        <div className={styles.navigation}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className={styles.cartInfo}>
          <ShoppingCart size={20} />
          <span className={styles.cartCount}>{getTotalItems()}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
