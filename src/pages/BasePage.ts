import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Wait until all Lightning spinners are gone. */
  async waitForSpinnersToClear(timeout = 30_000): Promise<void> {
    const spinners = this.page.locator('lightning-spinner');
    await expect(async () => {
      const count = await spinners.count();
      for (let i = 0; i < count; i++) {
        await expect(spinners.nth(i)).toBeHidden({ timeout: 1_000 });
      }
    }).toPass({ timeout });
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForSpinnersToClear();
  }

  /** Playwright CSS locators pierce open shadow roots, so lightning-input works directly. */
  async fillLightningInput(label: string, value: string): Promise<void> {
    const input = this.page
      .locator('lightning-input')
      .filter({ hasText: label })
      .locator('input')
      .first();
    await input.fill(value);
  }

  async selectLightningCombobox(label: string, optionName: string): Promise<void> {
    const combobox = this.page
      .locator('lightning-combobox')
      .filter({ hasText: label })
      .getByRole('combobox')
      .first();
    await combobox.click();
    await this.page.getByRole('option', { name: optionName, exact: true }).click();
  }

  /** Verify a Lightning toast with the expected text appears. */
  async expectToast(text: string | RegExp): Promise<void> {
    const toast = this.page
      .locator('.forceToastMessage, lightning-toast, .slds-notify--toast')
      .filter({ hasText: text })
      .first();
    await expect(toast).toBeVisible({ timeout: 20_000 });
  }

  protected button(name: string | RegExp): Locator {
    return this.page.getByRole('button', { name, exact: typeof name === 'string' });
  }

  async clickSave(): Promise<void> {
    await this.button('Save').click();
    await this.waitForSpinnersToClear();
  }
}
