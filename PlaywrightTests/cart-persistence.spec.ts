import { test, expect } from './fixtures/test-fixtures';

test.describe('Cart State Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test(
    'TC-800 | Cart badge persists through product detail navigation',
    { tag: '@regression' },
    async ({ inventoryPage, itemDetailPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');

      await inventoryPage.clickItemByName('Sauce Labs Bike Light');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');

      await itemDetailPage.backToProducts();
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');
    },
  );

  test(
    'TC-801 | Cart badge persists across cart and inventory round-trip',
    { tag: '@regression' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.addItemToCartByName('Sauce Labs Onesie');

      await inventoryPage.goToCart();
      expect(await cartPage.getCartItemCount()).toBe(2);

      await cartPage.continueShopping();
      await expect(inventoryPage.cartBadgeLocator).toHaveText('2');
    },
  );

  test(
    'TC-802 | Cart badge persists after external navigation to About page',
    { tag: '@regression' },
    async ({ page, inventoryPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');

      await inventoryPage.clickAbout();
      await expect(page).toHaveURL('https://saucelabs.com/');

      await page.goto('/inventory.html');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');
    },
  );

  test('TC-803 | Reset App State clears all items from the cart', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadgeLocator).toHaveText('2');

    await inventoryPage.resetAppState();
    await expect(inventoryPage.cartBadgeLocator).not.toBeVisible();
  });

  test(
    'TC-804 | Previously added items display Remove button after re-entering inventory',
    { tag: '@regression' },
    async ({ page, inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.goToCart();
      await cartPage.continueShopping();

      const backpackItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
      await expect(backpackItem.getByText('Remove')).toBeVisible();
    },
  );
});
