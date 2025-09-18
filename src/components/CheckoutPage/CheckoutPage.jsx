// CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import styles from "./CheckoutPage.module.css";
import { FaCheckCircle } from "react-icons/fa";

const CheckoutPage = () => {
  const { cart, getTotalPrice } = useCart();
  const [paymentStatus, setPaymentStatus] = useState("idle");

  useEffect(() => {
    // Sprawdzamy, czy w danych koszyka znajduje się status płatności.
    // Zakładamy, że twój CartProvider i CartService potrafią przekazać taki status.
    const checkoutStatus = cart.checkoutStatus;

    if (checkoutStatus === "awaiting_payment" && paymentStatus === "idle") {
      setPaymentStatus("awaiting_card");
      const paymentTimeout = setTimeout(() => {
        setPaymentStatus("paid");
      }, 4000);

      return () => clearTimeout(paymentTimeout);
    }
  }, [cart, paymentStatus]);

  const renderPaymentContent = () => {
    if (paymentStatus === "awaiting_card") {
      return (
        <div className={styles.paymentProcessing}>
          <div className={styles.pulseAnimation}></div>
          <p>Masz 4 sekundy na przyłożenie karty...</p>
        </div>
      );
    }
    if (paymentStatus === "paid") {
      return (
        <div className={styles.paymentSuccess}>
          <FaCheckCircle className={styles.successIcon} />
          <h2>Zamówienie opłacone!</h2>
          <p>Dziękujemy za zakupy.</p>
        </div>
      );
    }
    return (
      <div className={styles.emptyMessage}>
        <p>Oczekuję na sygnał płatności...</p>
      </div>
    );
  };

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutContainer}>
        <h2 className={styles.checkoutTitle}>Terminal płatniczy</h2>
        {/* Wyświetlanie listy produktów z koszyka */}
        {cart && Array.isArray(cart) && cart.length > 0 ? (
          <div className={styles.checkoutItems}>
            {cart.map((item) => (
              <div key={item.barcode} className={styles.checkoutItem}>
                <img
                  src={
                    item.image || "https://via.placeholder.com/60x60?text=Lek"
                  }
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemPrice}>
                    {(item.price * item.quantity).toFixed(2)} zł
                  </span>
                </div>
                <span className={styles.itemQuantity}>
                  ilość: {item.quantity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            <p>Brak produktów w koszyku.</p>
          </div>
        )}
        <div className={styles.totalPrice}>
          <span>Do zapłaty:</span>
          <span className={styles.totalAmount}>
            {getTotalPrice().toFixed(2)} zł
          </span>
        </div>
        <div className={styles.paymentSection}>{renderPaymentContent()}</div>
      </div>
    </div>
  );
};

export default CheckoutPage;
