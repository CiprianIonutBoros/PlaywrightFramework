import { test, expect } from './fixtures/test-fixtures';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test(
    'TC-300 | Cart displays all added products with correct names',
    { tag: '@smoke' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
      await inventoryPage.goToCart();

      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toContain('Sauce Labs Backpack');
      expect(cartItems).toContain('Sauce Labs Bike Light');
      expect(await cartPage.getCartItemCount()).toBe(2);
    },
  );

  test(
    'TC-301 | Cart items display a valid price format',
    { tag: '@regression' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.goToCart();

      const prices = await cartPage.getCartItemPrices();
      expect(prices.length).toBe(1);
      expect(prices[0]).toContain('$');
    },
  );

  test(
    'TC-302 | Each cart item defaults to a quantity of one',
    { tag: '@regression' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.goToCart();

      const quantity = await cartPage.getItemQuantity('Sauce Labs Backpack');
      expect(quantity).toBe('1');
    },
  );

  test(
    'TC-303 | Removing the only cart item results in an empty cart',
    { tag: '@smoke' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.goToCart();

      await cartPage.removeItemByName('Sauce Labs Backpack');
      expect(await cartPage.getCartItemCount()).toBe(0);
    },
  );

  test(
    'TC-304 | Removing one item retains remaining items in cart',
    { tag: '@regression' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
      await inventoryPage.goToCart();

      await cartPage.removeItemByName('Sauce Labs Backpack');

      expect(await cartPage.getCartItemCount()).toBe(1);
      const remaining = await cartPage.getCartItemNames();
      expect(remaining).toContain('Sauce Labs Bike Light');
    },
  );

  test(
    'TC-305 | Continue Shopping button returns to inventory page',
    { tag: '@smoke' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.goToCart();
      await cartPage.continueShopping();

      await expect(inventoryPage.titleLocator).toHaveText('Products');
    },
  );

  test(
    'TC-306 | Cart page renders the correct page title',
    { tag: '@regression' },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.goToCart();
      await expect(cartPage.titleLocator).toHaveText('Your Cart');
    },
  );
});
