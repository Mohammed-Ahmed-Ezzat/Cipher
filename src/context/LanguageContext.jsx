import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { sfx } from '../utils/soundEffects';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('cipher_lang');
      return saved === 'ar' ? 'ar' : 'en';
    } catch {
      return 'en';
    }
  });

  const isRTL = language === 'ar';
  const currentTranslations = translations[language] || translations.en;

  useEffect(() => {
    try {
      localStorage.setItem('cipher_lang', language);
    } catch {}

    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    if (isRTL) {
      root.classList.add('lang-ar');
      root.classList.remove('lang-en');
    } else {
      root.classList.add('lang-en');
      root.classList.remove('lang-ar');
    }
  }, [language, isRTL]);

  const setLanguage = (lang) => {
    if (lang === language) return;
    sfx.playClick();
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    sfx.playActivate();
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (section, key, fallback = '') => {
    if (currentTranslations[section] && currentTranslations[section][key] !== undefined) {
      return currentTranslations[section][key];
    }
    if (translations.en[section] && translations.en[section][key] !== undefined) {
      return translations.en[section][key];
    }
    return fallback;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
        translations: currentTranslations
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
