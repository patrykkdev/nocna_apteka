import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { getProductByCode } from "../../utils/products";
import styles from "./Watch.module.css";

const Watch = ({ title = "Lista Produktów" }) => {
  // hooks - używamy tego samego co w Cart.jsx
  const { cart, updateQuantity, removeFromCart, addToCart } = useCart();

  // Debug - sprawdź co jest w koszyku
  console.log("Watch - cart:", cart);

  // Dodajmy przykładowe produkty na start (tylko do testowania)
  useEffect(() => {
    // Sprawdź czy koszyk jest pusty i dodaj przykładowe produkty
    if (cart.length === 0) {
      const sampleProducts = [
        {
          barcode: "123456789",
          name: "Paracetamol 500mg",
          price: 8.5,
          image: "https://via.placeholder.com/32x32?text=P",
        },
        {
          barcode: "987654321",
          name: "Aspiryna 100mg",
          price: 12.3,
          image: "https://via.placeholder.com/32x32?text=A",
        },
        {
          barcode: "555666777",
          name: "Witamina C 1000mg",
          price: 15.99,
          image: "https://via.placeholder.com/32x32?text=C",
        },
      ];

      sampleProducts.forEach((product) => {
        addToCart(product);
      });
    }
  }, []); // Uruchomi się tylko raz po zamontowaniu komponentu

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
  }, [buffer, addToCart]);

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

  return (
    <div className={styles.watchWrapper}>
      <div className={styles.watchContainer}>
        <div className={styles.watchHeader}>
          <div className={styles.watchTitle}>
            <h2>{title}</h2>
          </div>
        </div>

        <div className={styles.watchItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyWatch}>
              <p>Koszyk jest pusty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.barcode} className={styles.watchItem}>
                <img
                  src={
                    item.image || "https://via.placeholder.com/32x32?text=Lek"
                  }
                  alt={item.name}
                  className={styles.itemImage}
                />

                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                </div>

                <div className={styles.quantityControls}>
                  <div className={styles.quantityWrapper}>
                    <button
                      className={`${styles.quantityBtn} ${styles.decreaseBtn}`}
                      onClick={() => handleDecreaseQuantity(item.barcode)}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      className={`${styles.quantityBtn} ${styles.increaseBtn}`}
                      onClick={() => handleIncreaseQuantity(item.barcode)}
                    >
                      +
                    </button>
                  </div>
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
      </div>

      {/* Ukryty input do obsługi skanowania - taki sam jak w Cart.jsx */}
      <input
        ref={inputRef}
        style={{ position: "absolute", left: "-9999px" }}
        readOnly
        value={buffer}
      />
    </div>
  );
};

export default Watch;
