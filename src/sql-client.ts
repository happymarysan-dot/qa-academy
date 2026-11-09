export function sameRows(
  a: { values: unknown[][] },
  b: { values: unknown[][] },
) {
  return JSON.stringify(a.values) === JSON.stringify(b.values);
}
export function executeSql(
  query: string,
): Promise<{ columns: string[]; values: unknown[][] }> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./sql-worker.ts", import.meta.url), {
      type: "module",
    });
    const timer = setTimeout(() => {
      worker.terminate();
      reject(
        Error(
          "Запрос превысил лимит 2 секунды. Упростите JOIN или добавьте фильтры.",
        ),
      );
    }, 2000);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      if (e.data.error) reject(Error(e.data.error));
      else resolve(e.data.result);
    };
    worker.onerror = () => {
      clearTimeout(timer);
      worker.terminate();
      reject(
        Error(
          "Не удалось загрузить локальный SQLite. Проверьте сборку и повторите.",
        ),
      );
    };
    worker.postMessage(query);
  });
}
