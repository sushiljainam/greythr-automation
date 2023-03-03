Sure, here's an updated version of the headless browser script that reads the username and password from environment variables set in the shell:

```javascript
const puppeteer = require('puppeteer');

(async () => {
  // Parse command line argument
  const [,, action] = process.argv;

  // Read username and password from environment variables
  const username = process.env.GAMIO_GREYTHR_UNAME;
  const password = process.env.GAMIO_GREYTHR_PASS;

  // Launch browser and create a new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto('https://gamio.greythr.com/');

  // Enter username and password
  await page.type('#username', username);
  await page.type('#password', password);

  // Click on 'Log in' button
  await page.click('#loginbutton');

  // Wait for the dashboard to load completely
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Click on either 'Sign In' or 'Sign Out' button based on command line argument
  const buttonSelector = action === 'signin' ? '#signinbutton' : '#signoutbutton';
  await page.click(buttonSelector);

  // Wait for the sign in/out process to complete
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Close the browser
  await browser.close();
})();


```

To set the GAMIO_GREYTHR_UNAME and GAMIO_GREYTHR_PASS environment variables in the shell, you can use the following commands:

```
export GAMIO_GREYTHR_UNAME=your_username
export GAMIO_GREYTHR_PASS=your_password
```

Note that you'll need to replace 'your_username' and 'your_password' with your actual login credentials.


To run this modified script with the 'signin' command line argument, you can use the following command:

```
node index.js signin
```

And to run it with the 'signout' command line argument, you can use:


```
node index.js signout
```
Note that you'll need to replace 'your_username' and 'your_password' with your actual login credentials, and make sure that the button selectors '#signinbutton' and '#signoutbutton' match the actual selectors used on the page for the 'Sign In' and 'Sign Out' buttons respectively.


Sure, here is the complete README file in markdown format:

# Gamio Greythr Automation

This Node.js module automates signing in and out of [gamio.greythr.com](https://gamio.greythr.com/).

## Installation

To install the dependencies, run:

```
npm install
```

## Usage

Before running the module, make sure to set the following environment variables:

```
export GAMIO_GREYTHR_UNAME=your_gamio_username
export GAMIO_GREYTHR_PASS=your_gamio_password
```

You can save these environment variables permanently in your shell by adding them to your `.bashrc` or `.zshrc` file.

To run the module and sign in, run:

```
npm start signin
```

To run the module and sign out, run:
```
npm start signout
```

## Unit Tests

To run the unit tests, run:
```
npm test
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


Sure, here's a `package.json` file for the project:

```json
{
  "name": "gamio-greythr-automation",
  "version": "1.0.0",
  "description": "Automated sign in/out for the Gamio Greythr HR portal using Puppeteer",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no tests specified\" && exit 1"
  },
  "keywords": [
    "gamio",
    "greythr",
    "automation",
    "puppeteer"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "puppeteer": "^13.1.0"
  }
}
```


Sure, here's an example of a unit test using Jest to test the signIn and signOut functions of the gamioGreythrAutomation module:

```javascript
const gamioGreythrAutomation = require('./gamioGreythrAutomation');

describe('gamioGreythrAutomation', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await gamioGreythrAutomation.launchBrowser();
    page = await gamioGreythrAutomation.openPage(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('signIn', () => {
    it('should sign in successfully with valid credentials', async () => {
      const result = await gamioGreythrAutomation.signIn(page, 'valid_username', 'valid_password');
      expect(result).toBe(true);
    });

    it('should fail to sign in with invalid credentials', async () => {
      const result = await gamioGreythrAutomation.signIn(page, 'invalid_username', 'invalid_password');
      expect(result).toBe(false);
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      const result = await gamioGreythrAutomation.signOut(page);
      expect(result).toBe(true);
    });
  });
});
```
