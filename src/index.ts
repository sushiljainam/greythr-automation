import puppeteer, { Page } from 'puppeteer'
import dotenv from 'dotenv'
import { includes, replace, toLower, trim } from 'ramda'
dotenv.config()

const { GAMIO_GREYTHR_UNAME, GAMIO_GREYTHR_PASS } = process.env

const clickButtonWithLabel = async (page: Page, label: string) => {
    const buttons = await page.$$('button')
    // console.log('await page.$$(\'button\')')
    for (const button of buttons) {
        const btOrigLbl = await page.evaluate(elm => elm.textContent, button) || ''
        const btLabel = replace(/[ ]/g, '', trim(toLower(btOrigLbl)))
        // console.log('await button.click()')
        if (btLabel === label) {
            await button.click()
            console.log(`Clicked on [${btOrigLbl}]`)
            break
        } else {
            console.log(`NOT Clicked on [${btOrigLbl}]`)
        }
    }
    // throw new Error(`buttton with label (${label}) not found`)
}

const login = async (page: Page) => {
    await page.goto('https://gamio.greythr.com/', { waitUntil: 'networkidle0' })

    const usernameSelector = 'input[name="username"]'
    const passwordSelector = 'input[name="password"]'
    const loginButtonLabel = 'login'

    await page.waitForSelector(usernameSelector)
    await page.waitForSelector(passwordSelector)

    // await page.waitForNavigation(),
    // console.log('await page.waitForNavigation(),')
    await page.type(usernameSelector, GAMIO_GREYTHR_UNAME || '')
    await page.type(passwordSelector, GAMIO_GREYTHR_PASS || '')

    await Promise.all([
        page.waitForNavigation(),
        clickButtonWithLabel(page, loginButtonLabel),
    ])

    await page.waitForSelector('gt-attendance-info')
    // console.debug('await page.waitForSelector(\'gt-attendance-info\')')
}

const clickIf = async (page: Page, allowedBtnLabels: string[]) => {
    const pe = await page.$('gt-attendance-info')
    if (pe) {
        // await exploreChildren(page, pe)
        const bts = await pe.$$('pierce/button')
        // console.debug('await await pe.$$(\'pierce/button\')', bts.length)
        for (const bt of bts) {
            const btOrigLbl = await page.evaluate(elm => elm.textContent, bt) || ''
            const btLabel = replace(/[ ]/g, '', trim(toLower(btOrigLbl)))
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
}

const m = (mm: string): string => {
    switch (mm) {
    case 'in':
        return 'only [Sign In]'
    case 'out':
        return 'only [Sign Out]'
    case 'toggle':
        return 'either [Sign In] or [Sign Out]'
    default:
        break
    }
    return 'undefined'
}

(async () => {
    const browser = await puppeteer.launch({ headless: true })

    try {
        const page = await browser.newPage()
        await login(page)

        const actionMode = process.argv[2]
        console.debug(`Expected to click on ${m(actionMode)}`)
        if (actionMode === 'out') {
            await clickIf(page, ['signout'])
        } else if (actionMode === 'in') {
            await clickIf(page, ['signin'])
        } else if (actionMode === 'toggle') {
            await clickIf(page, ['signin', 'signout'])
        } else {
            console.error('action not defined')
        }
    } finally {
        await browser.close()
    }
})()
