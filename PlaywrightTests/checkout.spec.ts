import { test, expect } from './fixtures/test-fixtures';
import { CheckoutInfo } from './data/test-data';

test.describe('Checkout - Information Form Validation', () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();
  });

  test('TC-400 | Missing first name triggers a required field error', { tag: '@smoke' }, async ({ checkoutPage }) => {
    await checkoutPage.fillInformation('', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessageLocator).toContainText('First Name is required');
  });

  test('TC-401 | Missing last name triggers a required field error', { tag: '@smoke' }, async ({ checkoutPage }) => {
    await checkoutPage.fillInformation('John', '', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessageLocator).toContainText('Last Name is required');
  });

  test('TC-402 | Missing postal code triggers a required field error', { tag: '@smoke' }, async ({ checkoutPage }) => {
    await checkoutPage.fillInformation('John', 'Doe', '');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessageLocator).toContainText('Postal Code is required');
  });

  test(
    'TC-403 | Cancel button redirects back to the cart page',
    { tag: '@regression' },
    async ({ checkoutPage, cartPage }) => {
      await checkoutPage.cancel();
      await expect(cartPage.titleLocator).toHaveText('Your Cart');
    },
  );

  test(
    'TC-404 | Valid information advances to the checkout overview',
    { tag: '@smoke' },
    async ({ page, checkoutPage }) => {
      await checkoutPage.fillInformation(
        CheckoutInfo.valid.firstName,
        CheckoutInfo.valid.lastName,
        CheckoutInfo.valid.postalCode,
      );
      await checkoutPage.continue();
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
    },
  );
});

test.describe('Checkout - Order Summary Overview', () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage, checkoutPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(
      CheckoutInfo.valid.firstName,
      CheckoutInfo.valid.lastName,
      CheckoutInfo.valid.postalCode,
    );
    await checkoutPage.continue();
  });

  test('TC-410 | Order summary lists all selected products', { tag: '@smoke' }, async ({ checkoutPage }) => {
    const items = await checkoutPage.getSummaryItemNames();
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bike Light');
    expect(await checkoutPage.getSummaryItemCount()).toBe(2);
  });

  test('TC-411 | Order summary displays the item subtotal', { tag: '@regression' }, async ({ checkoutPage }) => {
    const subtotal = await checkoutPage.getSummarySubtotal();
    expect(subtotal).toContain('Item total:');
  });

  test('TC-412 | Order summary displays the tax amount', { tag: '@regression' }, async ({ checkoutPage }) => {
    const tax = await checkoutPage.getSummaryTax();
    expect(tax).toContain('Tax:');
  });

  test('TC-413 | Order summary displays the grand total', { tag: '@regression' }, async ({ checkoutPage }) => {
    const total = await checkoutPage.getSummaryTotal();
    expect(total).toContain('Total:');
  });

  test('TC-414 | Grand total equals subtotal plus tax', { tag: '@regression' }, async ({ checkoutPage }) => {
    const subtotalText = await checkoutPage.getSummarySubtotal();
    const taxText = await checkoutPage.getSummaryTax();
    const totalText = await checkoutPage.getSummaryTotal();

    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test(
    'TC-415 | Cancel from overview redirects to inventory page',
    { tag: '@regression' },
    async ({ checkoutPage, inventoryPage }) => {
      await checkoutPage.cancel();
      await expect(inventoryPage.titleLocator).toHaveText('Products');
    },
  );
});

test.describe('Checkout - Order Confirmation', () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage, checkoutPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(
      CheckoutInfo.valid.firstName,
      CheckoutInfo.valid.lastName,
      CheckoutInfo.valid.postalCode,
    );
    await checkoutPage.continue();
    await checkoutPage.finish();
  });

  test('TC-420 | Confirmation page displays the success header', { tag: '@smoke' }, async ({ checkoutPage }) => {
    await expect(checkoutPage.completeHeaderLocator).toHaveText('Thank you for your order!');
  });

  test('TC-421 | Confirmation page displays the dispatch message', { tag: '@regression' }, async ({ checkoutPage }) => {
    await expect(checkoutPage.completeTextLocator).toContainText('Your order has been dispatched');
  });

  test(
    'TC-422 | Back Home button returns to the inventory page',
    { tag: '@smoke' },
    async ({ checkoutPage, inventoryPage }) => {
      await checkoutPage.backHome();
      await expect(inventoryPage.titleLocator).toHaveText('Products');
    },
  );
});
