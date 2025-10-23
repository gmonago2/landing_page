import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initAnalytics, attachAutoTracking } from './lib/analytics';

// Initialize analytics using Vite env variables (set these in .env or your host):
// VITE_ANALYTICS_PROVIDER = 'ga4' | 'plausible' | 'none'
// VITE_GA_MEASUREMENT_ID = 'G-XXXX' (for GA4)
// VITE_PLAUSIBLE_DOMAIN = 'example.com' (for Plausible)
const provider = (import.meta.env.VITE_ANALYTICS_PROVIDER as string) || 'none';
const gaId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || '';
const plausibleDomain = (import.meta.env.VITE_PLAUSIBLE_DOMAIN as string) || '';

if (provider === 'ga4' && gaId) {
  initAnalytics({ provider: 'ga4', id: gaId });
} else if (provider === 'plausible' && plausibleDomain) {
  initAnalytics({ provider: 'plausible', domain: plausibleDomain });
} else {
  // initialize with no external provider so devs still see events in console
  initAnalytics({ provider: 'none' });
}

// Wire automatic click tracking for elements with `data-analytics` attributes.
attachAutoTracking();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
