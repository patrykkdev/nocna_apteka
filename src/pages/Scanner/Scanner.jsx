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

  const { addToCart, showNotification, cartItems } = useCart();

  // Global keydown handler dla skanera HID
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter") {
        if (buffer.trim().length > 0) {
          performScan(buffer.trim());
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

  // Aktualizuj wartość w input (dla debugowania)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = buffer;
    }
  }, [buffer]);

  // Aktualizuj listę zeskanowanych produktów na podstawie koszyka
  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const productsFromCart = cartItems.map((item) => ({
        ...item,
        id: item.id,
        totalPrice: item.price * item.quantity,
      }));
      setScannedProducts(productsFromCart);
    } else {
      setScannedProducts([]);
    }
  }, [cartItems]);

  const performScan = async (barcode) => {
    const now = Date.now();
    if (now - lastScanTimeRef.current < 1000) {
      return;
    }
    lastScanTimeRef.current = now;

    setIsScanning(true);

    try {
      const product = await getProductByBarcode(barcode.trim());

      if (product) {
        await addToCart(product);
        setLastScanned(product.name);

        // Efekt wibracji na urządzeniach mobilnych
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }

        // Efekt dźwiękowy
        playBeepSound();

        // Ukryj komunikat po 3 sekundach
        setTimeout(() => setLastScanned(""), 3000);
      } else {
        showNotification(`Nie znaleziono produktu: ${barcode}`);
      }
    } catch (error) {
      console.error("Błąd skanowania:", error);
      showNotification("Błąd podczas skanowania");
    } finally {
      setScanInput("");
      setIsScanning(false);
    }
  };

  const playBeepSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Ignore audio errors
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setScanInput(value);

    if (!autoScanEnabled) return;

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    if (value.length >= minBarcodeLength) {
      scanTimeoutRef.current = setTimeout(() => {
        performScan(value);
      }, scanDelay);
    }
  };

  const updateQuantity = (productId, change) => {
    const product = scannedProducts.find((p) => p.id === productId);
    if (!product) return;

    if (change > 0) {
      addToCart(product);
    } else {
      // Tutaj powinna być funkcja removeFromCart, ale używamy workaround
      // Możesz dodać tę funkcję do CartContext jeśli jej nie ma
      const updatedProducts = scannedProducts
        .map((p) =>
          p.id === productId
            ? { ...p, quantity: Math.max(0, p.quantity - 1) }
            : p
        )
        .filter((p) => p.quantity > 0);

      setScannedProducts(updatedProducts);
    }
  };

  const removeProduct = (productId) => {
    setScannedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const getTotalPrice = () => {
    return scannedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return scannedProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );
  };

  const handleCheckout = () => {
    if (scannedProducts.length === 0) return;

    showNotification(
      `Zamówienie na kwotę ${getTotalPrice().toFixed(2)} zł zostało złożone!`
    );
    // Tutaj dodaj logikę realizacji zamówienia
    console.log("Realizacja zamówienia:", scannedProducts);
  };

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
            Skaner Produktów
          </h1>
          <p className={styles.scannerSubtitle}>
            Zeskanuj kod kreskowy produktu
          </p>
        </div>

        <div className={styles.scannedProductsList}>
          {scannedProducts.length > 0 ? (
            <>
              <h2>🛒 Zeskanowane produkty ({getTotalItems()})</h2>
              <div className={styles.productsList}>
                {scannedProducts.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/60x60?text=?";
                      }}
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
                        onClick={() => updateQuantity(product.id, -1)}
                        className={styles.quantityBtn}
                        disabled={product.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>

                      <span className={styles.quantityValue}>
                        {product.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className={styles.quantityBtn}
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() => removeProduct(product.id)}
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
            onClick={handleCheckout}
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
