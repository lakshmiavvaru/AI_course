import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  async open(): Promise<void> {
    await this.goto('/lightning/o/Account/list');
    await expect(this.page.getByRole('heading', { name: 'Accounts' }).first()).toBeVisible();
  }

  async createAccount(name: string): Promise<void> {
    await this.page.getByRole('button', { name: 'New', exact: true }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel('Account Name').fill(name);
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await this.expectToast(/Account .* was created/i);
    await this.waitForSpinnersToClear();
  }

  async expectAccountVisible(name: string): Promise<void> {
    await expect(this.page.getByText(name).first()).toBeVisible();
  }
}
