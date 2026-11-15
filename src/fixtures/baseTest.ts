import { test as base, expect } from '@playwright/test';
import { LeadPage } from '../pages/LeadPage';
import { AccountPage } from '../pages/AccountPage';
import { OpportunityPage } from '../pages/OpportunityPage';
import { AppLauncher } from '../components/AppLauncher';
import { logger } from '../utils/logger';

type Fixtures = {
  leadPage: LeadPage;
  accountPage: AccountPage;
  opportunityPage: OpportunityPage;
  appLauncher: AppLauncher;
  lifecycle: void;
};

export const test = base.extend<Fixtures>({
  leadPage: async ({ page }, use) => use(new LeadPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  opportunityPage: async ({ page }, use) => use(new OpportunityPage(page)),
  appLauncher: async ({ page }, use) => use(new AppLauncher(page)),

  // Auto fixture: equivalent of @BeforeMethod / @AfterMethod
  lifecycle: [
    async ({}, use, testInfo) => {
      logger.info(`START: ${testInfo.title}`);
      await use();
      logger.info(`END: ${testInfo.title} -> ${testInfo.status}`);
    },
    { auto: true },
  ],
});

export { expect };
