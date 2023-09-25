import * as dotenv from 'dotenv';
import {
  EnvError,
  bool,
  cleanEnv,
  json,
  makeValidator,
  num,
  port,
  str,
} from 'envalid';

dotenv.config();

const pemKeys = makeValidator((input: string): string => {
  if (
    typeof input === 'string' &&
    input.length > 0 &&
    input.startsWith('-----BEGIN ')
  ) {
    return input.replace(/\\n/g, '\n');
  }

  throw new EnvError(`Not a valid PEM key.`);
});

const env = cleanEnv(process.env, {
  HOST: str({ default: undefined }),
  PORT: port({ default: 3001 }),
  API_URL: str({ default: '/' }),
  FRONTEND_URL: str({ default: '/' }),

  APP_VERSION: str({ default: 'v0.0.0', devDefault: 'local' }),
  //   APP_ENV: str({
  //     default: 'unknown',
  //     devDefault: 'local',
  //     choices: ['local', 'production'],
  //   }),

  INTERNAL_API_TOKEN: str({ default: '', devDefault: '' }),

  SWAGGER_ENABLED: bool({ default: false, devDefault: true }),
  CORS: bool({ default: true, devDefault: true }),

  POSTGRES_URL: str(),
  // POSTGRES_SSL_CA: pemKeys({ default: '', devDefault: '' }),
  ORM_LOGGING_ENABLED: json({ default: false, devDefault: false }),
  ORM_AUTO_MIGRATION: bool({ default: true, devDefault: true }),
  ORM_SYNCHRONIZE: bool({ default: false, devDefault: false }),

  JWT_PRIVATE_KEY: pemKeys(),
  JWT_PUBLIC_KEY: pemKeys(),

  MAIL_DRIVER: str({ default: 'smtp' }),
  MAIL_HOST: str(),
  MAIL_PORT: num({ devDefault: 1025 }),
  MAIL_USERNAME: str(),
  MAIL_PASSWORD: str(),
  MAIL_IGNORE_TLS: bool({ default: false }),
  MAIL_SECURE: bool({ default: true }),
  MAIL_FROM_NAME: str(),
  MAIL_FROM_EMAIL: str(),

  S3_KEY: str({ default: undefined }),
  S3_SECRET: str({ default: undefined }),
  S3_BUCKET: str({ default: undefined }),
  S3_REGION: str({ default: 'us-east-1' }),
});

const _AppConfig = () => ({ ...env } as const);

const CONFIG = _AppConfig();
export const AppConfig = () => CONFIG;
