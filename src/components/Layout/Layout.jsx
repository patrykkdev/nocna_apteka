import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Cart from "../Cart/Cart";
import Notification from "../Notification/Notifiacation";
import { useCart } from "../../contexts/CartContext";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  const { notification } = useCart();
  const location = useLocation();

  // Ukryj koszyk na stronie skanera (strona główna)
  const hideCart =
    location.pathname === "/" || location.pathname === "/scanner";

  return (
    <div className={styles.layout}>
      <Notification message={notification} />
      <Navbar />

      <div className={styles.container}>
        <div className={hideCart ? styles.contentFullWidth : styles.content}>
          <main className={styles.main}>{children}</main>

          {!hideCart && (
            <aside className={styles.sidebar}>
              <Cart />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
