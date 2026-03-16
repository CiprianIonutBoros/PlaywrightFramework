import { type Page, type Locator } from '@playwright/test';

export class CheckoutMap {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly errorMessage: Locator;
  readonly summaryTotal: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryItems: Locator;
  readonly summaryItemNames: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.cancelButton = page.locator('#cancel');
    this.finishButton = page.locator('#finish');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryTotal = page.locator('[data-test="total-label"]');
    this.summarySubtotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryItems = page.locator('[data-test="inventory-item"]');
    this.summaryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.backHomeButton = page.locator('#back-to-products');
  }
}
