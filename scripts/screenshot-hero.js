import { chromium } from 'playwright';

(async () => {
  const url = process.argv[2] || 'http://localhost:5173/';
  const out = process.argv[3] || 'hero-screenshot.png';

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for hero section to be present
  await page.waitForSelector('section.relative.pt-32, section');

  // Try to locate the main hero section and screenshot just that element if found
  const hero = await page.$('section.relative.pt-32') || await page.$('section');
  if (hero) {
    await hero.screenshot({ path: out });
    console.log('Saved hero screenshot to', out);
  } else {
    await page.screenshot({ path: out, fullPage: true });
    console.log('Hero selector not found; saved full page to', out);
  }

  await browser.close();
})();
