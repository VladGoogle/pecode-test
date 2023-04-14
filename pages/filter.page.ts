// playwright-dev-page.ts
import {ElementHandle, expect, Locator, Page} from '@playwright/test';

export class FilterPage {
    readonly page: Page;
    readonly minPriceInput: Locator;
    readonly maxPriceInput: Locator;
    readonly applyPriceFilterButton: Locator;
    readonly filterItems:  Promise<ElementHandle<SVGElement | HTMLElement>[]>;
    readonly productPrices: Promise<Locator[]>;
    readonly productStates: Promise<ElementHandle<SVGElement | HTMLElement>[]>;
    readonly productTitles: Promise<string[]>;
    readonly addToCartButtons: Locator
    readonly sortingSelector: Locator;
    readonly showMoreButton: Locator;
    readonly selectedSortingSelector: Locator;

    constructor(page: Page) {
        this.page = page;
        this.minPriceInput = page.locator('[formcontrolname="min"]');
        this.maxPriceInput = page.locator('[formcontrolname="max"]');
        this.applyPriceFilterButton = page.getByRole('button', { name: 'Ok' });
        this.filterItems = page.$$('.catalog-selection__link')
        this.productPrices =  page.locator('.goods-tile__price-value').all()
        this.showMoreButton =  page.locator('a.show-more')
        this.productStates =  page.$$('div.goods-tile__availability')
        this.productTitles =  page.locator('.goods-tile__title').allTextContents()
        this.addToCartButtons =  page.locator('button.goods-tile__buy-button')
        this.sortingSelector =  page.locator('select.ng-pristine')
        this.selectedSortingSelector =  page.locator('xpath=//html/body/app-root/div/div/rz-search/rz-catalog/div/div[1]/div/rz-sort/select')
    }
}