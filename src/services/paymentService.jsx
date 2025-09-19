// src/services/paymentService.js
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const PAYMENT_DOC_ID = "payment-doc";

// Subskrybuj zmiany statusu płatności
export const subscribeToPayment = (callback) => {
  const paymentRef = doc(db, "payment", PAYMENT_DOC_ID);

  return onSnapshot(
    paymentRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data);
      } else {
        // Jeśli dokument nie istnieje, stwórz domyślny
        setDoc(paymentRef, { show_payment: false });
        callback({ show_payment: false });
      }
    },
    (error) => {
      console.error("Błąd subskrypcji płatności:", error);
      callback({ show_payment: false });
    }
  );
};

// Ustaw status płatności
export const setPaymentStatus = async (showPayment) => {
  console.log("Setting payment status to:", showPayment);
  try {
    const paymentRef = doc(db, "payment", PAYMENT_DOC_ID);
    await updateDoc(paymentRef, {
      show_payment: showPayment,
      lastUpdated: new Date(),
    });
    console.log("Payment status updated successfully");
  } catch (error) {
    // Jeśli dokument nie istnieje, stwórz go
    if (error.code === "not-found") {
      console.log("Creating new payment document");
      const paymentRef = doc(db, "payment", PAYMENT_DOC_ID);
      await setDoc(paymentRef, {
        show_payment: showPayment,
        lastUpdated: new Date(),
      });
      console.log("Payment document created successfully");
    } else {
      console.error("Błąd aktualizacji statusu płatności:", error);
      throw error;
    }
  }
};

// Pobierz aktualny status płatności
export const getPaymentStatus = async () => {
  try {
    const paymentRef = doc(db, "payment", PAYMENT_DOC_ID);
    const docSnap = await getDoc(paymentRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return { show_payment: false };
    }
  } catch (error) {
    console.error("Błąd pobierania statusu płatności:", error);
    return { show_payment: false };
  }
};
