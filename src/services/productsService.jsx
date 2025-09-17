import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Pobierz produkt po kodzie kreskowym
export const getProductByBarcode = async (barcode) => {
  try {
    const q = query(
      collection(db, "products"),
      where("barcode", "==", barcode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      return { id: docSnapshot.id, ...docSnapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Błąd pobierania produktu:", error);
    return null;
  }
};

// Pobierz wszystkie produkty
export const getAllProducts = async () => {
  try {
    const q = query(collection(db, "products"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Błąd pobierania produktów:", error);
    return [];
  }
};

// Wyszukaj produkty
export const searchProducts = async (searchTerm) => {
  try {
    const products = await getAllProducts();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Błąd wyszukiwania produktów:", error);
    return [];
  }
};

// Dodaj nowy produkt
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Błąd dodawania produktu:", error);
    throw error;
  }
};

// Aktualizuj produkt
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Błąd aktualizacji produktu:", error);
    throw error;
  }
};

// Usuń produkt
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (error) {
    console.error("Błąd usuwania produktu:", error);
    throw error;
  }
};

// Funkcja do inicjalizacji przykładowych produktów
export const initializeProducts = async () => {
  try {
    const existingProducts = await getAllProducts();
    if (existingProducts.length > 0) {
      console.log("Produkty już istnieją w bazie");
      return;
    }

    const sampleProducts = [
      {
        name: "Aspirin 500mg",
        price: 12.5,
        barcode: "1234567890123",
        image:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
        description:
          "Lek przeciwbólowy i przeciwgorączkowy. Zawiera kwas acetylosalicylowy.",
        category: "Leki przeciwbólowe",
        stock: 150,
        expiry: "2025-12-31",
      },
      {
        name: "Vitamin C 1000mg",
        price: 24.99,
        barcode: "4752224002761",
        image:
          "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=200&h=200&fit=crop",
        description:
          "Suplement diety z witaminą C wspierający układ odpornościowy.",
        category: "Suplementy",
        stock: 89,
        expiry: "2025-06-30",
      },
      {
        name: "Vitamin C 1000mg",
        price: 24.99,
        barcode: "4752224002761",
        image:
          "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=200&h=200&fit=crop",
        description:
          "Suplement diety z witaminą C wspierający układ odpornościowy.",
        category: "Suplementy",
        stock: 89,
        expiry: "2025-06-30",
      },
      {
        name: "Paracetamol 500mg",
        price: 8.75,
        barcode: "4752224002761",
        image:
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
        description:
          "Lek przeciwbólowy i przeciwgorączkowy na bazie paracetamolu.",
        category: "Leki przeciwbólowe",
        stock: 200,
        expiry: "2025-11-15",
      },
      {
        name: "Ibuprofen 400mg",
        price: 15.3,
        barcode: "4567890123456",
        image:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
        description: "Lek przeciwzapalny, przeciwbólowy i przeciwgorączkowy.",
        category: "Leki przeciwbólowe",
        stock: 120,
        expiry: "2025-09-20",
      },
      {
        name: "Syrop na kaszel",
        price: 18.6,
        barcode: "5678901234567",
        image:
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
        description: "Syrop łagodzący kaszel suchy i mokry.",
        category: "Leki na przeziębienie",
        stock: 65,
        expiry: "2025-08-10",
      },
    ];

    console.log("Dodawanie przykładowych produktów...");
    for (const product of sampleProducts) {
      await addProduct(product);
    }
    console.log("Przykładowe produkty zostały dodane!");
  } catch (error) {
    console.error("Błąd inicjalizacji produktów:", error);
  }
};
