// playwright-dev-page.ts
import { expect, Locator, Page } from '@playwright/test';
import {Protocol} from "playwright-core/types/protocol";

export class HeaderPage {
    readonly page: Page;
    readonly headerLogo: Locator;
    readonly sideMenu: Locator;
    readonly catalogueMenu: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly wishlistButton: Locator;
    readonly cartButton: Locator;
    readonly cartCloseButton: Locator;
    readonly cartItemTitles: Locator;
    readonly cartItemPrices: Locator;
    readonly cartItemToggleMenu: Locator;
    readonly cartItemDeleteButton: Locator;
    readonly cartTotalPrice: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.catalogueMenu = page.locator('#fat-menu');
        this.searchInput = page.locator('input.search-form__input');
        this.searchButton = page.locator('button.search-form__submit');
        this.cartButton = page.locator('xpath=//html/body/app-root/div/div/rz-header/rz-main-header/header/div/div/ul/li[7]/rz-cart/button');
        this.cartItemTitles = page.locator('a.cart-product__title');
        this.cartItemPrices = page.locator('p.cart-product__price');
        this.cartTotalPrice = page.locator('xpath=//html/body/app-root/rz-single-modal-window/div[3]/div[2]/rz-shopping-cart/div/div[1]/div/div/div/span')
        this.cartCloseButton = page.locator('.modal__close');
        this.cartItemToggleMenu = page.locator('#cartProductActions0');
        this.cartItemDeleteButton = page.locator('xpath=//*[@id="cartProductActions0"]/ul/li[1]/rz-trash-icon/button');
    }

    async searchProducts(data: string) {
        await this.searchInput.type(data)
        await this.searchButton.click()
    }
}