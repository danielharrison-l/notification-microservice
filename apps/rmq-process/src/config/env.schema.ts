import 'dotenv/config';
import z from 'zod';

export const envSchema = z.object({
  RABBITMQ_URL: z.url(),
  RABBITMQ_QUEUE: z.string().min(3).max(100),
});

export type EnvSchema = z.infer<typeof envSchema>;

export const env: EnvSchema = {
  RABBITMQ_URL: process.env.RABBITMQ_URL as string,
  RABBITMQ_QUEUE: process.env.RABBITMQ_QUEUE as string,
};

export const validateEnv = (env: EnvSchema) => {
  if (!env.RABBITMQ_URL || !env.RABBITMQ_QUEUE) {
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
