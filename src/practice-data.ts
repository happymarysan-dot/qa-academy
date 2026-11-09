export const interviewTopics: [string, string, string][] = [
  [
    "Tell me about yourself.",
    "I have hands-on experience in manual web and game QA, including E2E checks, test documentation and bug reporting. I use Jira, test management tools and browser debugging tools. I am strengthening API testing, SQL and introductory Playwright skills.",
    "Кратко свяжите опыт с целью; не добавляйте коммерческую автоматизацию.",
  ],
  [
    "Why are you changing roles?",
    "I am looking for a role where I can build on my manual QA experience and deepen API, SQL and requirements analysis skills. I value clear ownership and collaboration.",
    "Говорите о развитии, без критики прежних команд.",
  ],
  [
    "What is the difference between verification and validation?",
    "Verification checks whether a product meets its specification. Validation checks whether it meets user needs. A feature can match a specification and still solve the wrong problem.",
    "Нужны оба ракурса качества.",
  ],
  [
    "Explain smoke versus regression testing.",
    "Smoke testing checks whether a build is suitable for further testing. Regression testing checks that changes have not broken existing behavior. The scope depends on risk and the change.",
    "Добавьте пример checkout.",
  ],
  [
    "How do severity and priority differ?",
    "Severity describes impact; priority describes urgency. A visible typo before a campaign can have low severity but high priority. I would agree the priority with the team.",
    "Не сводите одно к другому.",
  ],
  [
    "What would you do if a developer disagrees with a bug?",
    "I would reproduce it, show evidence and compare the result with the agreed requirements. If the expected behavior is unclear, I would involve the product owner and document the decision.",
    "Факты вместо конфликта.",
  ],
  [
    "You have one hour to test a release. What do you do?",
    "I would identify changed areas and high-impact risks, run a smoke check and prioritize critical user paths such as payments. I would report what was not tested and the remaining risks.",
    "Не обещайте полное покрытие.",
  ],
  [
    "How would you test a login form?",
    "I would clarify the rules and test valid and invalid credentials, empty fields, lockout, session expiry, role access, error handling and keyboard access. I would also check network responses in an authorized test environment.",
    "Начинайте с требований и рисков.",
  ],
  [
    "How would you test a payment feature?",
    "I would check amounts, currency, rounding, successful and declined payments, timeouts, retries with idempotency keys, callbacks and reconciliation. I would use sandbox data and verify that duplicate actions do not duplicate charges.",
    "Согласованность важнее только UI.",
  ],
  [
    "What is the difference between HTTP 401 and 403?",
    "401 means valid authentication is missing. 403 means access is forbidden under the authorization rules. I would test an expired token separately from a valid user with insufficient permissions.",
    "Уточните контракт конкретного API.",
  ],
  [
    "What do you test in an API response?",
    "I check the status, relevant headers, schema, field types and business values. I also test error responses, authorization, pagination and side effects rather than relying on status 200 alone.",
    "Схема и бизнес-правила обязательны.",
  ],
  [
    "Explain INNER JOIN and LEFT JOIN.",
    "INNER JOIN returns matching rows. LEFT JOIN preserves every row from the left table and uses NULL for missing right-side values. I can use a LEFT JOIN to find users without orders.",
    "Можно показать ON и IS NULL.",
  ],
  [
    "Do you have commercial automation experience?",
    "I have manual QA experience and CI/CD exposure. I am learning Playwright through local exercises, but I have not maintained a production automation framework. I can explain the tests I have actually written.",
    "Честное ограничение — часть сильного ответа.",
  ],
  [
    "Are you ready for remote B2B work?",
    "I am comfortable with written updates, reproducible reports and agreed overlap hours. I would clarify responsibilities, access requirements, communication and contractual terms before starting.",
    "Не обещайте 24/7 и юридические гарантии.",
  ],
  [
    "What makes a good bug report?",
    "A clear report includes the environment and build, preconditions, minimal reproduction steps, expected and actual results, impact, frequency and relevant evidence without sensitive data.",
    "Укажите измеримую воспроизводимость.",
  ],
  [
    "What is exploratory testing?",
    "It combines learning, test design and execution. I use a timeboxed charter, record observations and risks, and turn important findings into reproducible reports or reusable checks.",
    "Это не случайные клики.",
  ],
  [
    "How do you test a boundary of 18 to 65?",
    "For integer ages I would test 17, 18, 19, 64, 65 and 66, plus empty and non-numeric inputs. I would confirm whether both bounds are inclusive.",
    "Уточните формат и границы.",
  ],
  [
    "What is equivalence partitioning?",
    "It divides inputs into groups expected to behave similarly. I select representatives from valid and invalid groups and combine this with boundary tests.",
    "Пример: возраст ниже, внутри и выше диапазона.",
  ],
  [
    "What is a decision table useful for?",
    "It makes combinations of conditions and their outcomes explicit. For registration I can combine age validity, email uniqueness and password length to check every relevant rule.",
    "Не забывайте невозможные комбинации.",
  ],
  [
    "What does pairwise testing guarantee?",
    "It covers every pair of parameter values in the chosen model. It does not guarantee coverage of all triples or replace critical end-to-end checks.",
    "Назовите ограничение метода.",
  ],
  [
    "How do you test state transitions?",
    "I identify states, events, guards and allowed transitions, then test valid and forbidden transitions. For example, a cancelled order should not become paid without an explicit business rule.",
    "Проверяйте историю событий.",
  ],
  [
    "What is idempotency?",
    "Repeating an operation has the same intended effect as performing it once. A repeated DELETE can return a different status while still being idempotent. Payments often need an idempotency key.",
    "Эффект, а не идентичный ответ.",
  ],
  [
    "PUT versus PATCH?",
    "PUT generally replaces a resource representation and is idempotent by semantics. PATCH applies a partial change and may or may not be idempotent depending on the operation.",
    "Не называйте любой PATCH идемпотентным.",
  ],
  [
    "How would you test pagination?",
    "I would check first, middle, last and empty pages, limits, invalid parameters and stable ordering. I would verify that records are neither duplicated nor skipped under the defined data model.",
    "Учитывайте изменение данных.",
  ],
  [
    "What would you check for HTTP 429?",
    "I would verify the documented limit and error body, inspect Retry-After if provided, and check that the client backs off rather than retrying aggressively.",
    "Нагрузку создавайте только с разрешением.",
  ],
  [
    "Authentication versus authorization?",
    "Authentication establishes identity. Authorization determines allowed actions and resources. A valid login must not grant access to another user’s private order.",
    "Приведите object-level проверку.",
  ],
  [
    "What is an API contract?",
    "It defines requests, responses, field types, required values and error behavior. I compare actual behavior with the contract and clarify inconsistencies before treating assumptions as facts.",
    "Schema недостаточно без business checks.",
  ],
  [
    "WHERE versus HAVING?",
    "WHERE filters rows before grouping; HAVING filters grouped results. I use HAVING COUNT(*) > 1 to find groups containing more than one row.",
    "Покажите короткий SQL пример.",
  ],
  [
    "How do you query NULL?",
    "I use IS NULL or IS NOT NULL. NULL represents a missing or unknown value, so ordinary equality does not work the same way as for known values.",
    "NULL не ноль и не пустая строка.",
  ],
  [
    "How can a JOIN duplicate rows?",
    "A one-to-many relationship produces one result row for each matching combination. I check cardinality and aggregate at the correct level instead of hiding the issue with DISTINCT.",
    "Важно понимать модель данных.",
  ],
  [
    "What is a transaction?",
    "It groups operations so they can be committed together or rolled back. For payments I would check that order and payment updates remain consistent when an operation fails.",
    "Назовите atomicity.",
  ],
  [
    "What is different about MongoDB?",
    "It stores BSON documents in collections and supports nested structures. Flexible documents still need validation, indexes and consistency rules; they do not remove the need for test design.",
    "Без ложного опыта администрирования.",
  ],
  [
    "How do you investigate a failed login in DevTools?",
    "I reproduce it with Network recording enabled, inspect the request payload, status and response, and compare with the expected contract. I correlate it with console errors while avoiding exposure of credentials.",
    "Отличите UI симптом от причины.",
  ],
  [
    "What can a HAR file contain?",
    "It can contain URLs, headers, cookies, tokens and response data. I would sanitize it and follow the agreed sharing process before attaching it to a bug report.",
    "HAR может раскрывать секреты.",
  ],
  [
    "What are HTTPS proxy limitations?",
    "Decryption usually requires a trusted test certificate and an authorized environment. Certificate pinning may prevent it. I would not intercept third-party traffic or leave test certificates installed unnecessarily.",
    "Не обещайте обход pinning.",
  ],
  [
    "What is blocked versus failed?",
    "Failed means an executed check differs from the expected result. Blocked means a prerequisite or dependency prevents execution. I report both distinctly in a test run.",
    "Blocked не Passed.",
  ],
  [
    "How do you retest a fixed defect?",
    "I verify the original reproduction on the correct fixed build, inspect the outcome and then check nearby risks. If it still fails, I reopen it with current evidence.",
    "Retest отличается от regression.",
  ],
  [
    "What is traceability?",
    "It links requirements to test cases, execution results and defects. It helps identify untested requirements, but the presence of a link does not prove the tests are sufficient.",
    "Метрика не заменяет review.",
  ],
  [
    "What does a QA Analyst do?",
    "A QA Analyst examines requirements for testability, clarifies ambiguity, assesses risks and designs coverage. This overlaps with business analysis but is not the same as analyzing business data for insights.",
    "Отличите от Data Analyst.",
  ],
  [
    "Write an acceptance criterion for a discount.",
    "Given a cart of 100 EUR before delivery, when a 10 percent discount under the inclusive threshold rule is calculated, then the discounted subtotal is 90 EUR. I would clarify rounding and combination rules.",
    "Включительная граница названа явно.",
  ],
  [
    "What do you do with an ambiguous requirement?",
    "I document the ambiguity, give concrete examples that lead to different outcomes, ask the responsible stakeholder and record the agreed rule. I label any temporary assumption.",
    "100 — полезный контрпример.",
  ],
  [
    "How do you estimate testing?",
    "I break work into analysis, data and environment preparation, execution, investigation, retesting and reporting. I provide a range with assumptions and dependencies rather than a precise unsupported number.",
    "Учитывайте риски и retest.",
  ],
  [
    "What belongs in a test summary?",
    "The tested build and scope, results, blocked or untested areas, important defects, residual risks and a release recommendation with evidence. The accountable owner makes the release decision.",
    "Не только процент Passed.",
  ],
  [
    "How do you report a collision bug?",
    "I include the build, platform, level, position, movement direction, input sequence, relevant frame rate and reproduction frequency, with video or a save when appropriate.",
    "Сделайте repro минимальным.",
  ],
  [
    "Crash versus softlock?",
    "A crash terminates the process. A softlock prevents progress while the game may keep running. Severity depends on impact, frequency and whether recovery is possible.",
    "Не путайте с cosmetic clipping.",
  ],
  [
    "How would you test save and load?",
    "I check progress, inventory and settings across save/load cycles, interrupted writes, incompatible versions and repeated loading. I verify that items are neither lost nor duplicated.",
    "Уточните правила autosave.",
  ],
  [
    "How do you assess game performance?",
    "I use a repeatable route and fixed hardware and settings, recording frame times and stutter as well as average FPS. I compare results under the same conditions.",
    "Среднее скрывает просадки.",
  ],
  [
    "What game localization issues would you test?",
    "Text expansion, clipping, missing glyphs, fallback fonts, number formats, input prompts and layout at supported resolutions and languages. I check actual screens rather than translations alone.",
    "HUD — часть функционального опыта.",
  ],
  [
    "What do you know about Unreal Blueprints?",
    "Blueprints provide visual scripting using events, variables and nodes on Actors and Components. I am studying the basics, such as BeginPlay and overlap events; I would not describe this as commercial Unreal experience.",
    "Соблюдайте честную границу опыта.",
  ],
  [
    "How do you select a mobile test matrix?",
    "I use supported OS versions, user distribution, screen sizes, device capabilities and feature risks. Emulators help coverage, but real devices are important for interruptions and hardware behavior.",
    "Нельзя покрыть всё одним device.",
  ],
  [
    "How do you test mobile interruptions?",
    "I test background and foreground transitions, calls, rotation, permission changes and network switching at critical points. I verify state recovery and that actions such as payments are not duplicated.",
    "Особенно важен checkout.",
  ],
  [
    "What safe ADB commands do you know?",
    "On an authorized test device I can use adb devices, inspect the OS version with getprop, and collect logcat output. I review logs for sensitive data and avoid destructive commands.",
    "Не заявляйте более глубокую экспертизу.",
  ],
  [
    "What is accessibility testing?",
    "It checks whether people with different abilities can use the product. I test keyboard operation, focus, labels, contrast, resizing and screen-reader behavior, combining manual checks with automated tools.",
    "A11y не только contrast.",
  ],
  [
    "Does Lighthouse prove WCAG conformance?",
    "No. Automated tools detect only some issues. Manual keyboard and assistive-technology checks and a review against the relevant criteria are still needed.",
    "Чётко назовите ограничение.",
  ],
  [
    "Why store money as integer cents?",
    "It avoids common binary floating-point rounding errors for supported currencies. I still need explicit rules for currency scale, tax and discount rounding and must not mix currencies.",
    "Не каждая валюта имеет 2 знака.",
  ],
  [
    "How would you test refunds?",
    "I check full and partial refunds, currency, remaining refundable balance, duplicate requests, provider failures and reconciliation. Total successful refunds must not exceed the captured amount under the business rules.",
    "Проверьте повтор и timeout.",
  ],
  [
    "What makes a Playwright test reliable?",
    "Stable role or label locators, isolated data, awaited actions and web-first assertions help. I investigate failures with traces and fix underlying races instead of relying on arbitrary sleeps.",
    "Auto-waiting не решает все backend races.",
  ],
  [
    "CI, continuous delivery and deployment?",
    "CI integrates changes with automated checks. Continuous delivery keeps changes releasable with a release decision. Continuous deployment automatically releases changes that pass the agreed pipeline.",
    "Три разных понятия.",
  ],
  [
    "What is the difference between commit and push?",
    "A commit records a local snapshot in Git history. Push transfers commits to a configured remote. I review the staged diff and avoid including secrets or personal exports.",
    "Локальная история не remote.",
  ],
  [
    "When would you recommend no-go?",
    "I would recommend no-go for unresolved critical risks such as reproducible duplicate charges, explaining evidence, scope and potential impact. The release owner decides and records any accepted risk.",
    "Обоснуйте риск и границы проверки.",
  ],
];
export const sqlTasks = [
  ["Все пользователи", "SELECT * FROM users ORDER BY id"],
  [
    "Пользователи из Польши",
    "SELECT id,email FROM users WHERE country='PL' ORDER BY id",
  ],
  [
    "Pending заказы",
    "SELECT id,total_cents FROM orders WHERE status='pending' ORDER BY id",
  ],
  [
    "Заказы от 100 EUR",
    "SELECT id FROM orders WHERE total_cents >= 10000 ORDER BY id",
  ],
  [
    "Email на example.test",
    "SELECT email FROM users WHERE email LIKE '%@example.test' ORDER BY email",
  ],
  [
    "Два самых дорогих заказа",
    "SELECT id,total_cents FROM orders ORDER BY total_cents DESC,id LIMIT 2",
  ],
  ["Количество пользователей", "SELECT COUNT(*) AS n FROM users"],
  [
    "Сумма paid заказов",
    "SELECT SUM(total_cents) AS total FROM orders WHERE status='paid'",
  ],
  [
    "Средняя стоимость заказа",
    "SELECT AVG(total_cents) AS average FROM orders",
  ],
  [
    "Группировка по статусам",
    "SELECT status,COUNT(*) AS n FROM orders GROUP BY status ORDER BY status",
  ],
  [
    "Статусы с двумя и более заказами",
    "SELECT status,COUNT(*) AS n FROM orders GROUP BY status HAVING COUNT(*)>=2 ORDER BY status",
  ],
  [
    "Заказы с email владельца",
    "SELECT o.id,u.email FROM orders o INNER JOIN users u ON u.id=o.user_id ORDER BY o.id",
  ],
  [
    "Все пользователи и их заказы",
    "SELECT u.id AS user_id,o.id AS order_id FROM users u LEFT JOIN orders o ON u.id=o.user_id ORDER BY u.id,o.id",
  ],
  [
    "Пользователи без заказов",
    "SELECT u.id FROM users u LEFT JOIN orders o ON o.user_id=u.id WHERE o.id IS NULL ORDER BY u.id",
  ],
  [
    "Заказы без владельца",
    "SELECT id FROM orders WHERE user_id IS NULL ORDER BY id",
  ],
  [
    "Успешный платёж с неверной суммой",
    "SELECT o.id,o.total_cents,p.amount_cents FROM orders o JOIN payments p ON p.order_id=o.id WHERE p.status='succeeded' AND p.amount_cents<>o.total_cents ORDER BY o.id",
  ],
  [
    "Paid без успешного платежа",
    "SELECT o.id FROM orders o LEFT JOIN payments p ON p.order_id=o.id AND p.status='succeeded' WHERE o.status='paid' AND p.id IS NULL ORDER BY o.id",
  ],
  [
    "Расходы каждого пользователя",
    "SELECT user_id,SUM(total_cents) AS total FROM orders WHERE user_id IS NOT NULL GROUP BY user_id ORDER BY user_id",
  ],
  [
    "Товары дешевле 50 EUR",
    "SELECT name,price_cents FROM products WHERE price_cents<5000 ORDER BY id",
  ],
  [
    "Платежи failed или pending",
    "SELECT id,status FROM payments WHERE status='failed' OR status='pending' ORDER BY id",
  ],
  [
    "Пользователи с суммой заказов выше 100 EUR",
    "SELECT user_id,SUM(total_cents) AS total FROM orders WHERE user_id IS NOT NULL GROUP BY user_id HAVING SUM(total_cents)>10000 ORDER BY user_id",
  ],
  [
    "Сколько заказов имеют владельца",
    "SELECT COUNT(*) AS all_orders,COUNT(user_id) AS owned_orders FROM orders",
  ],
];
export const capstoneCases = [
  ["REG-1", "18 лет, уникальный email, пароль 8", "Регистрация успешна"],
  ["REG-2", "17 лет", "Отклонено без создания пользователя"],
  ["REG-3", "65 лет", "Регистрация успешна"],
  ["REG-4", "66 лет", "Отклонено"],
  ["REG-5", "Занятый email", "Конфликт, дубликат не создан"],
  ["REG-6", "Пароль 7 символов", "Ошибка длины"],
  ["DIS-1", "99.99 EUR", "Без скидки"],
  ["DIS-2", "100 EUR", "Subtotal 90 EUR"],
  ["DIS-3", "100.01 EUR", "Subtotal 90.01 EUR при округлении half-up до cents"],
  ["CART-1", "Количество 0", "Позиция удалена по учебному правилу"],
  ["CART-2", "Отрицательное количество", "Отклонено"],
  ["PAY-1", "Корзина 100 + доставка 5", "Списание 95 EUR"],
  ["PAY-2", "Повтор с тем же idempotency key", "Одно списание"],
  ["PAY-3", "Timeout после отправки", "Сверка статуса до повторного списания"],
  ["PAY-4", "Отклонённая карта sandbox", "Заказ не paid"],
  ["REF-1", "Возврат 30 из 95 EUR", "Остаток возврата 65 EUR"],
  ["SEC-1", "Доступ к чужому заказу", "Доступ запрещён по контракту"],
  ["A11Y-1", "Checkout с клавиатуры", "Понятный focus, все действия доступны"],
];
export const seedBugs = [
  [
    "DIS-01",
    "Скидка не применяется на 100 EUR",
    "High",
    "Добавить 2 товара по 50 EUR → открыть cart",
    "Expected 90, actual 100: ошибочный оператор >",
  ],
  [
    "PAY-02",
    "Повтор Pay создаёт два списания",
    "Critical",
    "Оплатить → повторить тот же ключ",
    "Expected одна операция, actual две",
  ],
  [
    "REG-03",
    "Возраст 66 принимается",
    "Medium",
    "Зарегистрироваться с age=66",
    "Expected отказ, actual создано",
  ],
  [
    "A11Y-04",
    "Кнопка оплаты пропущена в Tab order",
    "High",
    "Открыть checkout → пройти Tab",
    "Expected focus на Pay, actual пропуск",
  ],
  [
    "SAVE-05",
    "Корзина теряется при возврате из background",
    "Medium",
    "Заполнить cart → background → foreground",
    "Expected сохранение, actual пусто",
  ],
  [
    "DATA-06",
    "Paid order не совпадает с суммой платежа",
    "High",
    "В SQL сверить orders и payments",
    "Expected одинаковые суммы, actual 10000 и 9000",
  ],
];
export const postmanCollection = {
  info: {
    name: "QA Academy — optional online Users assignment",
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    ["User 1", "GET", "https://jsonplaceholder.typicode.com/users/1", 200],
    [
      "Missing user",
      "GET",
      "https://jsonplaceholder.typicode.com/users/999",
      404,
    ],
    ["List users", "GET", "https://jsonplaceholder.typicode.com/users", 200],
    [
      "Create (fake persistence)",
      "POST",
      "https://jsonplaceholder.typicode.com/users",
      201,
    ],
    [
      "Invalid creation — investigate contract",
      "POST",
      "https://jsonplaceholder.typicode.com/users",
      201,
    ],
  ].map(([name, method, url, status]) => ({
    name,
    request: {
      method,
      header: [{ key: "Content-Type", value: "application/json" }],
      url,
      ...(method === "POST"
        ? {
            body: {
              mode: "raw",
              raw:
                name === "Invalid creation — investigate contract"
                  ? "{}"
                  : '{"name":"Training User","email":"training@example.test"}',
            },
          }
        : {}),
    },
    event: [
      {
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            `pm.test("Document observed status", () => pm.response.to.have.status(${status}));`,
          ],
        },
      },
    ],
  })),
};
