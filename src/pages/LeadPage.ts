import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface LeadInput {
  salutation?: string;
  firstName: string;
  lastName: string;
  company: string;
  email?: string;
}

export class LeadPage extends BasePage {
  async open(): Promise<void> {
    await this.goto('/lightning/o/Lead/list');
    await expect(this.page.getByRole('heading', { name: 'Leads' }).first()).toBeVisible();
  }

  async clickNew(): Promise<void> {
    await this.page.getByRole('button', { name: 'New', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: /New Lead/i })).toBeVisible();
  }

  async createLead(lead: LeadInput): Promise<void> {
    await this.clickNew();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel('First Name').fill(lead.firstName);
    await dialog.getByLabel('Last Name').fill(lead.lastName);
    await dialog.getByLabel('Company').fill(lead.company);
    if (lead.email) {
      await dialog.getByLabel('Email').fill(lead.email);
    }
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await this.expectToast(/Lead .* was created/i);
    await this.waitForSpinnersToClear();
  }

  async expectLeadName(fullName: string): Promise<void> {
    await expect(
      this.page.locator('lightning-formatted-name').filter({ hasText: fullName }).first()
    ).toBeVisible();
  }

  async convertLead(): Promise<void> {
    await this.page.getByRole('button', { name: 'Convert', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: /Convert Lead/i })).toBeVisible();
    await this.page.getByRole('button', { name: 'Convert', exact: true }).last().click();
    await expect(this.page.getByRole('heading', { name: /Your lead has been converted/i })).toBeVisible({
      timeout: 30_000,
    });
  }

  async closeConversionDialog(): Promise<void> {
    await this.page.getByRole('button', { name: 'Go to Leads' }).click();
  }
}
