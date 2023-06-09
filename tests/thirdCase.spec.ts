import {test, expect, Page, Locator} from '@playwright/test';
import {HeaderPage} from "../pages/header.page";
import {FilterPage} from "../pages/filter.page";
import {delay} from "../middlewares/wait.middleware";
import {parsePrice} from "../middlewares/convertPrice.middleware";

let page: Page;
let testName;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
});

test.afterAll(async () => {
    await page.close();
});

test.beforeEach(({}, testInfo)=>{
    testName = testInfo.title
})

test.describe.configure({mode: 'serial'})

test.describe('Add items to the basket', async() => {

    test('Should have correct url', async () => {
        await expect(page).toHaveURL('https://rozetka.com.ua/ua/')
    })

    test('Should search the products by search query', async () => {
        const headerPage = new HeaderPage(page)
        const filterPage = new FilterPage(page)
        await headerPage.searchProducts('Lenovo')
        await filterPage.showMoreButton.waitFor({state: 'visible'})
        await delay(1000)
    })

    test('Should add new product to the cart and set new total price of the cart', async () => {
        const headerPage = new HeaderPage(page)
        const filterPage = new FilterPage(page)
        const productTitle = await filterPage.productTitles
        await filterPage.addToCartButtons.nth(0).click().then(async ()=>{
            await expect(await filterPage.addToCartButtons.nth(0)).toHaveAttribute('aria-label', 'В кошику')
        })
        await headerPage.cartButton.click()
        await delay(1000)
        const cartItemTitles = await headerPage.cartItemTitles
        await expect(cartItemTitles.nth(0)).toBeVisible()
        await expect(cartItemTitles.nth(0)).toHaveText(productTitle[0])
        expect(parsePrice(await headerPage.cartTotalPrice.textContent())).toEqual(parsePrice(await headerPage.cartItemPrices.nth(0).textContent()))
})

    test('Should check Delete Cart Item button for being clickable', async () => {
        const headerPage = new HeaderPage(page)
        const filterPage = new FilterPage(page)
        await headerPage.cartItemToggleMenu.click()
        await expect(headerPage.cartItemDeleteButton).toBeEnabled()
    })

    test('Should change the category to the Playstation game consoles', async () => {
        const headerPage = new HeaderPage(page)
        const filterPage = new FilterPage(page)
        await headerPage.cartCloseButton.click()
        await headerPage.catalogueMenu.click()
        await headerPage.catalogueItems.nth(2).hover()
        await page.getByRole('link', {name: 'PlayStation 5'}).first().click()
        await filterPage.showMoreButton.waitFor({state: 'visible'})
        await delay(2000)
    })

    test('Should add second item to the cart and change the total price of the cart', async () => {
        const headerPage = new HeaderPage(page)
        const filterPage = new FilterPage(page)
        await filterPage.addToCartButtons.nth(0).click().then(async ()=>{
            await expect(await filterPage.addToCartButtons.nth(0)).toHaveAttribute('aria-label', 'В кошику')
        })
        await headerPage.cartButton.click()
        await delay(1000)
        expect(await headerPage.cartItemPrices.all()).toHaveLength(2)
        const cartItemPrice = await page.locator('.cart-product__price').allInnerTexts().then((arr)=>{
            return arr.map((item)=>{
                return parseFloat(item.replace(/\s/g, ''))
            })
        }).then((arr)=>{
            return arr.reduce((previousValue, currentValue)=>{
                return previousValue + currentValue
            })
        })

        expect(await parsePrice(await headerPage.cartTotalPrice.textContent())).toEqual(cartItemPrice)
    })

})
