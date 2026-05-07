import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
});

if (!parsedEnv.success) {
  throw new Error(
    "Falta configurar DATABASE_URL. Crea un archivo .env.local en la raiz con DATABASE_URL=\"postgresql://usuario:password@localhost:5432/biblioteca\"",
  );
}

export const env = parsedEnv.data;
