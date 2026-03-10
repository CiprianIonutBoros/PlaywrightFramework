import { type Page, type Locator } from '@playwright/test';
import { ItemDetailMap } from '../PageMaps/item-detail.map';

export class ItemDetailPage {
  private readonly map: ItemDetailMap;

  constructor(private readonly page: Page) {
    this.map = new ItemDetailMap(page);
  }

  get itemNameLocator(): Locator {
    return this.map.itemName;
  }

  get itemDescriptionLocator(): Locator {
    return this.map.itemDescription;
  }

  get itemPriceLocator(): Locator {
    return this.map.itemPrice;
  }

  get itemImageLocator(): Locator {
    return this.map.itemImage;
  }

  get addToCartButtonLocator(): Locator {
    return this.map.addToCartButton;
  }

  get removeButtonLocator(): Locator {
    return this.map.removeButton;
  }

  async getItemName(): Promise<string> {
    return await this.map.itemName.innerText();
  }

  async getItemDescription(): Promise<string> {
    return await this.map.itemDescription.innerText();
  }

  async getItemPrice(): Promise<string> {
    return await this.map.itemPrice.innerText();
  }

  async addToCart(): Promise<void> {
    await this.map.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.map.removeButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.map.backToProductsButton.click();
  }
}
