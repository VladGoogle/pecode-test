import {Locator} from "@playwright/test";

export async function parsePrice(elem: Locator) {
    return parseFloat((await elem.textContent()).replace(/\s/g, ''))
}