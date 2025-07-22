import 'dotenv/config';
import z from 'zod';

export const envSchema = z.object({
  RABBITMQ_URL: z.url(),
  RABBITMQ_QUEUE: z.string().min(3).max(100),
  WHATSAPP_ACCESS_TOKEN: z.string().min(10),
  WHATSAPP_API_URL: z.url(),
  WHATSAPP_API_VERSION: z.string(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(10),
});

export type EnvSchema = z.infer<typeof envSchema>;

export const env: EnvSchema = {
  RABBITMQ_URL: process.env.RABBITMQ_URL as string,
  RABBITMQ_QUEUE: process.env.RABBITMQ_QUEUE as string,
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN as string,
  WHATSAPP_API_URL: process.env.WHATSAPP_API_URL as string,
  WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION as string,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID as string,
};

const isEnvValid = Object.values(env).every(
  (value) => value !== undefined && value !== '',
);

export const validateEnv = (env: EnvSchema) => {
  if (!isEnvValid) {
    console.error('ERROR: Missing required environment variables!');
    process.exit(1);
  }

  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error('Environment validation failed:', result.error.format());
    process.exit(1);
  }

  console.log('Environment variables validated successfully!');
  return result.data;
};

validateEnv(env);
