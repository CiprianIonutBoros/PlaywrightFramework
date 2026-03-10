import { type Page, type Locator } from '@playwright/test';
import { InventoryMap } from '../PageMaps/inventory.map';

export class InventoryPage {
  private readonly map: InventoryMap;

  constructor(private readonly page: Page) {
    this.map = new InventoryMap(page);
  }

  get titleLocator(): Locator {
    return this.map.title;
  }

  get cartBadgeLocator(): Locator {
    return this.map.cartBadge;
  }

  get footerTextLocator(): Locator {
    return this.map.footerText;
  }

  get twitterLinkLocator(): Locator {
    return this.map.twitterLink;
  }

  get facebookLinkLocator(): Locator {
    return this.map.facebookLink;
  }

  get linkedinLinkLocator(): Locator {
    return this.map.linkedinLink;
  }

  async addItemToCartByName(itemName: string): Promise<void> {
    const item = this.map.inventoryItems.filter({ hasText: itemName });
    await item.getByText('Add to cart').click();
  }

  async removeItemByName(itemName: string): Promise<void> {
    const item = this.map.inventoryItems.filter({ hasText: itemName });
    await item.getByText('Remove').click();
  }

  async clickItemByName(itemName: string): Promise<void> {
    await this.map.inventoryItemNames.filter({ hasText: itemName }).click();
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.map.cartBadge.innerText();
  }

  async goToCart(): Promise<void> {
    await this.map.cartLink.click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.map.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return await this.map.inventoryItemNames.allInnerTexts();
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.map.inventoryItemPrices.allInnerTexts();
    return priceTexts.map((p) => parseFloat(p.replace('$', '')));
  }

  async getInventoryItemCount(): Promise<number> {
    return await this.map.inventoryItems.count();
  }

  async logout(): Promise<void> {
    await this.map.burgerMenuButton.click();
    await this.map.logoutLink.click();
  }

  async clickAllItems(): Promise<void> {
    await this.map.burgerMenuButton.click();
    await this.map.allItemsLink.click();
  }

  async clickAbout(): Promise<void> {
    await this.map.burgerMenuButton.click();
    await this.map.aboutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.map.burgerMenuButton.click();
    await this.map.resetAppStateLink.click();
    await this.map.closeBurgerMenuButton.click();
  }
}
