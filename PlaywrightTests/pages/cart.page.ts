import { type Page, type Locator } from '@playwright/test';
import { CartMap } from '../PageMaps/cart.map';

export class CartPage {
  private readonly map: CartMap;

  constructor(private readonly page: Page) {
    this.map = new CartMap(page);
  }

  get titleLocator(): Locator {
    return this.map.title;
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.map.cartItemNames.allInnerTexts();
  }

  async getCartItemCount(): Promise<number> {
    return await this.map.cartItems.count();
  }

  async getCartItemPrices(): Promise<string[]> {
    return await this.map.cartItemPrices.allInnerTexts();
  }

  async getItemQuantity(itemName: string): Promise<string> {
    const item = this.map.cartItems.filter({ hasText: itemName });
    return await item.locator('[data-test="item-quantity"]').innerText();
  }

  async removeItemByName(itemName: string): Promise<void> {
    const item = this.map.cartItems.filter({ hasText: itemName });
    await item.getByText('Remove').click();
  }

  async checkout(): Promise<void> {
    await this.map.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.map.continueShoppingButton.click();
  }
}
