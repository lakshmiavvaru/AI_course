import { test as setup, expect, Page } from '@playwright/test';
import * as OTPAuth from 'otpauth';
import { ENV, AUTH_FILE } from '../config/env.config';
import { logger } from '../utils/logger';

function generateTotp(secret: string): string {
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secret.replace(/\s+/g, '')),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });
  return totp.generate();
}

async function solveMfaIfPrompted(page: Page): Promise<void> {
  const codeInput = page
    .getByLabel(/verification code|authenticator code|enter code/i)
    .or(page.locator('input#tc'))
    .first();

  try {
    await codeInput.waitFor({ state: 'visible', timeout: 10_000 });
  } catch {
    logger.info('No MFA prompt displayed.');
    return;
  }

  if (!ENV.mfaSecret) {
    throw new Error('MFA prompt displayed but SF_MFA_SECRET is not set.');
  }
  logger.info('MFA prompt detected, submitting TOTP code.');
  await codeInput.fill(generateTotp(ENV.mfaSecret));
  await page
    .getByRole('button', { name: /verify|submit|sign in|log in/i })
    .first()
    .click();
}

async function standardLogin(page: Page): Promise<void> {
  await page.goto(ENV.loginUrl);
  await page.getByLabel(/username/i).fill(ENV.username);
  await page.getByLabel(/password/i).fill(ENV.password);
  await page.getByRole('button', { name: /log in/i }).click();
}

async function ssoLogin(page: Page): Promise<void> {
  if (!ENV.ssoIdpUrl) {
    throw new Error('SF_AUTH_TYPE=SSO requires SSO_IDP_URL to be set.');
  }
  await page.goto(ENV.loginUrl);
  const ssoButton = page.getByRole('link', { name: /custom domain|single sign|sso/i })
    .or(page.getByRole('button', { name: /custom domain|single sign|sso/i }))
    .first();
  if (await ssoButton.isVisible().catch(() => false)) {
    await ssoButton.click();
  } else {
    await page.goto(ENV.ssoIdpUrl);
  }
  await page.getByLabel(/username|email|user name/i).first().fill(ENV.username);
  const next = page.getByRole('button', { name: /next|continue/i }).first();
  if (await next.isVisible().catch(() => false)) {
    await next.click();
  }
  await page.getByLabel(/password/i).first().fill(ENV.password);
  await page.getByRole('button', { name: /sign in|log in|submit|verify/i }).first().click();
}

setup('authenticate and save session state', async ({ page }) => {
  setup.setTimeout(120_000);
  logger.info(`Authenticating against ${ENV.loginUrl} using ${ENV.authType} login.`);

  if (ENV.authType === 'SSO') {
    await ssoLogin(page);
  } else {
    await standardLogin(page);
  }

  await solveMfaIfPrompted(page);

  await page.waitForURL(/\/lightning\//, { timeout: 90_000 });
  await expect(page).toHaveURL(/\/lightning\//);

  await page.context().storageState({ path: AUTH_FILE });
  logger.info(`Session saved to ${AUTH_FILE}.`);
});
