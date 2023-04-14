import {test, expect, Page, Locator, TestInfo} from '@playwright/test';
import {HeaderPage} from "../pages/header.page";
import {FilterPage} from "../pages/filter.page";
import {delay} from "../middlewares/wait.middleware";
import {checkSortingByPriceAsc, checkSortingByPriceDesc} from "../middlewares/checkSortingOrder.middleware";

let page: Page;
let testName;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
});

test.beforeEach(({}, testInfo)=>{
    testName = testInfo.title
})

test.afterAll(async () => {
    await page.close();
});

test.describe.configure({mode: 'serial'})

test.describe('Sort products by price ascending and descending', async() => {

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


    test('Should sort products by price in descending way', async () => {
        const headerPage = new HeaderPage(page)
        const filterPage = new FilterPage(page)
        await expect(filterPage.selectedSortingSelector).toBeVisible().then(async ()=>{
            await filterPage.selectedSortingSelector.selectOption({value: '2: expensive'})
        })
        await filterPage.showMoreButton.waitFor({state: 'visible'})
        await delay(1000)
        const productPrices = await page.locator('.goods-tile__price-value').allInnerTexts().then((arr)=>{
            return arr.map((item)=>{
                return parseFloat(item.replace(/\s/g, ''))
            })
        })
        expect(checkSortingByPriceDesc(productPrices)).toBeTruthy()
    })

    test('Should sort products by price in ascending way', async () => {
        const headerPage = new HeaderPage(page)
        const filterPage = new FilterPage(page)
        let testInfo: TestInfo;
        await expect(filterPage.selectedSortingSelector).toBeEnabled().then(async () => {
            await filterPage.selectedSortingSelector.selectOption({value: '1: cheap'})
        })
        await filterPage.showMoreButton.waitFor({state: 'visible'})
        await delay(1000)
        const productPrices = await page.locator('.goods-tile__price-value').allInnerTexts().then((arr) => {
            return arr.map((item) => {
                return parseFloat(item.replace(/\s/g, ''))
            })
        })
        expect(checkSortingByPriceDesc(productPrices)).toBeTruthy()
    })


})
