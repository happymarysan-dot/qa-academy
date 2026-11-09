import { useEffect, useState } from "react";
import { Check, Copy, Play, Download, ArrowRight } from "lucide-react";
import { modules, type Question } from "./content";
import {
  registration,
  mockApi,
  discount,
  bugGrade,
  download,
  grade,
  recordPractice,
  type State,
} from "./engine";
import {
  sqlTasks,
  capstoneCases,
  seedBugs,
  postmanCollection,
} from "./practice-data";
import { executeSql, sameRows } from "./sql-client";
export type Update = (fn: (s: State) => State) => void;
export function CopyCode({ code }: { code: string }) {
  const [msg, setMsg] = useState("");
  return (
    <div className="code">
      <button
        className="copy"
        onClick={() => {
          navigator.clipboard
            .writeText(code)
            .then(() => setMsg("Скопировано"))
            .catch(() => setMsg("Выделите код и скопируйте вручную"));
        }}
        aria-label="Копировать код"
      >
        <Copy size={15} />
        {msg || "Копировать"}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
export function Quiz({
  questions,
  onFinish,
  title = "Проверка понимания",
}: {
  questions: Question[];
  onFinish: (
    score: number,
    total: number,
    answers: Record<string, number[] | string>,
  ) => void;
  title?: string;
}) {
  const [answers, setAnswers] = useState<Record<string, number[] | string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hint, setHint] = useState<string[]>([]);
  function right(q: Question) {
    return grade(q, answers[q.id] || []);
  }
  const score = questions.filter(right).length;
  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <p className="eyebrow">ПРАКТИКА · ОБЪЕКТИВНАЯ ПРОВЕРКА</p>
          <h2>{title}</h2>
        </div>
        {submitted && (
          <span className="score">
            {score} / {questions.length}
          </span>
        )}
      </div>
      <p className="muted">
        Несколько ответов отмечены явно. Балл за вопрос — только за полный
        правильный набор, без штрафа за ошибку.
      </p>
      {questions.map((q, i) => (
        <fieldset className="card question" key={q.id}>
          <legend>
            <span className="number">{String(i + 1).padStart(2, "0")}</span>
            {q.prompt}
          </legend>
          {q.type === "multiple" && <small>Выберите все верные ответы</small>}
          {q.type === "short" ? (
            <>
              <label>
                Краткий ответ
                <input
                  disabled={submitted}
                  value={String(answers[q.id] || "")}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                />
              </label>
              <small>
                Точное совпадение без учёта регистра и крайних пробелов.
                Допустимые варианты будут показаны после отправки.
              </small>
            </>
          ) : (
            q.options.map((o, j) => (
              <label
                className={`option ${submitted && q.correct.includes(j) ? "correct" : ""}`}
                key={o}
              >
                <input
                  disabled={submitted}
                  type={q.type === "multiple" ? "checkbox" : "radio"}
                  name={q.id}
                  checked={
                    Array.isArray(answers[q.id]) &&
                    (answers[q.id] as number[]).includes(j)
                  }
                  onChange={() => {
                    const old = (answers[q.id] || []) as number[];
                    setAnswers({
                      ...answers,
                      [q.id]:
                        q.type === "multiple"
                          ? old.includes(j)
                            ? old.filter((x) => x !== j)
                            : [...old, j]
                          : [j],
                    });
                  }}
                />
                {o}
              </label>
            ))
          )}
          {submitted ? (
            <div className={`feedback ${right(q) ? "good" : "bad"}`}>
              <strong>{right(q) ? "Верно." : "Пока не совпало."}</strong>{" "}
              {q.explanation}
              {q.type === "short" && ` Допустимо: ${q.accepted?.join(", ")}`}
            </div>
          ) : (
            <>
              <button
                className="text-btn"
                onClick={() => setHint([...hint, q.id])}
              >
                Подсказка
              </button>
              {hint.includes(q.id) && (
                <p className="callout">
                  Определите наблюдаемый результат и риск. Сопоставьте каждую
                  опцию с теорией, проверьте слова «всегда» и «только».
                </p>
              )}
            </>
          )}
        </fieldset>
      ))}
      <div className="actions">
        {submitted ? (
          <button
            className="primary"
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
              setHint([]);
            }}
          >
            Повторить проверку
          </button>
        ) : (
          <button
            className="primary"
            disabled={questions.some(
              (q) =>
                !answers[q.id] ||
                (Array.isArray(answers[q.id])
                  ? (answers[q.id] as number[]).length === 0
                  : !String(answers[q.id]).trim()),
            )}
            onClick={() => {
              setSubmitted(true);
              onFinish(score, questions.length, answers);
            }}
          >
            Проверить ответы <Check size={17} />
          </button>
        )}
        <span className="muted">
          {submitted
            ? "Попытка сохранена локально."
            : "Ответьте на все вопросы для отправки."}
        </span>
      </div>
    </section>
  );
}
export function Registration({ update }: { update: Update }) {
  const [age, setAge] = useState("18"),
    [email, setEmail] = useState("new@example.test"),
    [password, setPassword] = useState("training"),
    [prediction, setPrediction] = useState("success"),
    [result, setResult] = useState(""),
    [runs, setRuns] = useState<{ age: string; ok: boolean }[]>([]),
    [cases, setCases] = useState(""),
    [reveal, setReveal] = useState(false);
  return (
    <div className="stack">
      <div className="card">
        <h2>Лаборатория регистрации</h2>
        <p>
          Правило: целый возраст 18–65 включительно, уникальный email, пароль ≥8
          Unicode code points. Заняты: used@example.test, qa@example.test.
          Данные не сохраняются на сервере.
        </p>
        <div className="form-grid">
          <label>
            Возраст
            <input value={age} onChange={(e) => setAge(e.target.value)} />
          </label>
          <label>
            Учебный email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Учебный пароль (не настоящий)
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            Мой прогноз
            <select
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
            >
              <option value="success">Успех</option>
              <option value="error">Ошибка</option>
            </select>
          </label>
        </div>
        <label>
          Мои тест-кейсы и expected results
          <textarea
            value={cases}
            onChange={(e) => setCases(e.target.value)}
            placeholder="17 → отказ; 18 → успех при остальных валидных полях…"
          />
        </label>
        <button
          className="primary"
          onClick={() => {
            const r = registration(age, email, password);
            setRuns([...runs, { age, ok: r.ok }]);
            update((s) =>
              recordPractice(
                s,
                2,
                "Регистрация: прогноз",
                (r.ok ? "success" : "error") === prediction
                  ? "Прогноз верный"
                  : "Прогноз не совпал",
              ),
            );
            setResult(
              `${(r.ok ? "success" : "error") === prediction ? "Прогноз верный." : "Прогноз не совпал."} ${r.ok ? "Регистрация разрешена." : r.errors.join(" ")}`,
            );
          }}
        >
          Выполнить проверку <Play size={16} />
        </button>
        {result && (
          <p className="feedback" role="status">
            {result}
          </p>
        )}
        <h3>
          Покрытие возрастных границ ·{" "}
          {
            new Set(
              runs
                .filter((r) =>
                  ["17", "18", "19", "64", "65", "66"].includes(r.age),
                )
                .map((r) => r.age),
            ).size
          }
          /6
        </h3>
        <div className="chips">
          {["17", "18", "19", "64", "65", "66"].map((x) => (
            <span
              key={x}
              className={runs.some((r) => r.age === x) ? "tag teal" : "tag"}
            >
              {x}
            </span>
          ))}
        </div>
        <p className="muted">
          Это покрытие выбранных входов, а не доказательство полноты всех
          комбинаций. Запуски сбрасываются при выходе.
        </p>
        <button onClick={() => setReveal(!reveal)}>Сравнить с эталоном</button>
        {reveal && (
          <p className="callout">
            Возраст 17/66 → отказ; 18/19/64/65 → успех при остальных валидных
            полях. Пароли 7/8/9 → отказ/успех/успех. Отдельно: занятый email,
            неверный формат, пустые поля, дробный возраст, все 8 комбинаций
            таблицы решений.
          </p>
        )}
      </div>
      <DiscountLab />
    </div>
  );
}
function DiscountLab() {
  const [rule, setRule] = useState("inclusive"),
    [answer, setAnswer] = useState(""),
    [show, setShow] = useState(false);
  return (
    <div className="card">
      <h2>Скидка: одна граница, два смысла</h2>
      <label>
        Уточнённое правило
        <select
          value={rule}
          onChange={(e) => {
            setRule(e.target.value);
            setShow(false);
          }}
        >
          <option value="inclusive">От 100 EUR: ≥100</option>
          <option value="exclusive">Больше 100 EUR: &gt;100</option>
        </select>
      </label>
      <label>
        Итог на 100 EUR при скидке 10%, без доставки
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="90 или 100"
        />
      </label>
      <button onClick={() => setShow(true)}>Проверить трактовку</button>
      {show && (
        <p className="feedback">
          {Number(answer.replace(",", ".")) ===
          discount(10000, rule === "inclusive") / 100
            ? "Верно."
            : "Проверьте границу."}{" "}
          Итог: {discount(10000, rule === "inclusive") / 100} EUR. При 99.99
          скидки нет, при 100.01 она есть в обоих правилах. Уточните
          включительность у владельца требования.
        </p>
      )}
    </div>
  );
}
export function ApiLab({ update }: { update: Update }) {
  const [method, setMethod] = useState("GET"),
    [path, setPath] = useState("/users/1"),
    [token, setToken] = useState(""),
    [payload, setPayload] = useState(
      '{"name":"Training","email":"new@example.test"}',
    ),
    [result, setResult] = useState<ReturnType<typeof mockApi>>(),
    [expected, setExpected] = useState("200"),
    [assertion, setAssertion] = useState("id"),
    [check, setCheck] = useState("");
  const snippet =
    'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("User ID", () => pm.expect(pm.response.json().id).to.eql(1));';
  return (
    <div className="stack">
      <div className="card">
        <div className="section-title">
          <h2>Local API Explorer</h2>
          <span className="tag teal">SIMULATED · OFFLINE</span>
        </div>
        <p>
          Детерминированный mock без fetch. Каждый запрос независим:
          POST/PUT/PATCH/DELETE показывают ответ, но не меняют dataset. Token:
          user или admin — вымышленные роли.
        </p>
        <div className="request-bar">
          <label>
            Method
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="grow">
            Path
            <input value={path} onChange={(e) => setPath(e.target.value)} />
          </label>
          <button
            className="primary"
            onClick={() => {
              const r = mockApi(method, path, payload, token);
              setResult(r);
              update((s) =>
                recordPractice(
                  s,
                  3,
                  method + " mock request",
                  "Status " + r.status,
                ),
              );
              setCheck("");
            }}
          >
            Send <ArrowRight size={16} />
          </button>
        </div>
        <div className="chips">
          {[
            "/users/1",
            "/users/999",
            "/users?page=2&limit=2",
            "/users",
            "/admin",
            "/rate-limit",
            "/error",
            "/unavailable",
          ].map((p) => (
            <button key={p} className="tag" onClick={() => setPath(p)}>
              {p}
            </button>
          ))}
        </div>
        <label>
          Учебная роль/token
          <select value={token} onChange={(e) => setToken(e.target.value)}>
            <option value="">Нет token</option>
            <option>user</option>
            <option>admin</option>
          </select>
        </label>
        <label>
          JSON payload
          <textarea
            className="editor"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            spellCheck={false}
          />
        </label>
        {result && (
          <div className="response">
            <span className={`tag ${result.status < 400 ? "teal" : "orange"}`}>
              Status {result.status}
            </span>
            <CopyCode code={JSON.stringify(result, null, 2)} />
            <h3>Postman-style assertions</h3>
            <p className="muted">
              Проверки задаются полями, произвольный JS не исполняется. Выберите
              ожидания до проверки.
            </p>
            <div className="form-grid">
              <label>
                Ожидаемый status
                <input
                  value={expected}
                  onChange={(e) => setExpected(e.target.value)}
                />
              </label>
              <label>
                Обязательное поле body
                <input
                  value={assertion}
                  onChange={(e) => setAssertion(e.target.value)}
                  placeholder="id / error / data"
                />
              </label>
            </div>
            <button
              onClick={() =>
                setCheck(
                  `Status: ${Number(expected) === result.status ? "PASS" : "FAIL"}; body.${assertion}: ${result.body && typeof result.body === "object" && Object.hasOwn(result.body, assertion) ? "PASS" : "FAIL"}. Для 204 тело отсутствует, проверка поля должна FAIL.`,
                )
              }
            >
              Run assertions
            </button>
            {check && (
              <p role="status" className="feedback">
                {check}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="card">
        <h2>Postman · переносим навык в реальный инструмент</h2>
        <ol>
          <li>Создайте collection Users и environment с baseUrl.</li>
          <li>Добавьте GET /users/1 и /users/999, сравните status и body.</li>
          <li>
            Добавьте список, создание и невалидное создание. В JSONPlaceholder
            валидация условна: даже пустой POST может вернуть 201; это
            ограничение сервиса.
          </li>
          <li>
            Вставьте tests, выполните collection runner и запишите наблюдения.
            POST не сохраняется реально.
          </li>
          <li>Экспортируйте collection без токенов и личных данных.</li>
        </ol>
        <p>
          <a
            href="https://jsonplaceholder.typicode.com/"
            target="_blank"
            rel="noreferrer"
          >
            JSONPlaceholder ↗ внешний, необязательный online exercise
          </a>
        </p>
        <CopyCode code={snippet} />
        <button
          onClick={() =>
            download(
              "users.postman_collection.json",
              JSON.stringify(postmanCollection, null, 2),
            )
          }
        >
          <Download size={16} /> Скачать collection · 5 запросов
        </button>
      </div>
    </div>
  );
}
export function SqlLab({ state, update }: { state: State; update: Update }) {
  const [task, setTask] = useState(0),
    [query, setQuery] = useState(
      state.answers["sql-draft"] ||
        "SELECT * FROM orders WHERE status = 'pending' ORDER BY id",
    ),
    [result, setResult] = useState<{
      columns: string[];
      values: unknown[][];
    }>(),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [show, setShow] = useState(false);
  async function run(check: boolean) {
    setBusy(true);
    setMessage("");
    try {
      const r = await executeSql(query);
      setResult(r);
      update((s) => ({ ...s, answers: { ...s.answers, "sql-draft": query } }));
      if (check) {
        const expected = await executeSql(sqlTasks[task][1]);
        update((s) =>
          recordPractice(
            s,
            4,
            sqlTasks[task][0],
            sameRows(r, expected) ? "Верно" : "Нужно повторить",
          ),
        );
        setMessage(
          sameRows(r, expected)
            ? "Верно: значения и порядок строк совпали. Названия alias не оцениваются."
            : "Результат отличается. Проверьте столбцы, фильтр и порядок; ожидаемый результат можно раскрыть.",
        );
      } else setMessage(`Получено строк: ${r.values.length}.`);
    } catch (e) {
      setMessage(String(e instanceof Error ? e.message : e));
      setResult(undefined);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="stack">
      <div className="card">
        <div className="section-title">
          <h2>SQL Workbench</h2>
          <span className="tag teal">SQLite · LOCAL WASM</span>
        </div>
        <p>
          Настоящий SQLite в Web Worker. Одна read-only SELECT/WITH, максимум
          500 строк и 2 секунды. Без recursive CTE, комментариев и записи.
          Учебная БД пересоздаётся при каждом запуске.
        </p>
        <details>
          <summary>Схема и исходные данные</summary>
          <CopyCode
            code={
              "users(id PK, email, country)\norders(id PK, user_id FK → users.id, status, total_cents)\nproducts(id PK, name, price_cents)\npayments(id PK, order_id FK → orders.id, status, amount_cents)\n\nusers: 1 Alex PL, 2 Dana PL, 3 Sam DE, 4 Jo UK\norders: (1,1,paid,10000), (2,1,pending,5000),\n (3,2,paid,20000), (4,3,cancelled,3000),\n (5,NULL,pending,9999), (6,2,paid,4000)\npayments: (1,1,succeeded,9000), (2,3,succeeded,20000),\n (3,4,failed,3000), (4,2,pending,5000)\nproducts: Keyboard 5000, Mouse 2500, Monitor 20000"
            }
          />
        </details>
        <label>
          Задание {task + 1} / {sqlTasks.length}
          <select
            value={task}
            onChange={(e) => {
              setTask(Number(e.target.value));
              setShow(false);
              setMessage("");
            }}
          >
            {sqlTasks.map((t, i) => (
              <option value={i} key={t[0]}>
                {i + 1}. {t[0]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ваш SQL
          <textarea
            className="editor"
            rows={7}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
        </label>
        <div className="actions">
          <button
            className="primary"
            disabled={busy}
            onClick={() => run(false)}
          >
            <Play size={16} /> {busy ? "Выполняется…" : "Run SQL"}
          </button>
          <button disabled={busy} onClick={() => run(true)}>
            Проверить задание
          </button>
          <button onClick={() => setShow(!show)}>Эталон и подсказка</button>
        </div>
        {message && (
          <p className="feedback" role="status">
            {message}
          </p>
        )}
        {show && (
          <>
            <p className="callout">
              Сначала определите таблицы, затем связи, фильтрацию и сортировку.
              Эталон ниже; другой SQL с теми же упорядоченными значениями также
              принимается.
            </p>
            <CopyCode code={sqlTasks[task][1]} />
            <ExpectedSql query={sqlTasks[task][1]} />
            <button onClick={() => setQuery(sqlTasks[task][1])}>
              Подставить эталон для изучения
            </button>
          </>
        )}
        {result && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {result.columns.map((c, i) => (
                    <th key={i}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.values.map((r, i) => (
                  <tr key={i}>
                    {r.map((v, j) => (
                      <td key={j}>{v === null ? <em>NULL</em> : String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {result.values.length === 0 && <p>Нет строк.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
const network = [
  {
    path: "/api/login",
    method: "POST",
    status: 500,
    time: 82,
    payload: '{"email":"training@example.test","password":"[redacted]"}',
    response: '{"error":"Database unavailable","requestId":"qa-101"}',
  },
  {
    path: "/api/orders",
    method: "GET",
    status: 401,
    time: 40,
    payload: "Authorization: missing",
    response: '{"error":"Authentication required"}',
  },
  {
    path: "/api/admin",
    method: "GET",
    status: 403,
    time: 32,
    payload: "Authorization: Bearer [test-user]",
    response: '{"error":"Admin role required"}',
  },
  {
    path: "/api/products",
    method: "GET",
    status: 200,
    time: 4800,
    payload: "page=1",
    response: '[{"id":1,"name":"Keyboard"}]',
  },
  {
    path: "/assets/app.css",
    method: "GET",
    status: 200,
    time: 22,
    payload: "",
    response: "/* local stylesheet */",
  },
];
function NetworkLab() {
  const [filter, setFilter] = useState(""),
    [selected, setSelected] = useState(0),
    [answer, setAnswer] = useState(""),
    [show, setShow] = useState(false);
  const n = network[selected];
  return (
    <div className="card">
      <h2>Network Inspector · учебная запись</h2>
      <label>
        Фильтр URL или status
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="500, /api, products"
        />
      </label>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {network
              .map((x, i) => ({ ...x, i }))
              .filter((x) => `${x.path} ${x.status}`.includes(filter))
              .map((x) => (
                <tr key={x.path}>
                  <td>
                    <button
                      className="text-btn"
                      onClick={() => setSelected(x.i)}
                    >
                      {x.method} {x.path}
                    </button>
                  </td>
                  <td>{x.status}</td>
                  <td>{x.time} ms</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <CopyCode
        code={`REQUEST ${n.method} ${n.path}\nPayload / headers: ${n.payload}\nResponse ${n.status}\nContent-Type: ${n.path.endsWith(".css") ? "text/css" : "application/json"}\nBody: ${n.response}\nTiming: ${n.time} ms`}
      />
      <h3>Расследование: UI говорит «неверный пароль»</h3>
      <label>
        Какой запрос подтверждает серверную проблему? Выберите status.
        <select value={answer} onChange={(e) => setAnswer(e.target.value)}>
          <option value="">Выберите</option>
          {["200", "401", "403", "500"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <button onClick={() => setShow(true)}>Проверить гипотезу</button>
      {show && (
        <p className="feedback">
          {answer === "500" ? "Верно." : "Пока нет."} /api/login вернул 500 и
          Database unavailable. Это evidence серверного сбоя; неверный пароль не
          доказан. /orders 401 — нет сессии; /admin 403 — не хватает роли.
          /products 4800 ms — кандидат для проверки loading, timeout и retry.
        </p>
      )}
      <details>
        <summary>Реальный DevTools и proxy: шаги</summary>
        <ol>
          <li>
            Откройте разрешённый test environment → F12 → Network → Preserve
            log.
          </li>
          <li>
            Очистите запись, воспроизведите один сценарий, отфильтруйте
            Fetch/XHR.
          </li>
          <li>
            Изучите Headers, Payload, Response, Timing; сравните с контрактом.
          </li>
          <li>
            Выберите Slow 3G/Offline и проверьте восстановление. Верните No
            throttling.
          </li>
          <li>
            Для Charles/Fiddler настройте proxy на своём test device. HTTPS
            decryption требует доверенного тестового CA; pinning может
            препятствовать.
          </li>
          <li>
            Не перехватывайте сторонний трафик. Очистите HAR от секретов; после
            работы удалите proxy и CA.
          </li>
        </ol>
        <a
          href="https://www.charlesproxy.com/documentation/"
          target="_blank"
          rel="noreferrer"
        >
          Charles docs ↗ внешний
        </a>{" "}
        ·{" "}
        <a
          href="https://docs.telerik.com/fiddler-everywhere/introduction"
          target="_blank"
          rel="noreferrer"
        >
          Fiddler docs ↗ внешний
        </a>
      </details>
    </div>
  );
}
const bugLabels: Record<string, string> = {
  title: "Заголовок",
  environment: "Среда и build",
  preconditions: "Предусловия",
  steps: "Шаги",
  expected: "Expected result",
  actual: "Actual result",
  severity: "Severity",
  frequency: "Частота воспроизведения",
  evidence: "Evidence (без секретов)",
};
function BugLab({ state, update }: { state: State; update: Update }) {
  const fields = Object.fromEntries(
    Object.keys(bugLabels).map((k) => [k, state.answers[`bug-${k}`] || ""]),
  );
  const [feedback, setFeedback] = useState("");
  const md = () =>
    Object.entries(fields)
      .map(([k, v]) => `## ${bugLabels[k]}\n${v}`)
      .join("\n\n");
  return (
    <div className="stack">
      <div className="card">
        <h2>Bug Report Builder</h2>
        <p>
          Кейс: правило скидки ≥100 EUR, actual на 100 EUR — без скидки.
          Проверка оценивает наличие и минимальную длину полей, а не истинность
          или качество текста. Самостоятельно проверьте воспроизводимость.
        </p>
        {Object.entries(bugLabels).map(([k, label]) => (
          <label key={k}>
            {label}
            {k === "severity" ? (
              <select
                value={fields[k]}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    answers: { ...s.answers, [`bug-${k}`]: e.target.value },
                  }))
                }
              >
                <option value="">Выберите</option>
                {["Critical", "High", "Medium", "Low"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            ) : (
              <textarea
                rows={k === "steps" ? 3 : 2}
                value={fields[k]}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    answers: { ...s.answers, [`bug-${k}`]: e.target.value },
                  }))
                }
              />
            )}
          </label>
        ))}
        <div className="actions">
          <button
            className="primary"
            onClick={() => {
              const g = bugGrade(fields);
              setFeedback(
                `${g.score}/${g.total} обязательных полей заполнено. ${g.missing.length ? "Уточните: " + g.missing.map((x) => bugLabels[x]).join(", ") : "Теперь проверьте точность, минимальность шагов и соответствие expected требованиям."}`,
              );
            }}
          >
            Проверить структуру
          </button>
          <button
            onClick={() => download("training-bug.md", md(), "text/markdown")}
          >
            Markdown
          </button>
          <button
            onClick={() =>
              download("training-bug.json", JSON.stringify(fields, null, 2))
            }
          >
            JSON
          </button>
        </div>
        {feedback && (
          <p className="feedback" role="status">
            {feedback}
          </p>
        )}
      </div>
      <div className="card">
        <h2>Test Run · Discount build 1.0</h2>
        <p className="muted">
          Вы меняете результаты вручную после проверки. Это запись run, а не
          автоматически исполненные cases.
        </p>
        {[
          "99.99 → без скидки",
          "100.00 → 90.00",
          "100.01 → 90.01",
          "Повторный Pay → одно списание",
          "Keyboard checkout доступен",
        ].map((x, i) => (
          <div className="board-row" key={x}>
            <span>
              TC-{i + 1} · {x}
            </span>
            <select
              aria-label={`Статус TC-${i + 1}`}
              value={state.board[x] || "Not Run"}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  board: { ...s.board, [x]: e.target.value },
                }))
              }
            >
              {["Not Run", "Passed", "Failed", "Blocked"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}
        <p className="callout">
          {Object.values(state.board).filter((x) => x === "Passed").length}/5
          Passed. Blocked — препятствие, Failed — фактическое расхождение.
          Открытые риски нужно описать отдельно.
        </p>
      </div>
    </div>
  );
}
function RequirementsLab({ state, update }: { state: State; update: Update }) {
  const [scenario, setScenario] = useState("discount"),
    [selected, setSelected] = useState<string[]>([]),
    [show, setShow] = useState(false),
    [prob, setProb] = useState(3),
    [impact, setImpact] = useState(5);
  const data: Record<
    string,
    { text: string; questions: string[]; correct: number[] }
  > = {
    discount: {
      text: "«Скидка 10% от 100 EUR»",
      questions: [
        "Включается ли 100?",
        "До или после доставки?",
        "Можно ли совмещать купоны?",
        "Любимый цвет разработчика?",
      ],
      correct: [0, 1, 2],
    },
    login: {
      text: "«После нескольких ошибок вход блокируется»",
      questions: [
        "Сколько попыток?",
        "На сколько времени?",
        "Как снять блокировку?",
        "Как зовут владельца ноутбука?",
      ],
      correct: [0, 1, 2],
    },
    checkout: {
      text: "«Корзина сохраняется»",
      questions: [
        "На какой срок?",
        "Для гостя и аккаунта?",
        "Между устройствами?",
        "Какой сегодня день недели?",
      ],
      correct: [0, 1, 2],
    },
    payment: {
      text: "«Оплата повторяется при ошибке»",
      questions: [
        "Есть ли idempotency key?",
        "Что при timeout после списания?",
        "Как сверять webhook?",
        "Какой шрифт в IDE?",
      ],
      correct: [0, 1, 2],
    },
  };
  const d = data[scenario];
  return (
    <div className="card">
      <h2>Requirements Workshop</h2>
      <label>
        Сценарий
        <select
          value={scenario}
          onChange={(e) => {
            setScenario(e.target.value);
            setSelected([]);
            setShow(false);
          }}
        >
          {Object.keys(data).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <blockquote>{d.text}</blockquote>
      <p>Выберите вопросы, которые делают требование тестируемым.</p>
      {d.questions.map((q, i) => (
        <label className="option" key={q}>
          <input
            type="checkbox"
            checked={selected.includes(String(i))}
            onChange={() =>
              setSelected(
                selected.includes(String(i))
                  ? selected.filter((x) => x !== String(i))
                  : [...selected, String(i)],
              )
            }
          />
          {q}
        </label>
      ))}
      <button onClick={() => setShow(true)}>Проверить анализ</button>
      {show && (
        <p className="feedback">
          {selected.sort().join(",") === d.correct.join(",")
            ? "Верно."
            : "Не все вопросы релевантны или что-то упущено."}{" "}
          Первые три вопроса уточняют наблюдаемое поведение. Последний не связан
          с критерием приёмки.
        </p>
      )}
      <label>
        Матрица AC → Case → Expected → риск
        <textarea
          rows={6}
          value={state.answers[`matrix-${scenario}`] || ""}
          onChange={(e) =>
            update((s) => ({
              ...s,
              answers: { ...s.answers, [`matrix-${scenario}`]: e.target.value },
            }))
          }
          placeholder="AC-D1 | TC-D01: 100 EUR | 90 EUR при ≥100 | P3×I5"
        />
      </label>
      <div className="form-grid">
        <label>
          Вероятность 1–5
          <input
            type="number"
            min="1"
            max="5"
            value={prob}
            onChange={(e) =>
              setProb(Math.max(1, Math.min(5, Number(e.target.value))))
            }
          />
        </label>
        <label>
          Влияние 1–5
          <input
            type="number"
            min="1"
            max="5"
            value={impact}
            onChange={(e) =>
              setImpact(Math.max(1, Math.min(5, Number(e.target.value))))
            }
          />
        </label>
      </div>
      <p className="score">
        Риск {prob} × {impact} = {prob * impact}
      </p>
      <p className="muted">
        Числа условны. Объясните влияние и вероятность, не выдавайте score за
        точную статистику.
      </p>
      <button
        onClick={() =>
          download(
            "requirements-matrix.md",
            state.answers[`matrix-${scenario}`] || "Матрица ещё не заполнена",
            "text/markdown",
          )
        }
      >
        Экспорт матрицы
      </button>
    </div>
  );
}
function GameLab() {
  const [x, setX] = useState(0),
    [jump, setJump] = useState(false),
    [stuck, setStuck] = useState(false),
    [history, setHistory] = useState<string[]>([]),
    [severity, setSeverity] = useState(""),
    [show, setShow] = useState(false);
  return (
    <div className="card">
      <h2>Game State Lab · Staircase build 0.3</h2>
      <p>
        Детерминированный симулятор состояния, не игровой движок. Игрок идёт
        вдоль y=1. В точке x=2 прыжок одновременно с движением вправо вызывает
        collision bug.
      </p>
      <div
        className="game-strip"
        aria-label={`Игрок x=${x}, y=1; ${stuck ? "stuck" : "ready"}`}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={i === x ? "player-cell" : ""}>
            {i === x ? "●" : i === 3 ? "▟" : "·"}
            <small>{i},1</small>
          </div>
        ))}
      </div>
      <label className="option">
        <input
          type="checkbox"
          checked={jump}
          onChange={(e) => setJump(e.target.checked)}
        />
        Jump при следующем движении
      </label>
      <div className="actions">
        <button
          disabled={stuck || x >= 5}
          onClick={() => {
            setHistory([
              ...history,
              `x=${x},y=1 → right${jump ? "+jump" : ""}`,
            ]);
            if (x === 2 && jump) {
              setStuck(true);
            } else setX(x + 1);
          }}
        >
          Move right
        </button>
        <button
          onClick={() => {
            setX(0);
            setStuck(false);
            setJump(false);
            setHistory([]);
            setShow(false);
          }}
        >
          Reset build
        </button>
      </div>
      <p role="status" className="feedback">
        {stuck
          ? "STUCK: progress blocked; требуется reset."
          : "State: ready. Дойдите до x=2, включите Jump, нажмите Move right."}
      </p>
      <CopyCode code={history.join("\n") || "Input log пуст"} />
      <label>
        Severity для обязательного пути без восстановления
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">Выберите</option>
          <option>High</option>
          <option>Low</option>
        </select>
      </label>
      <button onClick={() => setShow(true)}>Проверить решение</button>
      {show && (
        <p className="feedback">
          {severity === "High" ? "Верно." : "Оцените влияние."} High:
          блокируется прохождение обязательного пути. Укажите build, x=2,y=1,
          right+jump, частоту 1/1 в симуляторе и необходимость reset. Это
          учебный softlock, не crash.
        </p>
      )}
    </div>
  );
}
function CheckoutLab() {
  const [qty, setQty] = useState(2),
    [payment, setPayment] = useState(false),
    [count, setCount] = useState(0),
    [keyboard, setKeyboard] = useState(false);
  const subtotal = discount(qty * 5000),
    total = subtotal + 500;
  return (
    <div className="stack">
      <div className="card">
        <h2>Checkout · integer cents</h2>
        <p>
          Товар 50 EUR. Скидка 10% при ≥100 EUR до доставки. Доставка 5 EUR.
          Учебная идемпотентность фиксирует одну оплату до изменения корзины.
        </p>
        <label>
          Количество (1–10)
          <input
            type="number"
            min="1"
            max="10"
            value={qty}
            onChange={(e) => {
              setQty(
                Math.max(
                  1,
                  Math.min(10, Math.trunc(Number(e.target.value)) || 1),
                ),
              );
              setPayment(false);
              setCount(0);
            }}
          />
        </label>
        <div className="receipt">
          <span>До скидки</span>
          <strong>{(qty * 50).toFixed(2)} EUR</strong>
          <span>После скидки</span>
          <strong>{(subtotal / 100).toFixed(2)} EUR</strong>
          <span>Доставка</span>
          <strong>5.00 EUR</strong>
          <span>К оплате</span>
          <strong>{(total / 100).toFixed(2)} EUR</strong>
        </div>
        <button
          className="primary"
          onClick={() => {
            if (!payment) {
              setPayment(true);
              setCount(count + 1);
            }
          }}
        >
          Pay · test key order-1
        </button>
        <p className="feedback" role="status">
          {payment
            ? "Paid. Повтор того же ключа возвращает существующий результат."
            : "Pending."}{" "}
          Списаний в этой корзине: {count}.
        </p>
        <p className="muted">
          Это локальная демонстрация. Реальная идемпотентность должна
          обеспечиваться сервером и платёжным провайдером.
        </p>
      </div>
      <div className="card">
        <h2>Keyboard-only challenge</h2>
        <p>
          Без мыши: Tab до checkbox → Space → Tab до кнопки → Enter. Проверьте
          видимый focus и логичный порядок. Автопроверка подтверждает только
          выполнение задачи, не WCAG соответствие.
        </p>
        <label className="option">
          <input
            type="checkbox"
            checked={keyboard}
            onChange={(e) => setKeyboard(e.target.checked)}
          />
          Я выбрал доставку клавиатурой
        </label>
        <button disabled={!keyboard} onClick={() => setKeyboard(false)}>
          Подтвердить и сбросить challenge
        </button>
      </div>
    </div>
  );
}
function BrowserLab() {
  const [step, setStep] = useState(0),
    [message, setMessage] = useState(""),
    [locator, setLocator] = useState("heading");
  return (
    <div className="card">
      <h2>Browser Test Simulation</h2>
      <span className="tag orange">НЕ НАСТОЯЩИЙ PLAYWRIGHT RUNNER</span>
      <p>
        Симулятор объясняет последовательность goto → locator → assertion. Он не
        открывает страницу и не исполняет JavaScript теста.
      </p>
      <label>
        Locator
        <select value={locator} onChange={(e) => setLocator(e.target.value)}>
          <option value="heading">
            getByRole('heading', name: 'Example Domain')
          </option>
          <option value="button">getByRole('button', name: 'Pay')</option>
        </select>
      </label>
      <div className="actions">
        <button
          onClick={() => {
            setStep(1);
            setMessage("Simulated goto: example document loaded.");
          }}
        >
          1 · goto
        </button>
        <button
          disabled={step < 1}
          onClick={() => {
            setStep(2);
            setMessage(
              locator === "heading"
                ? "Locator found one heading."
                : "Locator matched zero elements.",
            );
          }}
        >
          2 · locate
        </button>
        <button
          disabled={step < 2}
          onClick={() =>
            setMessage(
              locator === "heading"
                ? "PASS (simulation): heading visible. Реальная проверка требует Playwright и браузера."
                : "FAIL (simulation): Pay отсутствует в учебном document.",
            )
          }
        >
          3 · assert
        </button>
      </div>
      <p role="status" className="feedback">
        {message || "Начните с goto."}
      </p>
      <CopyCode code={modules[9].lessons[1].example} />
      <CopyCode
        code={
          "# В отдельной локальной папке (установка требует интернета)\nnpm init playwright@latest\nnpx playwright test\nnpx playwright show-report\nnpx playwright show-trace trace.zip"
        }
      />
      <p className="muted">
        example.com — optional online tutorial. Для offline runner используйте
        локальный fixture и установленные браузеры. Наши E2E tests проверяют
        саму академию на localhost.
      </p>
    </div>
  );
}
export function Portfolio({ state }: { state: State }) {
  const md = `# QA Academy — учебное портфолио\nНе коммерческий проект. Seed-артефакты требуют выполнения и review.\n\n## Requirements\nAge 18–65; unique email; password >=8; 10% discount >=100 EUR before delivery; delivery 5 EUR; idempotent payments.\n\n## Risks\nDuplicate charges P3×I5=15; amount mismatch P3×I5=15; inaccessible checkout P3×I4=12.\n\n## Test plan\nScope: local registration, cart, API mock, SQL reconciliation. Entry: seeded build. Exit: critical checks passed, no unresolved critical defects. Excluded: real providers, production load, real device matrix.\n\n## Cases\n${capstoneCases.map((c) => `- ${c.join(" | ")} | Not Run (seed)`).join("\n")}\n\n## Seed bug reports\n${seedBugs.map((b) => `### ${b[0]} ${b[1]}\nSeverity: ${b[2]}\nEnvironment: local educational build\nPreconditions: reset fixture, inclusive discount rule\nSteps: ${b[3]}\n${b[4]}\nEvidence: simulated, requires verification\nFrequency: not measured\n`).join("\n")}\n## My artifacts\n${Object.entries(
    state.answers,
  )
    .map(([k, v]) => `### ${k}\n${v}`)
    .join(
      "\n\n",
    )}\n\n## Quiz history\n${state.attempts.map((a) => `Module ${a.module}: ${a.score}/${a.total}`).join("\n")}\n\n## Final summary\n${state.answers["capstone-summary"] || "Not completed. Record tested scope, actual results, open defects, residual risks and recommendation."}`;
  return (
    <div className="stack">
      <div className="card">
        <h2>Shop Local · Portfolio kit</h2>
        <p>
          18 тест-кейсов, 6 демонстрационных багов, требования и план. Seed
          cases имеют Not Run: экспорт не превращает их в выполненные проверки.
          Дополните собственными артефактами.
        </p>
        <div className="actions">
          <button
            className="primary"
            onClick={() =>
              download("qa-training-portfolio.md", md, "text/markdown")
            }
          >
            <Download size={16} /> Markdown
          </button>
          <button
            onClick={() =>
              download(
                "qa-training-portfolio.json",
                JSON.stringify(
                  {
                    label: "Educational, not commercial",
                    cases: capstoneCases,
                    seedBugs,
                    artifacts: state.answers,
                    history: state.attempts,
                  },
                  null,
                  2,
                ),
              )
            }
          >
            JSON
          </button>
          <button
            onClick={() =>
              download(
                "qa-test-cases.csv",
                "ID,Scenario,Expected,Status\n" +
                  capstoneCases
                    .map((c) =>
                      [...c, "Not Run"]
                        .map((v) => '"' + v.replaceAll('"', '""') + '"')
                        .join(","),
                    )
                    .join("\n"),
                "text/csv",
              )
            }
          >
            Cases CSV
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Сценарий</th>
                <th>Expected</th>
              </tr>
            </thead>
            <tbody>
              {capstoneCases.map((c) => (
                <tr key={c[0]}>
                  {c.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details>
          <summary>6 учебных bug reports</summary>
          {seedBugs.map((b) => (
            <div className="callout" key={b[0]}>
              <strong>
                {b[0]} · {b[1]} · {b[2]}
              </strong>
              <p>Шаги: {b[3]}</p>
              <p>{b[4]}</p>
            </div>
          ))}
        </details>
        <h3>Финальная практическая часть</h3>
        <ol>
          <li>SQL: найдите успешный платёж с неверной суммой (задание 16).</li>
          <li>API: получите и объясните 422, 409, 401 и 403.</li>
          <li>Bug builder: экспортируйте воспроизводимый отчёт скидки.</li>
          <li>Заполните матрицу требований и итоговый summary.</li>
          <li>
            Самопроверка: есть ли evidence, ограничения и честная маркировка?
          </li>
        </ol>
      </div>
    </div>
  );
}
export function Practice({
  id,
  state,
  update,
}: {
  id: number;
  state: State;
  update: Update;
}) {
  if (id === 2) return <Registration update={update} />;
  if (id === 3) return <ApiLab update={update} />;
  if (id === 4) return <SqlLab state={state} update={update} />;
  if (id === 5) return <NetworkLab />;
  if (id === 6) return <BugLab state={state} update={update} />;
  if (id === 7) return <RequirementsLab state={state} update={update} />;
  if (id === 8) return <GameLab />;
  if (id === 9) return <CheckoutLab />;
  if (id === 10) return <BrowserLab />;
  if (id === 12)
    return (
      <>
        <Portfolio state={state} />
        <label className="card">
          Итоговый test summary
          <textarea
            rows={8}
            value={state.answers["capstone-summary"] || ""}
            onChange={(e) =>
              update((s) => ({
                ...s,
                answers: { ...s.answers, "capstone-summary": e.target.value },
              }))
            }
            placeholder="Build, scope, результаты, дефекты, непроверенные области, остаточные риски, рекомендация…"
          />
        </label>
      </>
    );
  return (
    <Quiz
      key={id}
      title={
        id === 11
          ? "Интервью: проверьте принципы"
          : "Кейсы: приоритеты и виды тестирования"
      }
      questions={[
        {
          id: "applied-1",
          prompt: "За час до релиза обнаружено двойное списание. Что делать?",
          options: [
            "Сначала исправить иконку",
            "Зафиксировать critical defect, воспроизвести и рекомендовать no-go с evidence",
            "Скрыть проблему до завтра",
          ],
          correct: [1],
          explanation:
            "Деньги и целостность данных — высокий риск. Решение о релизе принимает ответственный владелец.",
          type: "single",
        },
        {
          id: "short-1",
          prompt:
            "Как называется проверка конкретного исправления? Введите английский термин.",
          options: [],
          correct: [],
          accepted: ["retest", "retesting", "confirmation testing"],
          explanation:
            "Retest подтверждает исправление; regression ищет побочные эффекты.",
          type: "short",
        },
      ]}
      onFinish={(score, total) =>
        update((s) => ({
          ...s,
          attempts: [
            ...s.attempts,
            { module: id, score, total, date: new Date().toISOString() },
          ],
        }))
      }
    />
  );
}

function ExpectedSql({ query }: { query: string }) {
  const [output, setOutput] = useState<{
    columns: string[];
    values: unknown[][];
  }>();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    executeSql(query)
      .then((r) => {
        if (active) setOutput(r);
      })
      .catch((e) => {
        if (active) setError(String(e));
      });
    return () => {
      active = false;
    };
  }, [query]);
  return (
    <div>
      <h3>Ожидаемый результат</h3>
      {error && <p>{error}</p>}
      {output ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {output.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {output.values.map((r, i) => (
                <tr key={i}>
                  {r.map((v, j) => (
                    <td key={j}>{v === null ? "NULL" : String(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">Вычисляем эталон локально…</p>
      )}
    </div>
  );
}
