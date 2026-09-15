const isProduction = process.env.NODE_ENV === 'production';

const developmentSecret = 'nexora-development-secret-change-me';

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production.');
}

export const JWT_SECRET = process.env.JWT_SECRET || developmentSecret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const configuredRounds = Number.parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
export const BCRYPT_ROUNDS = Number.isInteger(configuredRounds)
  ? Math.min(Math.max(configuredRounds, 10), 15)
  : 12;
