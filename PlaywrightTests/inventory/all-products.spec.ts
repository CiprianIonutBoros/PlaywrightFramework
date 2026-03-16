import { test, expect } from '../../src/fixtures/test-fixtures';

const ALL_PRODUCTS = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
] as const;

test.describe('Product Catalog - Full Coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  for (const product of ALL_PRODUCTS) {
    test(
      `TC-600 | Product detail page renders correctly for "${product}"`,
      { tag: '@regression' },
      async ({ inventoryPage, itemDetailPage }) => {
        await inventoryPage.clickItemByName(product);

        await expect(itemDetailPage.itemNameLocator).toHaveText(product);
        await expect(itemDetailPage.itemDescriptionLocator).not.toBeEmpty();
        await expect(itemDetailPage.itemPriceLocator).toContainText('$');
        await expect(itemDetailPage.itemImageLocator).toBeVisible();
      },
    );

    test(
      `TC-601 | Add and remove "${product}" toggles cart state correctly`,
      { tag: '@regression' },
      async ({ inventoryPage }) => {
        await inventoryPage.addItemToCartByName(product);
        await expect(inventoryPage.cartBadgeLocator).toHaveText('1');

        await inventoryPage.removeItemByName(product);
        await expect(inventoryPage.cartBadgeLocator).not.toBeVisible();
      },
    );
  }

  test('TC-610 | Adding all six products sets cart badge to six', { tag: '@regression' }, async ({ inventoryPage }) => {
    for (const product of ALL_PRODUCTS) {
      await inventoryPage.addItemToCartByName(product);
    }
    await expect(inventoryPage.cartBadgeLocator).toHaveText('6');
  });

  test(
    'TC-611 | Full catalog purchase completes with correct total calculation',
    { tag: '@regression' },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      for (const product of ALL_PRODUCTS) {
        await inventoryPage.addItemToCartByName(product);
      }
      await inventoryPage.goToCart();
      expect(await cartPage.getCartItemCount()).toBe(6);

      await cartPage.checkout();
      await checkoutPage.fillInformation('Jane', 'Smith', '99999');
      await checkoutPage.continue();

      expect(await checkoutPage.getSummaryItemCount()).toBe(6);

      const subtotalText = await checkoutPage.getSummarySubtotal();
      const taxText = await checkoutPage.getSummaryTax();
      const totalText = await checkoutPage.getSummaryTotal();
      const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
      const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
      const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
      expect(total).toBeCloseTo(subtotal + tax, 2);

      await checkoutPage.finish();
      await expect(checkoutPage.completeHeaderLocator).toHaveText('Thank you for your order!');
    },
  );
});
