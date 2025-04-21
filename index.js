const puppeteer = require('puppeteer');
const faker = require('faker');

// List user agents acak
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1"
];

// Daftar proxy dummy (ganti dengan proxy asli jika ada)
const proxies = [
  "", "", "", "" // kosong artinya pakai koneksi langsung
];

function generateGmail() {
  const username = faker.internet.userName().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `${username}${Math.floor(Math.random() * 10000)}@gmail.com`;
}

(async () => {
  for (let i = 1; i <= 200; i++) {
    const proxy = proxies[i % proxies.length];
    const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
    if (proxy) launchArgs.push(`--proxy-server=${proxy}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: launchArgs
    });

    const page = await browser.newPage();
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(userAgent);

    const referralUrl = 'https://ambigo.ambient.network/app/onboarding?referral=WvoQ0ALCsHKfibRhV0nL';
    await page.goto(referralUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(5000);

    const fakeEmail = generateGmail();
    console.log(`(${i}/200) Using Gmail: ${fakeEmail}`);

    try {
      await page.type('input[type="email"]', fakeEmail, { delay: 100 });
      await page.click('button');
      console.log(`(${i}/200) Email submitted.`);
    } catch (err) {
      console.error(`(${i}/200) Submit failed:`, err.message);
    }

    await page.waitForTimeout(3000);
    await browser.close();
    await new Promise(resolve => setTimeout(resolve, 2000)); // delay antar loop
  }
})();