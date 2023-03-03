Here's an example headless browser script in Node.js using Puppeteer to achieve the tasks you described:

```javascript
const puppeteer = require('puppeteer');

(async () => {
  // Launch browser and create a new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto('https://gamio.greythr.com/');

  // Enter username and password
  await page.type('#username', 'your_username');
  await page.type('#password', 'your_password');

  // Click on 'Log in' button
  await page.click('#loginbutton');

  // Wait for the dashboard to load completely
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Click on 'Sign In' button
  await page.click('#signinbutton');

  // Wait for the sign in process to complete
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Close the browser
  await browser.close();
})();

```

Note that you'll need to replace `'your_username'` and `'your_password'` with your actual login credentials. You may also need to adjust the selectors used to locate the login and sign in buttons based on the structure of the page.

