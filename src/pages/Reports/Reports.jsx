import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import styles from "./Reports.module.css";

const Reports = () => {
  const { cart, getTotalPrice, getTotalItems } = useCart();
  const [dateRange, setDateRange] = useState("today");

  // Mock data dla raportów
  const salesData = [
    { date: "2024-01-01", amount: 1250.5, items: 45 },
    { date: "2024-01-02", amount: 980.3, items: 32 },
    { date: "2024-01-03", amount: 1450.8, items: 52 },
    { date: "2024-01-04", amount: 1120.2, items: 38 },
    { date: "2024-01-05", amount: 1680.9, items: 61 },
  ];

  const topProducts = [
    { name: "Aspirin 500mg", sold: 145, revenue: 1812.5 },
    { name: "Vitamin C 1000mg", sold: 89, revenue: 2224.11 },
    { name: "Paracetamol 500mg", sold: 156, revenue: 1365.0 },
  ];

  const todayStats = {
    sales: getTotalPrice(),
    items: getTotalItems(),
    transactions: cart.length > 0 ? 1 : 0,
    avgTransaction: cart.length > 0 ? getTotalPrice() : 0,
  };

  return (
    <div className={styles.reportsPage}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <BarChart3 size={32} color="#00d4ff" />
          <div>
            <h1 className={styles.pageTitle}>Raporty i Analityka</h1>
            <p className={styles.pageSubtitle}>
              Przegląd sprzedaży i statystyk apteki
            </p>
          </div>
        </div>

        <div className={styles.dateSelector}>
          <Calendar size={20} />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={styles.dateSelect}
          >
            <option value="today">Dzisiaj</option>
            <option value="week">Ten tydzień</option>
            <option value="month">Ten miesiąc</option>
            <option value="year">Ten rok</option>
          </select>
        </div>
      </div>

      {/* Statystyki */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <DollarSign size={24} color="#00ff88" />
          </div>
          <div className={styles.statInfo}>
            <h3>Sprzedaż</h3>
            <p className={styles.statValue}>{todayStats.sales.toFixed(2)} zł</p>
            <span className={styles.statChange}>+12.5%</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Package size={24} color="#00d4ff" />
          </div>
          <div className={styles.statInfo}>
            <h3>Produkty</h3>
            <p className={styles.statValue}>{todayStats.items}</p>
            <span className={styles.statChange}>+8.3%</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} color="#ff6b6b" />
          </div>
          <div className={styles.statInfo}>
            <h3>Transakcje</h3>
            <p className={styles.statValue}>{todayStats.transactions}</p>
            <span className={styles.statChange}>+15.2%</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BarChart3 size={24} color="#ffa726" />
          </div>
          <div className={styles.statInfo}>
            <h3>Średnia transakcja</h3>
            <p className={styles.statValue}>
              {todayStats.avgTransaction.toFixed(2)} zł
            </p>
            <span className={styles.statChange}>+5.7%</span>
          </div>
        </div>
      </div>

      {/* Wykresy i tabele */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2>Sprzedaż w czasie</h2>
          <div className={styles.chartPlaceholder}>
            <BarChart3 size={64} />
            <p>Wykres sprzedaży (wymaga biblioteki do wykresów)</p>
          </div>
        </div>

        <div className={styles.topProductsCard}>
          <h2>Najlepiej sprzedające się produkty</h2>
          <div className={styles.productsList}>
            {topProducts.map((product, index) => (
              <div key={index} className={styles.productItem}>
                <div className={styles.productRank}>#{index + 1}</div>
                <div className={styles.productDetails}>
                  <h4>{product.name}</h4>
                  <p>
                    {product.sold} szt. • {product.revenue.toFixed(2)} zł
                  </p>
                </div>
                <div className={styles.productProgress}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${(product.sold / 200) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historia sprzedaży */}
      <div className={styles.salesHistory}>
        <h2>Historia sprzedaży</h2>
        <div className={styles.salesTable}>
          <div className={styles.tableHeader}>
            <span>Data</span>
            <span>Kwota</span>
            <span>Produkty</span>
            <span>Trend</span>
          </div>
          {salesData.map((sale, index) => (
            <div key={index} className={styles.tableRow}>
              <span>{sale.date}</span>
              <span>{sale.amount.toFixed(2)} zł</span>
              <span>{sale.items} szt.</span>
              <span className={styles.trendUp}>↗ +5.2%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
