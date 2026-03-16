import { test, expect } from '../../src/fixtures/test-fixtures';
import { CheckoutInfo } from '../../src/data/test-data';

test.describe('E2E - Purchase Workflows', () => {
  test(
    'TC-500 | Single-item purchase from browse to order confirmation',
    { tag: '@smoke' },
    async ({ page, inventoryPage, cartPage, checkoutPage }) => {
      await page.goto('/inventory.html');

      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');

      await inventoryPage.goToCart();
      await expect(cartPage.titleLocator).toHaveText('Your Cart');
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toContain('Sauce Labs Backpack');

      await cartPage.checkout();
      await checkoutPage.fillInformation(
        CheckoutInfo.valid.firstName,
        CheckoutInfo.valid.lastName,
        CheckoutInfo.valid.postalCode,
      );
      await checkoutPage.continue();

      const summaryItems = await checkoutPage.getSummaryItemNames();
      expect(summaryItems).toContain('Sauce Labs Backpack');
      const total = await checkoutPage.getSummaryTotal();
      expect(total).toContain('Total:');

      await checkoutPage.finish();
      await expect(checkoutPage.completeHeaderLocator).toHaveText('Thank you for your order!');

      await checkoutPage.backHome();
      await expect(inventoryPage.titleLocator).toHaveText('Products');
      await expect(inventoryPage.cartBadgeLocator).not.toBeVisible();
    },
  );

  test(
    'TC-501 | Multi-item purchase with cart modification and price verification',
    { tag: '@smoke' },
    async ({ page, inventoryPage, cartPage, checkoutPage }) => {
      await page.goto('/inventory.html');

      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
      await inventoryPage.addItemToCartByName('Sauce Labs Onesie');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('3');

      await inventoryPage.goToCart();
      expect(await cartPage.getCartItemCount()).toBe(3);

      await cartPage.removeItemByName('Sauce Labs Bike Light');
      expect(await cartPage.getCartItemCount()).toBe(2);

      await cartPage.checkout();
      await checkoutPage.fillInformation(
        CheckoutInfo.valid.firstName,
        CheckoutInfo.valid.lastName,
        CheckoutInfo.valid.postalCode,
      );
      await checkoutPage.continue();

      const subtotalText = await checkoutPage.getSummarySubtotal();
      const taxText = await checkoutPage.getSummaryTax();
      const totalText = await checkoutPage.getSummaryTotal();

      const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
      const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
      const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
      expect(total).toBeCloseTo(subtotal + tax, 2);

      const summaryItems = await checkoutPage.getSummaryItemNames();
      expect(summaryItems).toContain('Sauce Labs Backpack');
      expect(summaryItems).toContain('Sauce Labs Onesie');
      expect(summaryItems).not.toContain('Sauce Labs Bike Light');

      await checkoutPage.finish();
      await expect(checkoutPage.completeHeaderLocator).toHaveText('Thank you for your order!');
    },
  );

  test(
    'TC-502 | Purchase via product detail page with mixed add-to-cart sources',
    { tag: '@regression' },
    async ({ page, inventoryPage, itemDetailPage, cartPage, checkoutPage }) => {
      await page.goto('/inventory.html');

      await inventoryPage.clickItemByName('Sauce Labs Fleece Jacket');
      await expect(itemDetailPage.itemNameLocator).toHaveText('Sauce Labs Fleece Jacket');
      await itemDetailPage.addToCart();
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');

      await itemDetailPage.backToProducts();
      await inventoryPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('2');

      await inventoryPage.goToCart();
      expect(await cartPage.getCartItemCount()).toBe(2);
      await cartPage.checkout();
      await checkoutPage.fillInformation(
        CheckoutInfo.valid.firstName,
        CheckoutInfo.valid.lastName,
        CheckoutInfo.valid.postalCode,
      );
      await checkoutPage.continue();
      await checkoutPage.finish();
      await expect(checkoutPage.completeHeaderLocator).toHaveText('Thank you for your order!');
    },
  );

  test(
    'TC-503 | Abandoned checkout preserves cart state across cancellation',
    { tag: '@regression' },
    async ({ page, inventoryPage, cartPage, checkoutPage }) => {
      await page.goto('/inventory.html');

      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.goToCart();
      await cartPage.checkout();

      await checkoutPage.cancel();
      await expect(cartPage.titleLocator).toHaveText('Your Cart');
      expect(await cartPage.getCartItemCount()).toBe(1);

      await cartPage.continueShopping();
      await expect(inventoryPage.titleLocator).toHaveText('Products');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');

      await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('2');
      await inventoryPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.fillInformation(
        CheckoutInfo.valid.firstName,
        CheckoutInfo.valid.lastName,
        CheckoutInfo.valid.postalCode,
      );
      await checkoutPage.continue();

      await checkoutPage.cancel();
      await expect(inventoryPage.titleLocator).toHaveText('Products');

      await expect(inventoryPage.cartBadgeLocator).toHaveText('2');
    },
  );
});
