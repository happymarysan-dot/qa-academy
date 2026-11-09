import { it, expect, vi } from "vitest";
vi.mock("sql.js", async () => {
  const actual = await vi.importActual<typeof import("sql.js")>("sql.js");
  return {
    default: () =>
      actual.default({
        locateFile: () =>
          `${process.cwd()}/node_modules/sql.js/dist/sql-wasm.wasm`,
      }),
  };
});
import { runSql, validateSql, sameRows } from "../src/sql";
import { sqlTasks } from "../src/practice-data";
it.each([
  "DROP TABLE users",
  "SELECT * FROM users; DELETE FROM orders",
  "PRAGMA database_list",
  "WITH RECURSIVE a AS (SELECT 1) SELECT * FROM a",
  "SELECT randomblob(9999999)",
  "SELECT * FROM users -- comment",
])("rejects unsafe training SQL: %s", (q) =>
  expect(() => validateSql(q)).toThrow(),
);
it("runs all twenty-two task solutions in a real SQLite engine", async () => {
  expect(sqlTasks.length).toBeGreaterThanOrEqual(20);
  for (const [name, q] of sqlTasks) {
    const r = await runSql(q);
    expect(r.columns.length, name).toBeGreaterThan(0);
    expect(r.values.length, name).toBeGreaterThan(0);
  }
});
it("finds pending orders", async () =>
  expect((await runSql(sqlTasks[2][1])).values).toEqual([
    [2, 5000],
    [5, 9999],
  ]));
it("detects mismatch and paid-without-payment", async () => {
  expect((await runSql(sqlTasks[15][1])).values).toEqual([[1, 10000, 9000]]);
  expect((await runSql(sqlTasks[16][1])).values).toEqual([[6]]);
});
it("handles LEFT JOIN and NULL", async () => {
  expect((await runSql(sqlTasks[13][1])).values).toEqual([[4]]);
  expect((await runSql(sqlTasks[21][1])).values).toEqual([[6, 5]]);
});
it("compares output values and order, not aliases", () => {
  expect(sameRows({ values: [[1], [2]] }, { values: [[1], [2]] })).toBe(true);
  expect(sameRows({ values: [[2], [1]] }, { values: [[1], [2]] })).toBe(false);
});
it("surfaces syntax errors and remains usable", async () => {
  await expect(runSql("SELECT unknown FROM orders")).rejects.toThrow();
  expect((await runSql("SELECT COUNT(*) FROM orders")).values).toEqual([[6]]);
});
