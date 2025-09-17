import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKI__X7sBthnvJwrim0pNkvN9DHfgumco",
  authDomain: "night-pharmacy-510d0.firebaseapp.com",
  databaseURL:
    "https://night-pharmacy-510d0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "night-pharmacy-510d0",
  storageBucket: "night-pharmacy-510d0.firebasestorage.app",
  messagingSenderId: "584434520988",
  appId: "1:584434520988:web:7ea5dcdd2ab4a32ed12e59",
  measurementId: "G-T6WTDN654N",
};

// Sprawdź czy konfiguracja jest poprawna
console.log("🔥 Firebase Config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
});

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja Firestore
export const db = getFirestore(app);

// Test połączenia
console.log("🔗 Firebase initialized:", !!app);
console.log("📊 Firestore initialized:", !!db);

export default app;
