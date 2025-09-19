// CheckoutPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useCart } from "../../contexts/CartContext";
import { setPaymentStatus } from "../../services/paymentService";
import styles from "./CheckoutPage.module.css";
import { FaCheckCircle } from "react-icons/fa";

const CheckoutPage = () => {
  const { cart, getTotalPrice, paymentStatus, clearCart } = useCart(); // Dodajemy clearCart
  const [localPaymentState, setLocalPaymentState] = useState("idle");
  const timeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  useEffect(() => {
    // Czyszczenie poprzednich timeoutów
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    // Obsługa zmiany statusu płatności z Firebase
    // TYLKO gdy zmienia się z false na true (kliknięto przycisk)
    if (paymentStatus.show_payment && localPaymentState === "idle") {
      console.log("🔄 Payment button clicked - starting payment process");
      setLocalPaymentState("awaiting_card");

      // Timer na 4 sekundy
      timeoutRef.current = setTimeout(() => {
        console.log("✅ Payment completed - showing success");
        setLocalPaymentState("paid");

        // Po kolejnych 2 sekundach resetuj status i wyczyść koszyk
        resetTimeoutRef.current = setTimeout(async () => {
          console.log("🔄 Resetting payment status and clearing cart");
          try {
            // Najpierw wyczyść koszyk (bez notyfikacji, żeby nie zakłócać UX)
            await clearCart(false);
            console.log("🛒 Cart cleared successfully");

            // Potem resetuj status płatności
            await setPaymentStatus(false);
            setLocalPaymentState("idle");
            console.log("✅ Payment status reset successfully");
          } catch (error) {
            console.error("❌ Błąd podczas resetowania:", error);
          }
        }, 2000);
      }, 4000);
    }

    // Reset lokalnego stanu gdy Firebase status się zmienia na false
    if (!paymentStatus.show_payment && localPaymentState !== "idle") {
      console.log(
        "🔄 Firebase status changed to false - resetting local state"
      );
      setLocalPaymentState("idle");
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [paymentStatus.show_payment, clearCart]); // Dodajemy clearCart do dependencies

  const renderPaymentContent = () => {
    console.log(
      "🎨 Rendering payment content. State:",
      localPaymentState,
      "Firebase status:",
      paymentStatus.show_payment
    );

    if (localPaymentState === "awaiting_card") {
      return (
        <div className={styles.paymentProcessing}>
          <div className={styles.pulseAnimation}></div>
          <p>Masz 4 sekundy na przyłożenie karty...</p>
          <div className={styles.countdown}>
            <div className={styles.countdownBar}></div>
          </div>
        </div>
      );
    }

    if (localPaymentState === "paid") {
      return (
        <div className={styles.paymentSuccess}>
          <FaCheckCircle className={styles.successIcon} />
          <h2>Zamówienie opłacone!</h2>
          <p>Dziękujemy za zakupy.</p>
          <p className={styles.cartClearInfo}>
            Koszyk zostanie wyczyszczony...
          </p>
        </div>
      );
    }

    return (
      <div className={styles.emptyMessage}>
        <p>Oczekuję na kliknięcie "Finalizuj koszyk"...</p>
        <p className={styles.debugInfo}>
          Firebase: {paymentStatus.show_payment ? "TRUE" : "FALSE"} | Local:{" "}
          {localPaymentState}
        </p>
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
