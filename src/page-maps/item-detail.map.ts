import { type Page, type Locator } from '@playwright/test';

export class ItemDetailMap {
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;
  readonly itemImage: Locator;

  constructor(page: Page) {
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('#add-to-cart');
    this.removeButton = page.locator('#remove');
    this.backToProductsButton = page.locator('#back-to-products');
    this.itemImage = page.locator('.inventory_details_img');
  }
}
