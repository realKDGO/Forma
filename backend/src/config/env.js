import "dotenv/config";
import { z } from "zod";
const schema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(10),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});
const result = schema.safeParse(process.env);
if (!result.success) {
  console.error("Invalid server environment configuration.");
  process.exit(1);
}
Object.assign(process.env, result.data);
