import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.clickItemByName('Sauce Labs Backpack');
  });

  test(
    'TC-200 | Product detail page displays the correct product name',
    { tag: '@smoke' },
    async ({ itemDetailPage }) => {
      await expect(itemDetailPage.itemNameLocator).toHaveText('Sauce Labs Backpack');
    },
  );

  test(
    'TC-201 | Product detail page renders a non-empty description',
    { tag: '@regression' },
    async ({ itemDetailPage }) => {
      await expect(itemDetailPage.itemDescriptionLocator).not.toBeEmpty();
    },
  );

  test(
    'TC-202 | Product detail page displays a valid price format',
    { tag: '@regression' },
    async ({ itemDetailPage }) => {
      await expect(itemDetailPage.itemPriceLocator).toContainText('$');
    },
  );

  test('TC-203 | Product detail page renders the product image', { tag: '@regression' }, async ({ itemDetailPage }) => {
    await expect(itemDetailPage.itemImageLocator).toBeVisible();
  });

  test(
    'TC-204 | Add to Cart from detail page updates the cart badge',
    { tag: '@smoke' },
    async ({ itemDetailPage, inventoryPage }) => {
      await itemDetailPage.addToCart();
      await expect(inventoryPage.cartBadgeLocator).toHaveText('1');
    },
  );

  test(
    'TC-205 | Remove from Cart on detail page toggles button state and clears badge',
    { tag: '@regression' },
    async ({ itemDetailPage, inventoryPage }) => {
      await itemDetailPage.addToCart();
      await expect(itemDetailPage.removeButtonLocator).toBeVisible();

      await itemDetailPage.removeFromCart();
      await expect(itemDetailPage.addToCartButtonLocator).toBeVisible();
      await expect(inventoryPage.cartBadgeLocator).not.toBeVisible();
    },
  );

  test(
    'TC-206 | Back to Products button returns to inventory listing',
    { tag: '@smoke' },
    async ({ itemDetailPage, inventoryPage }) => {
      await itemDetailPage.backToProducts();
      await expect(inventoryPage.titleLocator).toHaveText('Products');
    },
  );
});
