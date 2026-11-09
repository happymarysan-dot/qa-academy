import initSqlJs from "sql.js";
import type { Database } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
const engine = initSqlJs({ locateFile: () => wasmUrl });
const seed = `PRAGMA foreign_keys=ON;
CREATE TABLE users(id INTEGER PRIMARY KEY,email TEXT,country TEXT);
CREATE TABLE orders(id INTEGER PRIMARY KEY,user_id INTEGER REFERENCES users(id),status TEXT,total_cents INTEGER);
CREATE TABLE products(id INTEGER PRIMARY KEY,name TEXT,price_cents INTEGER);
CREATE TABLE payments(id INTEGER PRIMARY KEY,order_id INTEGER REFERENCES orders(id),status TEXT,amount_cents INTEGER);
INSERT INTO users VALUES(1,'alex@example.test','PL'),(2,'dana@example.test','PL'),(3,'sam@example.test','DE'),(4,'jo@example.test','UK');
INSERT INTO orders VALUES(1,1,'paid',10000),(2,1,'pending',5000),(3,2,'paid',20000),(4,3,'cancelled',3000),(5,NULL,'pending',9999),(6,2,'paid',4000);
INSERT INTO products VALUES(1,'Keyboard',5000),(2,'Mouse',2500),(3,'Monitor',20000);
INSERT INTO payments VALUES(1,1,'succeeded',9000),(2,3,'succeeded',20000),(3,4,'failed',3000),(4,2,'pending',5000);`;
export function validateSql(query: string) {
  const trimmed = query.trim().replace(/;\s*$/, "");
  if (
    trimmed.length > 4000 ||
    !/^(SELECT\b|WITH\b)/i.test(trimmed) ||
    /[;]|--|\/\*|\b(insert|update|delete|drop|alter|attach|detach|pragma|create|replace|vacuum|recursive|load_extension|randomblob|zeroblob)\b/i.test(
      trimmed,
    )
  )
    throw Error(
      "Учебный режим: один SELECT/WITH, без комментариев, recursive CTE, записей и опасных функций. Максимум 4000 символов.",
    );
  return trimmed;
}
export async function runSql(query: string) {
  const clean = validateSql(query);
  const SQL = await engine;
  const db: Database = new SQL.Database();
  try {
    db.run(seed);
    const result = db.exec(clean)[0];
    if (!result) return { columns: [], values: [] };
    if (result.values.length > 500)
      throw Error("Результат больше 500 строк: добавьте LIMIT.");
    return { columns: result.columns, values: result.values };
  } finally {
    db.close();
  }
}
export function sameRows(
  a: { values: unknown[][] },
  b: { values: unknown[][] },
) {
  return JSON.stringify(a.values) === JSON.stringify(b.values);
}
