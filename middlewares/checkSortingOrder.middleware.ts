import {expect} from "@playwright/test";

export function checkSortingByPriceAsc(arr: number[]) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                return false;
            }
        }
        return true;
}

export function checkSortingByPriceDesc(arr: number[]) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                return false;
            }
        }
        return true;
}

