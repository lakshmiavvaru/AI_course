import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OpportunityPage extends BasePage {
  async open(): Promise<void> {
    await this.goto('/lightning/o/Opportunity/list');
    await expect(this.page.getByRole('heading', { name: 'Opportunities' }).first()).toBeVisible();
  }

  async expectOpportunityVisible(name: string): Promise<void> {
    await expect(this.page.getByText(name).first()).toBeVisible();
  }
}
