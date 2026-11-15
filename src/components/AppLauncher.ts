import { Page, expect } from '@playwright/test';

export class AppLauncher {
  constructor(private readonly page: Page) {}

  async openApp(appName: string): Promise<void> {
    await this.page.getByRole('button', { name: 'App Launcher' }).click();
    const search = this.page.getByPlaceholder('Search apps and items...');
    await search.fill(appName);
    await this.page.getByRole('option', { name: appName }).first().click();
    await expect(this.page).toHaveURL(/\/lightning\//);
  }

  async openItem(itemName: string): Promise<void> {
    await this.page.getByRole('button', { name: 'App Launcher' }).click();
    await this.page.getByRole('button', { name: 'View All' }).click();
    await this.page.getByPlaceholder('Search apps and items...').fill(itemName);
    await this.page.getByRole('option', { name: itemName }).first().click();
    await expect(this.page).toHaveURL(/\/lightning\//);
  }
}
