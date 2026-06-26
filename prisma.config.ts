import { defineConfig, env } from "@prisma/config";
import { config } from "dotenv";

config(); // load .env into process.env before env() is called

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
