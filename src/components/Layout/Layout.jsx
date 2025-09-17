import React from "react";
import Navbar from "../Navbar/Navbar";
import Cart from "../Cart/Cart";
import Notification from "../Notification/Notifiacation";
import { useCart } from "../../contexts/CartContext";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  const { notification } = useCart();

  return (
    <div className={styles.layout}>
      <Notification message={notification} />
      <Navbar />

      <div className={styles.container}>
        <div className={styles.content}>
          <main className={styles.main}>{children}</main>

          <aside className={styles.sidebar}>
            <Cart />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Layout;
