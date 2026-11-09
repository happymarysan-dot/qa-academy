import process from "node:process";
import console from "node:console";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
const cli = require.resolve("@playwright/test/cli");
const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    PLAYWRIGHT_BROWSERS_PATH:
      process.env.PLAYWRIGHT_BROWSERS_PATH || resolve(".browsers"),
  },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
