import { test } from '../../src/fixtures/baseTest';
import leadData from '../../src/data/leadData.json';

test.describe('Lead creation @smoke @sales-cloud', () => {
  // Equivalent of @BeforeSuite / @AfterSuite scope for this file
  test.beforeAll(async () => {
    console.log('Lead creation suite starting');
  });

  test.afterAll(async () => {
    console.log('Lead creation suite finished');
  });

  test.beforeEach(async ({ leadPage }) => {
    await leadPage.open();
  });

  test.afterEach(async ({}, testInfo) => {
    console.log(`Finished: ${testInfo.title} (${testInfo.status})`);
  });

  // Equivalent of @DataProvider
  for (const lead of leadData) {
    test(`create lead ${lead.firstName} ${lead.lastName} @smoke`, async ({ leadPage }) => {
      const uniqueLast = `${lead.lastName}${Date.now()}`;
      await leadPage.createLead({ ...lead, lastName: uniqueLast });
      await leadPage.expectLeadName(`${lead.firstName} ${uniqueLast}`);
    });
  }
});
