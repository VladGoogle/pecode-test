import {test, expect, Page, Locator} from '@playwright/test';
import {HeaderPage} from "../pages/header.page";
import {FilterPage} from "../pages/filter.page";
import {delay} from "../middlewares/wait.middleware";

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
    await page.locator('a.show-more').waitFor({state: 'visible'})
    const pageTitles = await page.$$('.goods-tile__title')
    for (const element of pageTitles) {
      expect(await element.innerText()).toContain('Xiaomi')
    }
  })

  test('Should apply price filter to the Xiaomi products', async () => {
    const filterPage = new FilterPage(page)
    await filterPage.minPriceInput.clear().then(async ()=>{
      await filterPage.minPriceInput.type('10000')
    })
    await filterPage.maxPriceInput.clear().then(async ()=>{
      await filterPage.maxPriceInput.type('15000')
    })
    await filterPage.applyPriceFilter.click()
    await page.locator('a.show-more').waitFor({state: 'visible'})
    await delay(1000)
    const filterItems = await filterPage.filterItems
    expect((await filterPage.filterItems).length).toEqual(2)
    const productTitles = await filterPage.productTitles
    const productPrices = await page.$$('.goods-tile__price-value')
    // for( const item of productPrices) {
    //   console.log(await item.innerText())
    //   expect(await item.innerText()).toContain('Xiaomi')
    //   expect(parseFloat((await item.innerText()).replace(/\s/g, ''))).toBeGreaterThanOrEqual(10000)
    //   expect(parseFloat((await item.innerText()).replace(/\s/g, ''))).toBeLessThanOrEqual(15000)
    // }
    for (let i = 0; i < productPrices.length; i++){
      expect(await productTitles[i].innerText()).toContain('Xiaomi')
      expect(parseFloat((await productPrices[i].innerText()).replace(/\s/g, ''))).toBeGreaterThanOrEqual(10000)
      expect(parseFloat((await productPrices[i].innerText()).replace(/\s/g, ''))).toBeLessThanOrEqual(15000)
    }
  })

  test('Should show Xiaomi products who are ready to go and have a price between 5000 and 10000', async () => {
    const filterPage = new FilterPage(page)
    await page.locator('[data-id="Готовий до відправлення"]').click()
    await page.locator('a.show-more').waitFor({state: 'visible'})
    await delay(1000)
    expect((await filterPage.filterItems).length).toEqual(3)
    const productTitles = await filterPage.productTitles
    const productPrices = await filterPage.productPrices
    const productStates = await page.$$('div.goods-tile__availability')
    for (let i = 0; i < productPrices.length; i++){
      expect(await productTitles[i].innerText()).toContain('Xiaomi')
      expect(parseFloat((await productPrices[i].innerText()).replace(/\s/g, ''))).toBeGreaterThanOrEqual(10000)
      expect(parseFloat((await productPrices[i].innerText()).replace(/\s/g, ''))).toBeLessThanOrEqual(15000)
    }

    for(const item of productStates) {
      expect((await item.innerText()).slice(0, -1)).toEqual('Готовий до відправлення')
    }

  })

})
