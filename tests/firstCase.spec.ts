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

test.describe('Verify if the price filter working correctly for the following marketplaces', async() => {

  test('Should have correct url', async () => {
    await expect(page).toHaveURL('https://rozetka.com.ua/ua/')
  })


  test('Should open Xiaomi smartphones page', async () => {
    const headerPage = new HeaderPage(page)
    const filterPage = new FilterPage(page)
    await headerPage.catalogueMenu.click()
    await page.locator('li.menu-categories__item').nth(1).hover()
    await page.getByRole('link', {name: 'Xiaomi'}).first().click()
    await filterPage.showMoreButton.waitFor({state: 'visible'})
    const pageTitles = await page.$$('.goods-tile__title')
    for (const element of pageTitles) {
      expect(await element.innerText()).toContain('Xiaomi')
    }
  })

  test('Should apply price filter from 10000 to 15000 to the Xiaomi products', async () => {
    const filterPage = new FilterPage(page)
    await filterPage.minPriceInput.clear().then(async ()=>{
      await filterPage.minPriceInput.type('10000')
    })
    await filterPage.maxPriceInput.clear().then(async ()=>{
      await filterPage.maxPriceInput.type('15000')
    })
    await filterPage.applyPriceFilterButton.click()
    await filterPage.showMoreButton.waitFor({state: 'visible'})
    await delay(1000)
    expect((await filterPage.filterItems).length).toEqual(2)
    const productTitles = await page.locator('.goods-tile__title').all()
    const productPrices = await page.locator('.goods-tile__price-value').all()
    for (let i = 0; i < productPrices.length; i++){
      expect(await productTitles[i].innerText()).toContain('Xiaomi')
      expect(await parsePrice(await productPrices[i].textContent())).toBeGreaterThanOrEqual(10000)
      expect(await parsePrice(await productPrices[i].textContent())).toBeLessThanOrEqual(15000)
    }
  })

  test('Should show Xiaomi products who are ready to go and have a price between 10000 and 15000', async () => {
    const filterPage = new FilterPage(page)
    await page.locator('[data-id="Готовий до відправлення"]').click()
    await page.locator('a.show-more').waitFor({state: 'visible'})
    await delay(1000)
    expect((await filterPage.filterItems).length).toEqual(3)
    const productTitles = await page.locator('.goods-tile__title').all()
    const productPrices = await page.locator('.goods-tile__price-value').all()
    const productStates = await page.locator('div.goods-tile__availability').allTextContents()
    for (let i = 0; i < productPrices.length; i++){
      expect(await productTitles[i].textContent()).toContain('Xiaomi')
      expect(await parsePrice(await productPrices[i].textContent())).toBeGreaterThanOrEqual(10000)
      expect(await parsePrice(await productPrices[i].textContent())).toBeLessThanOrEqual(15000)
      expect(productStates[i]).toContain('Готовий до відправлення')
    }
  })

})
