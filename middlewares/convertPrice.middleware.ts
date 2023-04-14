import {Locator} from "@playwright/test";

export async function parsePrice(elem: string) {
    return parseFloat(elem.replace(/\s/g, ''))
}