import { type Page, type Locator } from '@playwright/test';
import { LoginMap } from '../PageMaps/login.map';

export class LoginPage {
  private readonly map: LoginMap;

  constructor(private readonly page: Page) {
    this.map = new LoginMap(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.map.usernameInput.fill(username);
    await this.map.passwordInput.fill(password);
    await this.map.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.map.errorMessage.innerText();
  }

  get errorMessageLocator(): Locator {
    return this.map.errorMessage;
  }
}
