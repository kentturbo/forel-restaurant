// lib/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ruCommon from '../public/locales/ru/common.json';
import enCommon from '../public/locales/en/common.json';

const resources = {
  ru: {
    common: ruCommon,
  },
  en: {
    common: enCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;