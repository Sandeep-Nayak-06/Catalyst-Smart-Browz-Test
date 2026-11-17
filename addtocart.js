const puppeteer = require('puppeteer-core');

const ENDPOINT = process.env.SMARTBROWZ_ENDPOINT;   // CDP endpoint (wss://...)
const PRODUCT_URL = 'https://casiostore.bhawar.com/products/gac-2500-3adr';
const ADD_TO_CART_SELECTOR = 'button[data-main-add-to-cart-btn]';
const CART_URL = 'https://casiostore.bhawar.com/cart';

(async () => {
  if (!ENDPOINT) {
    console.error('Set SMARTBROWZ_ENDPOINT first');
    process.exit(1);
  }

  const browser = await puppeteer.connect({ browserWSEndpoint: ENDPOINT });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    console.log('Opening product page...');
    await page.goto(PRODUCT_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Waiting for Add to cart button...');
    await page.waitForSelector(ADD_TO_CART_SELECTOR, { timeout: 15000 });
    await page.click(ADD_TO_CART_SELECTOR);

    await new Promise(r => setTimeout(r, 3000));   // let the cart update

    console.log('Opening cart...');
    await page.goto(CART_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.screenshot({ path: 'cart.png', fullPage: true });
    console.log('Done: cart.png saved');
  } catch (e) {
    console.error('Failed:', e.message);
    await page.screenshot({ path: 'error.png', fullPage: true });
    console.log('Saved error.png');
  } finally {
    await page.close();
    await browser.disconnect();
  }
})();