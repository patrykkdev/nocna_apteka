import React, { createContext, useContext, useState, useEffect } from "react";
import {
  subscribeToCart,
  updateCart,
  getCurrentCart,
} from "../services/cartService";
import {
  subscribeToPayment,
  setPaymentStatus,
} from "../services/paymentService";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatusState] = useState({
    show_payment: false,
  });

  // Załaduj początkowy koszyk
  useEffect(() => {
    const loadInitialCart = async () => {
      try {
        const currentCart = await getCurrentCart();
        console.log("Initial cart:", currentCart);
        setCart(currentCart);
      } catch (error) {
        console.error("Błąd ładowania koszyka:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCart();
  }, []);

  // Subskrybuj zmiany koszyka w czasie rzeczywistym
  useEffect(() => {
    if (loading) return;

    const unsubscribe = subscribeToCart((newCart) => {
      setCart(newCart);
    });

    return unsubscribe;
  }, [loading]);

  // Subskrybuj zmiany statusu płatności
  useEffect(() => {
    console.log("🔗 Setting up payment subscription");
    const unsubscribe = subscribeToPayment((newPaymentStatus) => {
      console.log("💳 Payment status update received:", newPaymentStatus);
      setPaymentStatusState(newPaymentStatus);
    });

    return () => {
      console.log("🔗 Cleaning up payment subscription");
      unsubscribe();
    };
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const addToCart = async (product) => {
    console.log("Adding to cart:", product);
    try {
      const existingItem = cart.find(
        (item) => item.barcode === product.barcode
      );
      console.log("Existing item:", existingItem);
      let newCart;

      if (existingItem) {
        newCart = cart.map((item) =>
          item.barcode === product.barcode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...cart, { ...product, quantity: 1 }];
      }
      console.log("New cart:", newCart);

      await updateCart(newCart);
      showNotification(`Dodano: ${product.name}`);
    } catch (error) {
      console.error("Błąd dodawania do koszyka:", error);
      showNotification("Błąd dodawania produktu");
    }
  };

  const updateQuantity = async (barcode, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(barcode);
        return;
      }

      const newCart = cart.map((item) =>
        item.barcode === barcode ? { ...item, quantity: newQuantity } : item
      );

      await updateCart(newCart);
    } catch (error) {
      console.error("Błąd aktualizacji ilości:", error);
      showNotification("Błąd aktualizacji produktu");
    }
  };

  const removeFromCart = async (barcode) => {
    try {
      const newCart = cart.filter((item) => item.barcode !== barcode);
      await updateCart(newCart);
      showNotification("Usunięto produkt z koszyka");
    } catch (error) {
      console.error("Błąd usuwania z koszyka:", error);
      showNotification("Błąd usuwania produktu");
    }
  };

  const clearCart = async (showNotificationMsg = true) => {
    try {
      await updateCart([]);
      if (showNotificationMsg) {
        showNotification("Koszyk został wyczyszczony");
      }
    } catch (error) {
      console.error("Błąd czyszczenia koszyka:", error);
      if (showNotificationMsg) {
        showNotification("Błąd czyszczenia koszyka");
      }
    }
  };

  const finalizeOrder = async () => {
    try {
      if (cart.length === 0) {
        showNotification("Koszyk jest pusty");
        return;
      }

      console.log("🛒 Finalizing order - setting payment status to true");
      // Ustaw status płatności na true
      await setPaymentStatus(true);
      showNotification("Płatność została zainicjowana!");
    } catch (error) {
      console.error("❌ Błąd finalizacji zamówienia:", error);
      showNotification("Błąd finalizacji zamówienia");
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    notification,
    loading,
    paymentStatus,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    finalizeOrder,
    getTotalPrice,
    getTotalItems,
    showNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
