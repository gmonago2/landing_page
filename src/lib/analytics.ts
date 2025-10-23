// Lightweight analytics wrapper with provider adapters (GA4, Plausible) and
// automatic button instrumentation via `data-analytics` attributes.
//
// Usage:
//  initAnalytics({ provider: 'ga4', id: 'G-XXXX' })
//  or
//  initAnalytics({ provider: 'plausible', domain: 'example.com' })
//
// Buttons/elements can opt-in with:
//  <button data-analytics="signup_click" data-analytics-props='{"plan":"pro"}'>Sign up</button>

type Provider = 'ga4' | 'plausible' | 'none';

interface InitOptions {
  provider?: Provider;
  // For GA4 use `id` (G-XXXX). For Plausible use `domain`.
  id?: string;
  domain?: string;
}

let currentProvider: Provider = 'none';
let gaMeasurementId = '';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    plausible?: (name: string, opts?: any) => void;
  }
}

function ensureVisitorId(): string {
  try {
    const key = 'lp_visitor_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = cryptoRandomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch (err) {
    return 'unknown';
  }
}

function cryptoRandomUUID(): string {
  // Prefer crypto.randomUUID if available, fallback to simple random
  if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
    try {
      return (crypto as any).randomUUID();
    } catch {}
  }
  // simple fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function initAnalytics(opts: InitOptions = {}) {
  currentProvider = opts.provider ?? 'none';
  gaMeasurementId = opts.id ?? '';

  // Attach provider-specific script if requested and available
  if (typeof document === 'undefined') return;

  if (currentProvider === 'ga4' && gaMeasurementId) {
    // Load gtag.js
    const src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement('script');
      s.async = true;
      s.src = src;
      document.head.appendChild(s);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){ (window.dataLayer as any).push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', gaMeasurementId, { send_page_view: true });
  }

  if (currentProvider === 'plausible' && opts.domain) {
    const src = 'https://plausible.io/js/plausible.js';
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement('script');
      s.defer = true;
      s.setAttribute('data-domain', opts.domain);
      s.src = src;
      document.head.appendChild(s);
    }
  }

  // Track a lightweight visitor init event locally/provider when possible
  const visitorId = ensureVisitorId();
  trackEvent('visitor_init', { visitorId, ts: Date.now() });
}

export function trackEvent(name: string, props?: Record<string, any>) {
  try {
    if (currentProvider === 'ga4' && typeof window.gtag === 'function') {
      window.gtag('event', name, props ?? {});
      // also emit a DOM event for in-page debug tools
      try { window.dispatchEvent(new CustomEvent('analytics:event', { detail: { name, props: props ?? {} } })); } catch {}
      return;
    }

    if (currentProvider === 'plausible' && typeof window.plausible === 'function') {
      // Plausible supports custom events via plausible('event-name', { props })
      window.plausible!(name, { props: props ?? {} });
      try { window.dispatchEvent(new CustomEvent('analytics:event', { detail: { name, props: props ?? {} } })); } catch {}
      return;
    }

    // Fallback: log to console so developers can see events during dev
    // eslint-disable-next-line no-console
    console.info('[analytics]', name, props ?? {});
    try { window.dispatchEvent(new CustomEvent('analytics:event', { detail: { name, props: props ?? {} } })); } catch {}
  } catch (err) {
    // swallow errors to avoid breaking app
    // eslint-disable-next-line no-console
    console.warn('[analytics] failed to send event', err);
  }
}

/**
 * Attach click listeners to any element with a `data-analytics` attribute.
 * Example: <button data-analytics="signup_click" data-analytics-props='{"plan":"pro"}'>
 */
export function attachAutoTracking() {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement | null;
    if (!target) return;
    const el = (target.closest ? target.closest('[data-analytics]') : null) as HTMLElement | null;
    if (!el) return;

    const eventName = el.getAttribute('data-analytics') || 'click';
    const propsAttr = el.getAttribute('data-analytics-props');
    let props: Record<string, any> = {};
    if (propsAttr) {
      try {
        props = JSON.parse(propsAttr);
      } catch {
        props = { propsRaw: propsAttr };
      }
    }
    // add a small context to the event
    props = { ...props, tagName: el.tagName.toLowerCase(), text: el.textContent?.trim()?.slice(0, 120) };
    trackEvent(eventName, props);
  });
}

export default {
  initAnalytics,
  trackEvent,
  attachAutoTracking,
};
