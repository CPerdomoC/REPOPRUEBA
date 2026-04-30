import { Pool } from "pg";
import { env } from "@/core/env";

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});
