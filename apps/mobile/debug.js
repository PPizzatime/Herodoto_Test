const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('BROWSER NETWORK ERROR:', request.url(), request.failure().errorText);
  });

  console.log('Navigating to http://localhost:8081...');
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle2' });
  
  console.log('Page loaded. Wait 3 seconds...');
  await new Promise(r => setTimeout(r, 3000));
  
  const content = await page.content();
  console.log('Content length:', content.length);
  
  await browser.close();
})();
