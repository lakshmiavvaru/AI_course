import dotenv from 'dotenv';

dotenv.config();

const REQUIRED = ['SF_BASE_URL', 'SF_LOGIN_URL', 'SF_USERNAME', 'SF_PASSWORD'] as const;

const missing = REQUIRED.filter((key) => !process.env[key] || process.env[key]!.trim() === '');
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}. ` +
      `Copy .env.example to .env and fill in your Salesforce org details.`
  );
}

const authType = (process.env.SF_AUTH_TYPE ?? 'STANDARD').toUpperCase();
if (authType !== 'STANDARD' && authType !== 'SSO') {
  throw new Error(`SF_AUTH_TYPE must be "STANDARD" or "SSO", received "${authType}".`);
}

export const ENV = {
  testEnv: process.env.TEST_ENV ?? 'trial',
  baseUrl: process.env.SF_BASE_URL!.replace(/\/+$/, ''),
  loginUrl: process.env.SF_LOGIN_URL!.replace(/\/+$/, ''),
  username: process.env.SF_USERNAME!,
  password: process.env.SF_PASSWORD!,
  mfaSecret: process.env.SF_MFA_SECRET ?? '',
  authType: authType as 'STANDARD' | 'SSO',
  ssoIdpUrl: process.env.SSO_IDP_URL ?? '',
} as const;

export const AUTH_FILE = 'playwright/.auth/user.json';
