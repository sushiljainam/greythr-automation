import puppeteer, { ElementHandle, Page } from 'puppeteer'
import dotenv from 'dotenv'
import { includes, indexOf, replace, toLower, trim } from 'ramda'
dotenv.config()

const { GAMIO_GREYTHR_UNAME, GAMIO_GREYTHR_PASS } = process.env

const clickButtonWithLabel = async (page: Page, label: string) => {
    const buttons = await page.$$('button')
    console.log('await page.$$(\'button\')')
    for (const button of buttons) {
        const buttonText = await button.toString()
        console.log('await button.toString()', button)
        await button.click()
        console.log('await button.click()')
        if (indexOf(toLower(label), toLower(buttonText)) > 0) {
            console.log('indexOf(toLower(label), toLower(buttonText)) > 0')
            break
        }
    }
    // throw new Error(`buttton with label (${label}) not found`)
}

const login = async (page: Page) => {
    await page.goto('https://gamio.greythr.com/', { waitUntil: 'networkidle0' })
    console.log('await page.goto(\'https://gamio.greythr.com/\', { waitUntil: \'networkidle0\' })')

    const usernameSelector = 'input[name="username"]'
    const passwordSelector = 'input[name="password"]'
    const loginButtonLabel = 'Log in'

    await page.waitForSelector(usernameSelector)
    await page.waitForSelector(passwordSelector)

    // await page.waitForNavigation(),
    // console.log('await page.waitForNavigation(),')
    await page.type(usernameSelector, GAMIO_GREYTHR_UNAME || '')
    console.log('await page.type(usernameSelector, GAMIO_GREYTHR_UNAME || \'\')')
    await page.type(passwordSelector, GAMIO_GREYTHR_PASS || '')
    console.log('await page.type(passwordSelector, GAMIO_GREYTHR_PASS || \'\')')

    await Promise.all([
        page.waitForNavigation(),
        clickButtonWithLabel(page, loginButtonLabel),
    ])
    console.log('await page.waitForNavigation(),')
    console.log('await Promise.all([')

    await page.waitForSelector('gt-attendance-info')
    console.log('await page.waitForSelector(\'gt-attendance-info\')')
}

const signOut = async (page: Page) => {
    await page.click('#userWidgetDropdownBtn')
    console.log('await page.click(\'#userWidgetDropdownBtn\')')
    await page.click('#logoutLink')
    console.log('await page.click(\'#logoutLink\')')
    await page.waitForNavigation()
    console.log('await page.waitForNavigation()')
}

const signIn = async (page: Page, allowedBtnLabels: string[]) => {
    const pe = await page.$('gt-attendance-info')
    console.log('await page.click(\'gt-attendance-info\')', pe)
    if (pe) {
        // await exploreChildren(page, pe)
        const bts = await pe.$$('pierce/button')
        console.log('await page.click(\'gt-attendance-info * button\')', bts.length)
        for (const bt of bts) {
            const btOrigLbl = await page.evaluate(elm => elm.textContent, bt) || ''
            const btLabel = replace(/[ ]/g, '', trim(toLower(btOrigLbl)))
            console.log('btLabel', btLabel)
            if (includes(btLabel, allowedBtnLabels)) {
                await bts?.[0].click()
                console.log(`Clicked on [${btOrigLbl}]`)
            } else {
                console.log(`NOT clicked on [${btOrigLbl}]`)
            }
        }
    } else {
        throw new Error('gt-attendance-info not found')
    }
    // await page.click('#logoutLink')
    // console.log('await page.click(\'#logoutLink\')')
    // await page.waitForNavigation()
    // console.log('await page.waitForNavigation()')
}

(async () => {
    const browser = await puppeteer.launch({ headless: true })
    console.log('await puppeteer.launch({ headless: false })')

    try {
        const page = await browser.newPage()
        console.log('await browser.newPage()')
        await login(page)
        console.log('await login(page)', process.argv[2])

        const actionMode = process.argv[2]
        if (actionMode === 'out') {
            await signIn(page, ['signout'])
            console.log('await signOut(page)')
        } else if (actionMode === 'in') {
            await signIn(page, ['signin'])
            console.log('await signIn(page)')
        } else if (actionMode === 'toggle') {
            await signIn(page, ['signin', 'signout'])
            console.log('await signIn(page)2')
        } else {
            console.log('action not defined')
        }
    } finally {
        await browser.close()
        console.log('await browser.close()')
    }
})()
