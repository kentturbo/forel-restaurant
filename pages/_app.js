// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import i18n from '../lib/i18n';
import { CartProvider } from '../contexts/CartContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Update i18n language when route changes
    if (router.locale) {
      i18n.changeLanguage(router.locale);
    }
  }, [router.locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <CartProvider>
        <Component {...pageProps} />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#d49628',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </CartProvider>
    </I18nextProvider>
  );
}

export default MyApp;