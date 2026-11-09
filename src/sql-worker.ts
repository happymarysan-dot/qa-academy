import { runSql } from "./sql";
self.onmessage = async (e: MessageEvent<string>) => {
  try {
    self.postMessage({ result: await runSql(e.data) });
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
