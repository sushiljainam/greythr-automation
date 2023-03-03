import puppeteer, { Page } from 'puppeteer'
import dotenv from 'dotenv'
import { indexOf, toLower } from 'ramda'
dotenv.config()

const { GAMIO_GREYTHR_UNAME, GAMIO_GREYTHR_PASS } = process.env

const clickButtonWithLabel = async (page: Page, label: string) => {
    const buttons = await page.$$('button')
    for (const button of buttons) {
        const buttonText = await button.toString()
        if (indexOf(toLower(label), toLower(buttonText))) {
            await button.click()
            break
        }
    }
    throw new Error(`buttton with label (${label}) not found`)
}

const login = async (page: Page) => {
    await page.goto('https://gamio.greythr.com/', { waitUntil: 'networkidle0' })

    const usernameSelector = 'input[name="username"]'
    const passwordSelector = 'input[name="password"]'
    const loginButtonLabel = 'Log in'

    await page.type(usernameSelector, GAMIO_GREYTHR_UNAME || '')
    await page.type(passwordSelector, GAMIO_GREYTHR_PASS || '')

    await Promise.all([
        page.waitForNavigation(),
        clickButtonWithLabel(page, loginButtonLabel),
    ])

    await page.waitForSelector('#dashboardContainer')
}

const signOut = async (page: Page) => {
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
