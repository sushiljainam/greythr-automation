import puppeteer from 'puppeteer'
import dotenv from 'dotenv'

dotenv.config()

const { GAMIO_GREYTHR_UNAME, GAMIO_GREYTHR_PASS } = process.env

const login = async (page: puppeteer.Page) => {
    await page.goto('https://gamio.greythr.com/', { waitUntil: 'networkidle0' })

    const usernameSelector = 'input[name="username"]'
    const passwordSelector = 'input[name="password"]'
    const loginButtonSelector = '#loginBtn'

    await page.type(usernameSelector, GAMIO_GREYTHR_UNAME || '')
    await page.type(passwordSelector, GAMIO_GREYTHR_PASS || '')

    await Promise.all([
        page.waitForNavigation(),
        page.click(loginButtonSelector),
    ])

    await page.waitForSelector('#dashboardContainer')
}

const signOut = async (page: puppeteer.Page) => {
    await page.click('#userWidgetDropdownBtn')
    await page.click('#logoutLink')
    await page.waitForNavigation()
};

(async () => {
    const browser = await puppeteer.launch({ headless: true })

    try {
        const page = await browser.newPage()
        await login(page)

        const shouldSignOut = process.argv[2] === 'signout'
        if (shouldSignOut) {
            await signOut(page)
        } else {
            await page.click('#signInButton')
        }
    } finally {
        await browser.close()
    }
})()
