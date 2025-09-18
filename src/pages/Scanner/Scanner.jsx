import React, { useState, useEffect, useRef } from "react";
import { Scan, Plus, Minus, X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { getProductByBarcode } from "../../services/productsService.jsx";
import styles from "./Scanner.module.css";

const Scanner = () => {
  const [buffer, setBuffer] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState("");
  const [scannedProducts, setScannedProducts] = useState([]);

  const inputRef = useRef(null);
  const lastScanTimeRef = useRef(0);

  const {
    addToCart,
    showNotification,
    cart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  // Global keydown handler dla skanera HID
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter") {
        if (buffer.trim().length > 0) {
          setBuffer("");
          // performScan(buffer.trim());
        }
        // setBuffer("");
      } else if (e.key.length === 1) {
        // tylko znaki, bez Shift/Ctrl/Alt
        setBuffer((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [buffer]);

  // Aktualizuj wartość w input (dla debugowania)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = buffer;
    }
  }, [buffer]);

  // Aktualizuj listę zeskanowanych produktów na podstawie koszyka
  useEffect(() => {
    if (cart && Array.isArray(cart)) {
      const productsFromCart = cart.map((item) => ({
        ...item,
        id: item.barcode, // użyj barcode jako ID dla kompatybilności
        totalPrice: item.price * item.quantity,
      }));
      setScannedProducts(productsFromCart);
    } else {
      setScannedProducts([]);
    }
  }, [cart]);

  return (
    <div className={styles.scannerPage}>
      {/* Input do debugowania (opcjonalnie widoczny) */}
      <input
        ref={inputRef}
        type="text"
        readOnly
        className={styles.hiddenInput}
        value={buffer}
      />

      {/* Status skanowania */}
      <div
        className={`${styles.scanStatus} ${isScanning ? styles.scanning : ""}`}
      >
        {isScanning
          ? "⚡ Skanowanie..."
          : buffer
          ? `📝 Bufor: ${buffer}`
          : "📱 Gotowy do skanowania"}
      </div>

      {/* Ostatnio zeskanowany */}
      {lastScanned && (
        <div className={styles.lastScanned}>
          ✅ Dodano: <strong>{lastScanned}</strong>
        </div>
      )}

      {/* Główna część */}
      <div className={styles.scannerContainer}>
        <div className={styles.scannerHeader}>
          <h1 className={styles.scannerTitle}>
            <Scan
              size={32}
              style={{ verticalAlign: "middle", marginRight: "10px" }}
            />
            Produkty
          </h1>
          {/* <p className={styles.scannerSubtitle}>
            Zeskanuj kod kreskowy produktu
          </p> */}
        </div>

        <div className={styles.scannedProductsList}>
          {scannedProducts.length > 0 ? (
            <>
              <h2>🛒 Zeskanowane produkty ({getTotalItems()})</h2>
              <div className={styles.productsList}>
                {scannedProducts.map((product) => (
                  <div key={product.barcode} className={styles.productItem}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                    />

                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productPrice}>
                        {product.price.toFixed(2)} zł
                        {product.quantity > 1 && (
                          <span style={{ opacity: 0.7, marginLeft: "10px" }}>
                            (razem:{" "}
                            {(product.price * product.quantity).toFixed(2)} zł)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className={styles.productQuantity}>
                      <button
                        onClick={() => console.log("proceed checkout")}
                        className={styles.quantityBtn}
                        disabled={product.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>

                      <span className={styles.quantityValue}>
                        {product.quantity}
                      </span>

                      <button
                        // onClick={() => handleUpdateQuantity(product.barcode, 1)}
                        className={styles.quantityBtn}
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        // onClick={() => handleRemoveProduct(product.barcode)}
                        className={styles.removeBtn}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <h3>🔍 Brak produktów</h3>
              <p>
                Zeskanuj pierwszy kod kreskowy,
                <br />
                aby dodać produkt do listy
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pasek płatności */}
      <div className={styles.paymentBar}>
        <div className={styles.paymentContent}>
          <div className={styles.totalSection}>
            <p className={styles.itemsCount}>
              {getTotalItems()}{" "}
              {getTotalItems() === 1 ? "produkt" : "produktów"}
            </p>
            <p className={styles.totalPrice}>{getTotalPrice().toFixed(2)} zł</p>
          </div>

          <button
            // onClick={handleCheckout}
            className={styles.checkoutBtn}
            disabled={scannedProducts.length === 0}
          >
            💳 Zrealizuj zamówienie
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
