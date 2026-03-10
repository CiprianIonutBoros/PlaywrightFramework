import { type Page, type Locator } from '@playwright/test';
import { CheckoutMap } from '../PageMaps/checkout.map';

export class CheckoutPage {
  private readonly map: CheckoutMap;

  constructor(private readonly page: Page) {
    this.map = new CheckoutMap(page);
  }

  get completeHeaderLocator(): Locator {
    return this.map.completeHeader;
  }

  get completeTextLocator(): Locator {
    return this.map.completeText;
  }

  get errorMessageLocator(): Locator {
    return this.map.errorMessage;
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.map.firstNameInput.fill(firstName);
    await this.map.lastNameInput.fill(lastName);
    await this.map.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.map.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.map.cancelButton.click();
  }

  async finish(): Promise<void> {
    await this.map.finishButton.click();
  }

  async backHome(): Promise<void> {
    await this.map.backHomeButton.click();
  }

  async getSummaryTotal(): Promise<string> {
    return await this.map.summaryTotal.innerText();
  }

  async getSummarySubtotal(): Promise<string> {
    return await this.map.summarySubtotal.innerText();
  }

  async getSummaryTax(): Promise<string> {
    return await this.map.summaryTax.innerText();
  }

  async getSummaryItemNames(): Promise<string[]> {
    return await this.map.summaryItemNames.allInnerTexts();
  }

  async getSummaryItemCount(): Promise<number> {
    return await this.map.summaryItems.count();
  }
}
