import React, { useState } from "react";
import { Package, Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  getAllProducts,
  searchProducts,
  deleteProduct,
  initializeProducts,
} from "../../services/productsService.jsx";
import { useCart } from "../../contexts/CartContext.jsx";
import styles from "./Products.module.css";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart, showNotification } = useCart();

  // Załaduj produkty
  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Błąd ładowania produktów:", error);
      showNotification("Błąd ładowania produktów");
    } finally {
      setLoading(false);
    }
  };

  // Odśwież produkty
  const refreshProducts = async () => {
    try {
      setRefreshing(true);
      await loadProducts();
      showNotification("Produkty zostały odświeżone");
    } catch (error) {
      showNotification("Błąd odświeżania produktów");
    } finally {
      setRefreshing(false);
    }
  };

  // Inicjalizuj przykładowe produkty
  const handleInitializeProducts = async () => {
    try {
      setLoading(true);
      await initializeProducts();
      await loadProducts();
      showNotification("Przykładowe produkty zostały dodane");
    } catch (error) {
      showNotification("Błąd dodawania przykładowych produktów");
    }
  };

  // Usuń produkt
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
      try {
        await deleteProduct(productId);
        await loadProducts();
        showNotification("Produkt został usunięty");
      } catch (error) {
        console.error("Błąd usuwania produktu:", error);
        showNotification("Błąd usuwania produktu");
      }
    }
  };

  // Wyszukiwanie produktów
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.includes(searchTerm) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Załaduj produkty przy montowaniu komponentu
  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <RefreshCw size={48} className={styles.loadingSpinner} />
        <p>Ładowanie produktów...</p>
      </div>
    );
  }

  return (
    <div className={styles.productsPage}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Package size={32} color="#00d4ff" />
          <div>
            <h1 className={styles.pageTitle}>Zarządzanie Produktami</h1>
            <p className={styles.pageSubtitle}>
              Przeglądaj i zarządzaj produktami w aptece ({products.length}{" "}
              produktów)
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={refreshProducts}
            className={styles.refreshBtn}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? styles.spinning : ""}
            />
            Odśwież
          </button>
          <button onClick={handleInitializeProducts} className={styles.initBtn}>
            <Plus size={16} />
            Dodaj przykładowe
          </button>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Szukaj produktów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className={styles.noResults}>
          <Package size={64} />
          <h3>
            {products.length === 0
              ? "Brak produktów w bazie"
              : "Nie znaleziono produktów"}
          </h3>
          <p>
            {products.length === 0
              ? "Dodaj przykładowe produkty aby rozpocząć"
              : "Spróbuj zmienić kryteria wyszukiwania"}
          </p>
          {products.length === 0 && (
            <button
              onClick={handleInitializeProducts}
              className={styles.addSampleBtn}
            >
              Dodaj przykładowe produkty
            </button>
          )}
        </div>
      )}

      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.productImage}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/200x200?text=Brak+zdjęcia";
              }}
            />
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              <div className={styles.productDetails}>
                <span className={styles.productPrice}>
                  {product.price.toFixed(2)} zł
                </span>
                <span className={styles.productBarcode}>
                  #{product.barcode}
                </span>
              </div>
              <div className={styles.productMeta}>
                <span className={styles.productCategory}>
                  {product.category}
                </span>
                <span className={styles.productStock}>
                  Stan: {product.stock}
                </span>
              </div>
            </div>
            <div className={styles.productActions}>
              <button
                onClick={() => addToCart(product)}
                className={styles.addToCartBtn}
              >
                Dodaj do koszyka
              </button>
              <div className={styles.actionButtons}>
                <button className={styles.editBtn}>
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className={styles.deleteBtn}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
