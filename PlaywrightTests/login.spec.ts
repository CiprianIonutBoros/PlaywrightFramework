import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { InventoryPage } from './pages/inventory.page';
import { Users } from './data/test-data';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC-001 | Valid credentials redirect to inventory page', async ({ page }) => {
    await loginPage.login(Users.standard.username, Users.standard.password);

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.titleLocator).toHaveText('Products');
  });

  test('TC-002 | Locked-out user receives access denied error', async () => {
    await loginPage.login(Users.lockedOut.username, Users.lockedOut.password);

    await expect(loginPage.errorMessageLocator).toContainText('Sorry, this user has been locked out');
  });

  test('TC-003 | Invalid credentials display authentication error', async () => {
    await loginPage.login('invalid_user', 'wrong_password');

    await expect(loginPage.errorMessageLocator).toContainText(
      'Username and password do not match any user in this service',
    );
  });

  test('TC-004 | Empty username field triggers validation error', async () => {
    await loginPage.login('', Users.standard.password);

    await expect(loginPage.errorMessageLocator).toContainText('Username is required');
  });

  test('TC-005 | Empty password field triggers validation error', async () => {
    await loginPage.login(Users.standard.username, '');

    await expect(loginPage.errorMessageLocator).toContainText('Password is required');
  });
});
