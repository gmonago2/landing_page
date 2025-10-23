# landing_page — Local testing & analytics

This README explains how to run the project locally and verify the dev-only analytics features added in the `src/lib/analytics.ts` and the dev-only `AnalyticsPanel`.

## Prerequisites

- Node.js (recommended: LTS). Use `nvm` or Homebrew on macOS.

Using nvm (recommended):

```bash
# install nvm if you don't have it
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
# open a new shell or source your profile, then:
nvm install --lts
nvm use --lts
```

Or Homebrew:

```bash
brew install node
```

Verify:

```bash
node -v
npm -v
```

## Install and run

From the project root (`/Users/gracemonago/landing_page`):

```bash
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open that in your browser.

## Enable analytics in dev

This app initializes analytics from Vite env variables. Create a local `.env` file in the project root (do NOT commit it).

Examples:

GA4 (Google Analytics 4):

```
VITE_ANALYTICS_PROVIDER=ga4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXX
```

Plausible:

```
VITE_ANALYTICS_PROVIDER=plausible
VITE_PLAUSIBLE_DOMAIN=your-domain.com
```

Dev-only (console + debug panel):

```
VITE_ANALYTICS_PROVIDER=none
```

Note: Vite reads `.env` at startup — restart `npm run dev` after changing the file.

## Debugging & verifying analytics

- The app emits a DOM CustomEvent `analytics:event` for every tracked event (also sent to GA4/Plausible when configured).
- A dev-only floating panel (bottom-right) shows recent analytics events when running Vite dev. It appears only when `import.meta.env.DEV` is true.

Quick checks:

1. Open DevTools Console and add:

```js
window.addEventListener('analytics:event', e => console.log('analytics:event', e.detail));
```

2. Click a page element instrumented with `data-analytics` or call `trackEvent` from the console:

```js
// example
trackEvent('test_click', { foo: 'bar' })
```

3. For GA4/Plausible, inspect Network tab to see requests to `www.googletagmanager.com` or `plausible.io` respectively.

## Instrumenting buttons/components

Elements can opt-in to automatic tracking using attributes:

```html
<button data-analytics="signup_click" data-analytics-props='{"plan":"pro"}'>Sign up</button>
```

Also from React code you can import `trackEvent`:

```ts
import { trackEvent } from './lib/analytics';
trackEvent('newsletter_submitted', { email: 'redacted' });
```

## Notes & next steps

- The analytics wrapper stores a local visitor id in `localStorage` under `lp_visitor_id` and emits a `visitor_init` event on startup.
- For authoritative unique-visitor counts across devices, you need a backend to receive events and deduplicate by login or persistent id.
- If you want me to run the dev server and verify events from here, install Node/npm on this machine (so `npm` is available) and tell me to continue.
landing_page
