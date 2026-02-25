const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        page.on('console', msg => {
            console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
        });

        page.on('pageerror', err => {
            console.log(`[PAGE ERROR] ${err.toString()}`);
        });

        page.on('requestfailed', request => {
            console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
        });

        await page.goto('http://localhost:4200', { waitUntil: 'networkidle2', timeout: 15000 });
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        await browser.close();
    } catch (e) {
        console.error('Puppeteer script failed:', e);
    }
})();
