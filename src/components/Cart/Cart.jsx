import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { getProductByCode } from "../../utils/products";
import styles from "./Cart.module.css";

const Cart = ({ title = "Koszyk", canProceedCart = false }) => {
  // hooks
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    addToCart,
    finalizeOrder, // Nowa funkcja
  } = useCart();

  // refs
  const inputRef = useRef(null);

  // states
  const [buffer, setBuffer] = useState("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = buffer;
    }

    const handler = (e) => {
      if (e.key === "Enter") {
        if (buffer.trim().length > 0) {
          const product = getProductByCode(buffer.trim());
          console.log("Skanowany kod:", buffer.trim(), product);
          if (product) {
            addToCart(product);
          } else {
            // obsłuż produkt nieznaleziony
            console.log("Produkt nieznaleziony:", buffer.trim());
          }
        }
        setBuffer("");
      } else if (e.key.length === 1) {
        // tylko znaki, bez Shift/Ctrl/Alt
        setBuffer((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [buffer]);

  const handleIncreaseQuantity = (barcode) => {
    const item = cart.find((item) => item.barcode === barcode);
    if (item) {
      updateQuantity(barcode, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (barcode) => {
    const item = cart.find((item) => item.barcode === barcode);
    if (item && item.quantity > 1) {
      updateQuantity(barcode, item.quantity - 1);
    } else if (item) {
      removeFromCart(barcode);
    }
  };

  const handleFinalizeOrder = () => {
    finalizeOrder();
  };

  return (
    <div className={styles.cartWrapper}>
      <div className={styles.videoConainer}>
        {/* <div className={styles.cartTitle}>
          <h2>Podgląd z kamerki</h2>
        </div> */}
        <div className={styles.videoWrapper}>
          <img
            src="http://192.168.88.200/mjpg/video.mjpg"
            alt="Kamera"
            className={styles.video}
          />
        </div>
      </div>

      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <div className={styles.cartTitle}>
            <h2>{title}</h2>
          </div>
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Koszyk jest pusty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.barcode} className={styles.cartItem}>
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
                    {item.price.toFixed(2)} zł
                  </span>
                </div>

                <div className={styles.quantityControls}>
                  <div className={styles.quantityWrapper}>
                    <button
                      className={`${styles.quantityBtn} ${styles.decreaseBtn}`}
                      onClick={() => handleDecreaseQuantity(item.barcode)}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>
                      ilość: {item.quantity}
                    </span>
                    <button
                      className={`${styles.quantityBtn} ${styles.increaseBtn}`}
                      onClick={() => handleIncreaseQuantity(item.barcode)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.itemTotal}>
                  {(item.price * item.quantity).toFixed(2)} zł
                </div>
                <button
                  className={`${styles.quantityBtn} ${styles.removeBtn}`}
                  onClick={() => removeFromCart(item.barcode)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {canProceedCart && cart.length > 0 && (
          <div className={styles.cartFooter}>
            <button
              className={styles.proceedCartBtn}
              onClick={handleFinalizeOrder}
            >
              Finalizuj koszyk
            </button>
            <div className={styles.totalPrice}>
              <span>Razem:</span>
              <span className={styles.totalAmount}>
                {getTotalPrice().toFixed(2)} zł
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
