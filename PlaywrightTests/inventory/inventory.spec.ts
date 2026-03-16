import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Inventory - Product Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('TC-100 | Inventory page renders all six products', { tag: '@smoke' }, async ({ inventoryPage }) => {
    const count = await inventoryPage.getInventoryItemCount();
    expect(count).toBe(6);
  });

  test('TC-101 | Adding a product updates the cart badge to one', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadgeLocator).toHaveText('1');
  });

  test(
    'TC-102 | Adding multiple products increments the cart badge correctly',
    { tag: '@regression' },
    async ({ inventoryPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
      await inventoryPage.addItemToCartByName('Sauce Labs Onesie');
      await expect(inventoryPage.cartBadgeLocator).toHaveText('3');
    },
  );

  test('TC-103 | Removing a product hides the cart badge', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.removeItemByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadgeLocator).not.toBeVisible();
  });
});

test.describe('Inventory - Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test(
    'TC-110 | Sort by Name (A to Z) returns alphabetical order',
    { tag: '@regression' },
    async ({ inventoryPage }) => {
      await inventoryPage.sortBy('az');
      const names = await inventoryPage.getItemNames();
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    },
  );

  test(
    'TC-111 | Sort by Name (Z to A) returns reverse alphabetical order',
    { tag: '@regression' },
    async ({ inventoryPage }) => {
      await inventoryPage.sortBy('za');
      const names = await inventoryPage.getItemNames();
      const sorted = [...names].sort().reverse();
      expect(names).toEqual(sorted);
    },
  );

  test(
    'TC-112 | Sort by Price (Low to High) returns ascending price order',
    { tag: '@regression' },
    async ({ inventoryPage }) => {
      await inventoryPage.sortBy('lohi');
      const prices = await inventoryPage.getItemPrices();
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    },
  );

  test(
    'TC-113 | Sort by Price (High to Low) returns descending price order',
    { tag: '@regression' },
    async ({ inventoryPage }) => {
      await inventoryPage.sortBy('hilo');
      const prices = await inventoryPage.getItemPrices();
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    },
  );
});

test.describe('Inventory - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test(
    'TC-120 | Clicking a product name opens the product detail page',
    { tag: '@smoke' },
    async ({ inventoryPage, itemDetailPage }) => {
      await inventoryPage.clickItemByName('Sauce Labs Backpack');
      await expect(itemDetailPage.itemNameLocator).toHaveText('Sauce Labs Backpack');
    },
  );

  test('TC-121 | Logout redirects to the login page', { tag: '@smoke' }, async ({ page, inventoryPage }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL(/.*\/$/);
  });

  test('TC-122 | Sidebar "All Items" link returns to inventory', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.clickAllItems();
    await expect(inventoryPage.titleLocator).toHaveText('Products');
  });

  test(
    'TC-123 | Sidebar "About" link navigates to saucelabs.com',
    { tag: '@regression' },
    async ({ page, inventoryPage }) => {
      await inventoryPage.clickAbout();
      await expect(page).toHaveURL('https://saucelabs.com/');
    },
  );

  test('TC-124 | Sidebar "Reset App State" clears the cart', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadgeLocator).toHaveText('1');

    await inventoryPage.resetAppState();
    await expect(inventoryPage.cartBadgeLocator).not.toBeVisible();
  });
});

test.describe('Inventory - Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('TC-130 | Footer displays copyright text', { tag: '@regression' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.footerTextLocator).toContainText('Sauce Labs');
  });

  test('TC-131 | Footer contains Twitter social link', { tag: '@regression' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.twitterLinkLocator).toBeVisible();
  });

  test('TC-132 | Footer contains Facebook social link', { tag: '@regression' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.facebookLinkLocator).toBeVisible();
  });

  test('TC-133 | Footer contains LinkedIn social link', { tag: '@regression' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.linkedinLinkLocator).toBeVisible();
  });
});
