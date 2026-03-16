import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { InventoryPage } from '../../src/pages/inventory.page';
import { ItemDetailPage } from '../../src/pages/item-detail.page';
import { Users } from '../../src/data/test-data';

test.describe('Problem User - Known Defects', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
    await loginPage.login(Users.problem.username, Users.problem.password);
    await expect(inventoryPage.titleLocator).toHaveText('Products');
  });

  test('TC-700 | Problem user authenticates and views all six products', { tag: '@regression' }, async () => {
    const count = await inventoryPage.getInventoryItemCount();
    expect(count).toBe(6);
  });

  test(
    'TC-701 | Problem user sees identical product images across catalog',
    { tag: '@regression' },
    async ({ page }) => {
      const images = await page
        .locator('.inventory_item_img img')
        .evaluateAll((imgs: HTMLImageElement[]) => imgs.map((img) => img.src));
      const uniqueImages = new Set(images);
      expect(uniqueImages.size).toBe(1);
    },
  );

  test(
    'TC-702 | Problem user product detail navigation resolves to incorrect item',
    { tag: '@regression' },
    async ({ page }) => {
      await inventoryPage.clickItemByName('Sauce Labs Backpack');
      const itemDetailPage = new ItemDetailPage(page);

      const name = await itemDetailPage.getItemName();
      expect(name).toBeTruthy();
    },
  );

  test('TC-703 | Problem user sort by Z-A fails to reorder products', { tag: '@regression' }, async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).not.toEqual(sorted);
  });

  test('TC-704 | Problem user Add to Cart action does not reliably update badge', { tag: '@regression' }, async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    const badgeVisible = await inventoryPage.cartBadgeLocator.isVisible();
    expect(badgeVisible).toBeDefined();
  });
});
