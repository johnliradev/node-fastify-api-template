import "dotenv/config";
import z, { treeifyError } from "zod";

const _env = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .min(1, ".env is invalid: PORT not defined")
    .transform(Number),
  HOST: z.string().default("0.0.0.0"),
});

function validateEnv() {
  const _parsed = _env.safeParse(process.env);
  if (!_parsed.success) {
    console.error(
      "Invalid environment variables",
      treeifyError(_parsed.error).properties
    );
    throw new Error("Invalid environment variables");
  }
  return _parsed.data;
}
export const env = validateEnv();
