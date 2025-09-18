import { doc, onSnapshot, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const CART_DOC_ID = "shared-cart";

// Subskrybuj zmiany koszyka
export const subscribeToCart = (callback) => {
  const cartRef = doc(db, "cart", CART_DOC_ID);

  return onSnapshot(
    cartRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data.items || []);
      } else {
        // Jeśli dokument nie istnieje, stwórz pusty koszyk
        setDoc(cartRef, { items: [] });
        callback([]);
      }
    },
    (error) => {
      console.error("Błąd subskrypcji koszyka:", error);
      callback([]);
    }
  );
};

// Aktualizuj koszyk w Firebase
export const updateCart = async (cartItems) => {
  console.log("Updating cart:", cartItems);
  try {
    const cartRef = doc(db, "cart", CART_DOC_ID);
    await updateDoc(cartRef, {
      items: cartItems,
      lastUpdated: new Date(),
    });
  } catch (error) {
    // Jeśli dokument nie istnieje, stwórz go
    if (error.code === "not-found") {
      const cartRef = doc(db, "cart", CART_DOC_ID);
      await setDoc(cartRef, {
        items: cartItems,
        lastUpdated: new Date(),
      });
    } else {
      console.error("Błąd aktualizacji koszyka:", error);
      throw error;
    }
  }
};

// Pobierz aktualny koszyk
export const getCurrentCart = async () => {
  try {
    const cartRef = doc(db, "cart", CART_DOC_ID);
    const docSnap = await getDoc(cartRef);

    if (docSnap.exists()) {
      return docSnap.data().items || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Błąd pobierania koszyka:", error);
    return [];
  }
};
