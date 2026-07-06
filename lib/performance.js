// lib/performance.js
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Image optimization hook
export const useImageLazyLoad = (src, placeholder = '/images/placeholder.jpg') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();

  const onLoad = useCallback(() => {
    setImageSrc(src);
  }, [src]);

  useEffect(() => {
    let observer;
    
    if (imageRef && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = src;
              img.onload = onLoad;
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src, onLoad]);

  return [setImageRef, imageSrc];
};

// Dynamic imports for admin pages
export const DynamicAdminMenu = dynamic(() => import('../pages/admin/menu'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export const DynamicAdminOrders = dynamic(() => import('../pages/admin/orders'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

// Debounce hook for search/filter operations
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Service worker registration for PWA
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        registration => {
          console.log('SW registered: ', registration);
        },
        err => {
          console.log('SW registration failed: ', err);
        }
      );
    });
  }
};

// Cache API responses
export const cacheAPI = {
  get: async (key) => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = sessionStorage.getItem(`api_cache_${key}`);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const maxAge = 5 * 60 * 1000; // 5 minutes
      
      if (Date.now() - timestamp > maxAge) {
        sessionStorage.removeItem(`api_cache_${key}`);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  },
  
  set: (key, data) => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(
        `api_cache_${key}`,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch {
      // Handle storage quota exceeded
    }
  }
};