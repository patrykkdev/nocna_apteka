import React from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import styles from "./Cart.module.css";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <div className={styles.cartTitle}>
          <ShoppingCart size={24} color="#00ff88" />
          <h2>Koszyk</h2>
        </div>
        <div className={styles.itemCount}>{getTotalItems()} szt.</div>
      </div>

      <div className={styles.cartItems}>
        {cart.length === 0 ? (
          <div className={styles.emptyCart}>
            <ShoppingCart size={48} />
            <p>Koszyk jest pusty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.barcode} className={styles.cartItem}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.itemDetails}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <p className={styles.itemPrice}>{item.price.toFixed(2)} zł</p>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() =>
                      updateQuantity(item.barcode, item.quantity - 1)
                    }
                    className={`${styles.quantityBtn} ${styles.decreaseBtn}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.barcode, item.quantity + 1)
                    }
                    className={`${styles.quantityBtn} ${styles.increaseBtn}`}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.barcode)}
                    className={`${styles.quantityBtn} ${styles.removeBtn}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className={styles.itemTotal}>
                {(item.price * item.quantity).toFixed(2)} zł
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className={styles.cartFooter}>
          <div className={styles.totalPrice}>
            <span>Razem:</span>
            <span className={styles.totalAmount}>
              {getTotalPrice().toFixed(2)} zł
            </span>
          </div>
          <button onClick={clearCart} className={styles.clearButton}>
            Wyczyść koszyk
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
