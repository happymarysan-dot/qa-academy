import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
test("all twelve modules, navigation, local persistence and privacy", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Практика. Понимание/ }),
  ).toBeVisible();
  for (let i = 1; i <= 12; i++) {
    await page.goto(`/#module/${i}`);
    await expect(page.getByRole("tab", { name: "Уроки · 6" })).toBeVisible();
    await expect(page.locator(".lesson-nav button")).toHaveCount(6);
    await page
      .getByRole("tab", { name: /Проверка · 10|Финальная оценка/ })
      .click();
    await expect(page.locator("fieldset")).toHaveCount(i === 12 ? 21 : 10);
    await page.getByRole("tab", { name: "Практикум", exact: true }).click();
    await expect(page.locator("#module-panel")).not.toBeEmpty();
  }
  await page.goto("/#module/1");
  await page
    .getByPlaceholder("Что проверяю → данные → ожидаемый результат → риск")
    .fill("Boundary review");
  await page.getByRole("button", { name: "Добавить закладку" }).click();
  await page.getByRole("button", { name: "Отметить урок пройденным" }).click();
  await page.reload();
  await page.goto("/#bookmarks");
  await expect(page.getByRole("heading", { name: /SDLC, STLC/ })).toBeVisible();
  await page.goto("/#privacy");
  await expect(
    page.getByRole("heading", { name: "Хранилище — не шифрование" }),
  ).toBeVisible();
});
test("SQLite worker executes and grades locally; no external requests", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:3000") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await page.goto("/#module/4/practice");
  await page.getByLabel(/Задание 1/).selectOption("2");
  await page
    .getByLabel("Ваш SQL")
    .fill(
      "SELECT id,total_cents FROM orders WHERE status='pending' ORDER BY id",
    );
  await page.getByRole("button", { name: "Проверить задание" }).click();
  await expect(page.getByRole("status")).toContainText("Верно", {
    timeout: 10000,
  });
  await expect(page.locator("tbody tr")).toHaveCount(2);
  expect(external).toEqual([]);
});
test("registration prediction and checkout double submission", async ({
  page,
}) => {
  await page.goto("/#module/2/practice");
  await page.getByLabel("Возраст", { exact: true }).fill("17");
  await page.getByLabel("Мой прогноз").selectOption("error");
  await page.getByRole("button", { name: "Выполнить проверку" }).click();
  await expect(page.getByRole("status")).toContainText("Прогноз верный");
  await page.goto("/#module/9/practice");
  await page.getByRole("button", { name: "Pay · test key order-1" }).click();
  await page.getByRole("button", { name: "Pay · test key order-1" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Списаний в этой корзине: 1",
  );
});
test("quiz scoring and saved attempt", async ({ page }) => {
  await page.goto("/#module/1");
  await page.getByRole("tab", { name: "Проверка · 10" }).click();
  const correct = [0, 1, 2, 0, 1, 2, 0, 0, [0, 1], 1];
  for (let i = 0; i < 10; i++) {
    const field = page.locator("fieldset").nth(i);
    for (const j of Array.isArray(correct[i])
      ? (correct[i] as number[])
      : [correct[i] as number])
      await field.locator("input").nth(j).check();
  }
  await page.getByRole("button", { name: "Проверить ответы" }).click();
  await expect(page.locator(".score")).toHaveText("10 / 10");
  await page.reload();
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem("qa-academy-v1")!).attempts,
  );
  expect(saved[0].score).toBe(10);
});
test("mobile layout and theme", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.getByRole("link", { name: /Программа/ }).click();
  await expect(
    page.getByRole("heading", { name: "Программа обучения" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Светлая тема" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
test("backup export, reset, restore and invalid import", async ({ page }) => {
  await page.goto("/#module/1");
  await page
    .getByPlaceholder("Что проверяю → данные → ожидаемый результат → риск")
    .fill("Backup evidence");
  await page.goto("/#privacy");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Экспорт JSON" }).click();
  const file = await downloaded;
  const path = await file.path();
  expect(path).toBeTruthy();
  await page.getByRole("button", { name: "Сбросить данные…" }).click();
  await page.getByRole("button", { name: "Да, удалить мой прогресс" }).click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("qa-academy-v1")!).notes,
    ),
  ).toEqual({});
  await page.locator("input[type=file]").setInputFiles(path!);
  await expect(page.getByRole("status")).toContainText("восстановлен");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("qa-academy-v1")!).notes["1-1"],
    ),
  ).toBe("Backup evidence");
  await page.locator("input[type=file]").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole("status")).toContainText("отклонён");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("qa-academy-v1")!).notes["1-1"],
    ),
  ).toBe("Backup evidence");
});
test("flashcard recall, plan, search and interview self-rating", async ({
  page,
}) => {
  await page.goto("/#flashcards");
  await page.getByRole("button", { name: "Открыть объяснение" }).click();
  await page.getByRole("button", { name: "Помню", exact: true }).click();
  expect(
    await page.evaluate(
      () =>
        Object.keys(JSON.parse(localStorage.getItem("qa-academy-v1")!).cards)
          .length,
    ),
  ).toBe(1);
  await page.goto("/#plan");
  await page.locator(".plan-check input").first().check();
  await expect(
    page.getByRole("heading", { name: "1 из 14 шагов" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Поиск по всем урокам" })
    .fill("idempotency");
  await expect(page.locator(".result").first()).toBeVisible();
  await page.getByRole("button", { name: "Очистить поиск" }).click();
  await page.goto("/#interview");
  await page.getByRole("button", { name: "Начать интервью" }).click();
  await expect(
    page.getByText("MODEL ANSWER · ADAPT TO YOUR ACTUAL EXPERIENCE"),
  ).toHaveCount(0);
  await page
    .getByLabel("Your answer in English")
    .fill(
      "I would clarify the contract, test boundary cases and report the remaining risks.",
    );
  await page
    .getByRole("button", { name: "Отправить и открыть разбор" })
    .click();
  await expect(
    page.getByText("MODEL ANSWER · ADAPT TO YOUR ACTUAL EXPERIENCE"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Сохранить 0/8" }).click();
  await expect(
    page.getByRole("button", { name: "Самооценка сохранена" }),
  ).toBeDisabled();
});
test("mock network, requirements, game and simulated browser exercises", async ({
  page,
}) => {
  await page.goto("/#module/5/practice");
  await page.getByLabel(/Какой запрос/).selectOption("500");
  await page.getByRole("button", { name: "Проверить гипотезу" }).click();
  await expect(page.locator(".feedback")).toContainText("Верно.");
  await page.goto("/#module/7/practice");
  for (let i = 0; i < 3; i++)
    await page.locator(".option input").nth(i).check();
  await page.getByRole("button", { name: "Проверить анализ" }).click();
  await expect(page.locator(".feedback")).toContainText("Верно.");
  await page
    .getByLabel("Матрица AC → Case → Expected → риск")
    .fill("AC-1 | TC-1 | 90 EUR | 15");
  await page.reload();
  await expect(
    page.getByLabel("Матрица AC → Case → Expected → риск"),
  ).toHaveValue("AC-1 | TC-1 | 90 EUR | 15");
  await page.goto("/#module/8/practice");
  await page.getByRole("button", { name: "Move right" }).click();
  await page.getByRole("button", { name: "Move right" }).click();
  await page.getByLabel("Jump при следующем движении").check();
  await page.getByRole("button", { name: "Move right" }).click();
  await expect(page.getByRole("status")).toContainText("STUCK");
  await page.getByRole("button", { name: "Reset build" }).click();
  await expect(page.getByRole("status")).toContainText("ready");
  await page.goto("/#module/10/practice");
  await page.getByRole("button", { name: "1 · goto" }).click();
  await page.getByRole("button", { name: "2 · locate" }).click();
  await page.getByRole("button", { name: "3 · assert" }).click();
  await expect(page.getByRole("status")).toContainText("PASS (simulation)");
});

test("bug builder exports, test run persistence and portfolio kit", async ({
  page,
}) => {
  await page.goto("/#module/6/practice");
  const data = {
    Заголовок: "Cart: no discount at 100 EUR",
    "Среда и build": "Local training build 1.0",
    Предусловия: "Empty cart and inclusive discount",
    Шаги: "Add two items at 50 EUR each, open cart",
    "Expected result": "Subtotal should be 90 EUR",
    "Actual result": "Subtotal remains 100 EUR",
    "Частота воспроизведения": "3/3 attempts",
    "Evidence (без секретов)": "Educational fixture only",
  };
  for (const [label, value] of Object.entries(data))
    await page.getByLabel(label, { exact: true }).fill(value);
  await page
    .getByRole("combobox", { name: "Severity", exact: true })
    .selectOption("High");
  await page.getByRole("button", { name: "Проверить структуру" }).click();
  await expect(page.getByRole("status")).toContainText("8/8");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Markdown", exact: true }).click();
  const bugFile = await download;
  expect(bugFile.suggestedFilename()).toBe("training-bug.md");
  const bugText = await readFile((await bugFile.path())!, "utf8");
  expect(bugText).toContain("## Заголовок\nCart:");
  expect(bugText).not.toContain("\\n");
  await page.getByLabel("Статус TC-2").selectOption("Failed");
  await page.reload();
  await expect(page.getByLabel("Статус TC-2")).toHaveValue("Failed");
  await page.goto("/#module/12/practice");
  await expect(page.locator("tbody tr")).toHaveCount(18);
  const portfolio = page.waitForEvent("download");
  await page.getByRole("button", { name: "Cases CSV" }).click();
  const csvFile = await portfolio;
  expect(csvFile.suggestedFilename()).toBe("qa-test-cases.csv");
  const csvText = await readFile((await csvFile.path())!, "utf8");
  expect(csvText.trim().split("\n")).toHaveLength(19);
});
