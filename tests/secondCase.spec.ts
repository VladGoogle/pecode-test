import {test, expect, Page, Locator} from '@playwright/test';
import {HeaderPage} from "../pages/header.page";
import {FilterPage} from "../pages/filter.page";
import {delay} from "../middlewares/wait.middleware";
import {testPlanFilter} from "allure-playwright/dist/testplan";

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

test.describe('Search the item', async() => {

    test('Should have correct url', async () => {
        await expect(page).toHaveURL('https://rozetka.com.ua/ua/')
    })

    test('Should search the products by search query', async () => {
        const headerPage = new HeaderPage(page)
        const filterPage = new FilterPage(page)
        await headerPage.searchProducts('Asus')
        await filterPage.showMoreButton.waitFor({state: 'visible'})
        await delay(1000)
        const productTitles = await page.locator('.goods-tile__title').all()
        for (const element of productTitles) {
            await expect(element).toContainText('asus', {ignoreCase: true})
        }
    })

})
