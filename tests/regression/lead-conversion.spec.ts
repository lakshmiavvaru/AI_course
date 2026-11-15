import { test } from '../../src/fixtures/baseTest';
import leadData from '../../src/data/leadData.json';

test.describe('Lead conversion @regression @e2e @sales-cloud', () => {
  test('create and convert a lead @regression @e2e', async ({ leadPage }) => {
    const lead = leadData[0];
    const uniqueLast = `${lead.lastName}Conv${Date.now()}`;

    await leadPage.open();
    await leadPage.createLead({ ...lead, lastName: uniqueLast });
    await leadPage.expectLeadName(`${lead.firstName} ${uniqueLast}`);
    await leadPage.convertLead();
    await leadPage.closeConversionDialog();
  });
});
