import { z } from "zod";

export const envSchema = z.object({
  COIN_KEY: z.string(),
});
