import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/common.json';
import de from './locales/de/common.json';

const resources = {
  en: { common: en },
  de: { common: de },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en', 
      fallbackLng: 'en',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: { escapeValue: false },
    });
}

export default i18n; 