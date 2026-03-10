import { type Page, type Locator } from '@playwright/test';

export class CartMap {
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.title = page.locator('[data-test="title"]');
  }
}
