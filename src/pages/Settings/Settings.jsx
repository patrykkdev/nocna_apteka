import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Database,
  Wifi,
} from "lucide-react";
import styles from "./Settings.module.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    autoFocus: true,
    soundEnabled: true,
    vibrationEnabled: true,
    scanDelay: 500,
    cartSync: true,
    theme: "dark",
    language: "pl",
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("pharmacy-settings", JSON.stringify(settings));
    alert("Ustawienia zostały zapisane!");
  };

  const handleReset = () => {
    const defaultSettings = {
      autoFocus: true,
      soundEnabled: true,
      vibrationEnabled: true,
      scanDelay: 500,
      cartSync: true,
      theme: "dark",
      language: "pl",
    };
    setSettings(defaultSettings);
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <SettingsIcon size={32} color="#00d4ff" />
          <div>
            <h1 className={styles.pageTitle}>Ustawienia</h1>
            <p className={styles.pageSubtitle}>
              Konfiguracja aplikacji i urządzeń
            </p>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={handleReset} className={styles.resetBtn}>
            <RefreshCw size={16} />
            Resetuj
          </button>
          <button onClick={handleSave} className={styles.saveBtn}>
            <Save size={16} />
            Zapisz
          </button>
        </div>
      </div>

      <div className={styles.settingsGrid}>
        {/* Ustawienia skanera */}
        <div className={styles.settingsCard}>
          <h2>Skaner</h2>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h4>Automatyczne focus</h4>
              <p>Utrzymuj pole skanowania zawsze aktywne</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.autoFocus}
                onChange={(e) =>
                  handleSettingChange("autoFocus", e.target.checked)
                }
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h4>Opóźnienie skanowania</h4>
              <p>Czas w milisekundach przed przetworzeniem kodu</p>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={settings.scanDelay}
              onChange={(e) =>
                handleSettingChange("scanDelay", parseInt(e.target.value))
              }
              className={styles.rangeSlider}
            />
            <span className={styles.rangeValue}>{settings.scanDelay}ms</span>
          </div>
        </div>

        {/* Ustawienia dźwięku */}
        <div className={styles.settingsCard}>
          <h2>Powiadomienia</h2>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h4>Dźwięki</h4>
              <p>Odtwarzaj dźwięki przy dodawaniu produktów</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) =>
                  handleSettingChange("soundEnabled", e.target.checked)
                }
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h4>Wibracje</h4>
              <p>Wibruj urządzenie przy skanowaniu (mobile)</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.vibrationEnabled}
                onChange={(e) =>
                  handleSettingChange("vibrationEnabled", e.target.checked)
                }
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* Ustawienia synchronizacji */}
        <div className={styles.settingsCard}>
          <h2>Synchronizacja</h2>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h4>Synchronizacja koszyka</h4>
              <p>Synchronizuj koszyk między urządzeniami</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.cartSync}
                onChange={(e) =>
                  handleSettingChange("cartSync", e.target.checked)
                }
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.connectionStatus}>
            <Wifi size={20} color="#00ff88" />
            <div>
              <h4>Status połączenia</h4>
              <p className={styles.connectionOk}>Połączono z bazą danych</p>
            </div>
          </div>

          <div className={styles.syncActions}>
            <button className={styles.syncBtn}>
              <Database size={16} />
              Wymuś synchronizację
            </button>
          </div>
        </div>

        {/* Ustawienia interfejsu */}
        <div className={styles.settingsCard}>
          <h2>Interfejs</h2>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h4>Motyw</h4>
              <p>Wybierz wygląd aplikacji</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange("theme", e.target.value)}
              className={styles.selectInput}
            >
              <option value="dark">Ciemny</option>
              <option value="light">Jasny</option>
              <option value="auto">Automatyczny</option>
            </select>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h4>Język</h4>
              <p>Wybierz język interfejsu</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              className={styles.selectInput}
            >
              <option value="pl">Polski</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Informacje o systemie */}
        <div className={styles.settingsCard}>
          <h2>Informacje o systemie</h2>

          <div className={styles.systemInfo}>
            <div className={styles.infoItem}>
              <span>Wersja aplikacji:</span>
              <span>1.0.0</span>
            </div>
            <div className={styles.infoItem}>
              <span>Ostatnia aktualizacja:</span>
              <span>2024-01-15</span>
            </div>
            <div className={styles.infoItem}>
              <span>Baza danych:</span>
              <span>Firebase v9.17.2</span>
            </div>
            <div className={styles.infoItem}>
              <span>Urządzenie:</span>
              <span>Desktop</span>
            </div>
          </div>
        </div>

        {/* Zarządzanie danymi */}
        <div className={styles.settingsCard}>
          <h2>Zarządzanie danymi</h2>

          <div className={styles.dataActions}>
            <button className={styles.exportBtn}>Eksportuj dane</button>
            <button className={styles.importBtn}>Importuj dane</button>
            <button className={styles.clearBtn}>Wyczyść wszystkie dane</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
