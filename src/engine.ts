import type { Question } from "./content";
export function grade(q: Question, answer: number[] | string) {
  if (q.type === "short")
    return (q.accepted || []).some(
      (a) => a.trim().toLowerCase() == String(answer).trim().toLowerCase(),
    );
  return (
    Array.isArray(answer) &&
    [...answer].sort().join(",") === [...q.correct].sort().join(",")
  );
}
export function registration(age: string, email: string, password: string) {
  const errors: string[] = [];
  if (
    age.trim() === "" ||
    !Number.isInteger(Number(age)) ||
    Number(age) < 18 ||
    Number(age) > 65
  )
    errors.push("Возраст: целое число 18–65 включительно.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Некорректный формат email.");
  else if (
    ["used@example.test", "qa@example.test"].includes(email.toLowerCase())
  )
    errors.push("Email уже занят.");
  if ([...password].length < 8)
    errors.push("Пароль короче 8 символов (Unicode code points).");
  return { ok: errors.length === 0, errors };
}
export function discount(cents: number, inclusive = true) {
  return (inclusive ? cents >= 10000 : cents > 10000)
    ? Math.round(cents * 0.9)
    : cents;
}
export type State = {
  version: 1;
  practice: {
    module: number;
    activity: string;
    result: string;
    date: string;
  }[];
  completed: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  attempts: { module: number; score: number; total: number; date: string }[];
  studyDates: string[];
  plan: number[];
  cards: Record<string, { due: string; interval: number; reviews: number }>;
  answers: Record<string, string>;
  board: Record<string, string>;
  theme: "dark" | "light";
  recent: string[];
};
export const fresh = (): State => ({
  version: 1,
  practice: [],
  completed: [],
  bookmarks: [],
  notes: {},
  attempts: [],
  studyDates: [],
  plan: [],
  cards: {},
  answers: {},
  board: {},
  theme: "dark",
  recent: [],
});
export const KEY = "qa-academy-v1";
export function validateState(x: unknown): State {
  if (!x || typeof x !== "object") throw Error("Ожидался JSON-объект.");
  const s = { ...x } as State;
  if (s.practice === undefined) s.practice = [];
  const strings = (a: unknown): a is string[] =>
    Array.isArray(a) &&
    a.length <= 100000 &&
    a.every((v) => typeof v === "string" && v.length < 100000);
  const record = (a: unknown) =>
    !!a && typeof a === "object" && !Array.isArray(a);
  if (
    !Array.isArray(s.practice) ||
    !s.practice.every(
      (p) =>
        p &&
        Number.isInteger(p.module) &&
        p.module >= 1 &&
        p.module <= 12 &&
        typeof p.activity === "string" &&
        typeof p.result === "string" &&
        typeof p.date === "string",
    ) ||
    s.version !== 1 ||
    !strings(s.completed) ||
    !strings(s.bookmarks) ||
    !strings(s.studyDates) ||
    !strings(s.recent) ||
    !Array.isArray(s.plan) ||
    !s.plan.every((v) => Number.isInteger(v) && v >= 0 && v < 14) ||
    !record(s.notes) ||
    !record(s.answers) ||
    !record(s.board) ||
    ![s.notes, s.answers, s.board].every((r) =>
      Object.values(r).every((v) => typeof v === "string" && v.length < 100000),
    ) ||
    !Array.isArray(s.attempts) ||
    !s.attempts.every(
      (a) =>
        a &&
        Number.isInteger(a.module) &&
        a.module >= 1 &&
        a.module <= 12 &&
        Number.isFinite(a.score) &&
        Number.isFinite(a.total) &&
        a.total > 0 &&
        a.score >= 0 &&
        a.score <= a.total &&
        typeof a.date === "string",
    ) ||
    !record(s.cards) ||
    !Object.values(s.cards).every(
      (c) =>
        c &&
        Number.isInteger(c.interval) &&
        c.interval >= 0 &&
        Number.isInteger(c.reviews) &&
        c.reviews >= 0 &&
        typeof c.due === "string" &&
        !isNaN(Date.parse(c.due)),
    ) ||
    !["dark", "light"].includes(s.theme)
  )
    throw Error("Неверная структура backup или неподдерживаемая версия.");
  return JSON.parse(JSON.stringify(s));
}
export function load(storage: Pick<Storage, "getItem"> = localStorage) {
  try {
    const raw = storage.getItem(KEY);
    return raw ? validateState(JSON.parse(raw)) : fresh();
  } catch {
    return fresh();
  }
}
export function save(
  s: State,
  storage: Pick<Storage, "setItem"> = localStorage,
) {
  storage.setItem(KEY, JSON.stringify(validateState(s)));
}
export function exportState(s: State) {
  return JSON.stringify(validateState(s), null, 2);
}
export function importState(raw: string) {
  if (raw.length > 5_000_000) throw Error("Backup превышает 5 MB.");
  return validateState(JSON.parse(raw));
}
export const today = () => new Date().toLocaleDateString("en-CA");
export function study(s: State): State {
  return { ...s, studyDates: [...new Set([...s.studyDates, today()])] };
}
export function complete(s: State, id: string): State {
  return study({
    ...s,
    completed: [...new Set([...s.completed, id])],
    recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 6),
  });
}
export function streak(dates: string[], now = new Date()) {
  const set = new Set(dates);
  const d = new Date(now);
  let n = 0;
  if (!set.has(d.toLocaleDateString("en-CA"))) d.setDate(d.getDate() - 1);
  while (set.has(d.toLocaleDateString("en-CA"))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
export function review(s: State, id: string, easy: boolean) {
  const old = s.cards[id];
  const interval = easy
    ? Math.min(60, old ? Math.max(1, old.interval * 2) : 1)
    : 0;
  const due = new Date();
  due.setDate(due.getDate() + interval);
  return study({
    ...s,
    cards: {
      ...s.cards,
      [id]: {
        due: due.toISOString(),
        interval,
        reviews: (old?.reviews || 0) + 1,
      },
    },
  });
}
export function download(
  name: string,
  text: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const mockUsers = [
  { id: 1, name: "Alex", email: "alex@example.test", role: "user" },
  { id: 2, name: "Dana", email: "dana@example.test", role: "user" },
  { id: 3, name: "Sam", email: "sam@example.test", role: "admin" },
  { id: 4, name: "Jo", email: "jo@example.test", role: "user" },
];
export function mockApi(
  method: string,
  path: string,
  payload: string,
  token: string,
) {
  let body: unknown = {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Training": "local-mock",
  };
  const res = (status: number, data: unknown) => ({
    status,
    body: data,
    headers,
  });
  try {
    body = payload.trim() ? JSON.parse(payload) : {};
  } catch {
    return res(400, { error: "Invalid JSON" });
  }
  const data = body as Record<string, unknown>;
  let url: URL;
  try {
    url = new URL(path, "http://localhost");
  } catch {
    return res(400, { error: "Invalid path" });
  }
  if (url.origin !== "http://localhost")
    return res(400, { error: "Use a local mock path such as /users/1" });
  if (url.pathname === "/rate-limit")
    return {
      ...res(429, { error: "Rate limit exceeded" }),
      headers: { ...headers, "Retry-After": "60" },
    };
  if (url.pathname === "/unavailable")
    return res(503, { error: "Maintenance" });
  if (url.pathname === "/error") return res(500, { error: "Internal error" });
  if (url.pathname === "/admin") {
    if (token !== "admin" && token !== "user")
      return res(401, { error: "Valid token required" });
    return token === "admin"
      ? res(200, { admin: true })
      : res(403, { error: "Insufficient role" });
  }
  if (url.pathname === "/users" && method === "GET") {
    const page = Number(url.searchParams.get("page") || 1),
      limit = Number(url.searchParams.get("limit") || 2);
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 10
    )
      return res(400, { error: "page >=1; limit 1..10" });
    return res(200, {
      data: mockUsers.slice((page - 1) * limit, page * limit),
      total: 4,
      page,
    });
  }
  if (url.pathname === "/users" && method === "POST") {
    if (
      !data ||
      typeof data !== "object" ||
      typeof data.name !== "string" ||
      !data.name.trim() ||
      typeof data.email !== "string" ||
      !/^\S+@\S+\.\S+$/.test(data.email)
    )
      return res(422, { error: "name and valid email required" });
    if (mockUsers.some((u) => u.email === data.email))
      return res(409, { error: "Email conflict" });
    return {
      ...res(201, { id: 5, name: data.name, email: data.email }),
      headers: { ...headers, Location: "/users/5" },
    };
  }
  const user = mockUsers.find((u) => url.pathname === `/users/${u.id}`);
  if (user) {
    if (method === "GET") return res(200, user);
    if (method === "DELETE") return res(204, null);
    if (method === "PUT" || method === "PATCH") {
      if (
        !data ||
        typeof data !== "object" ||
        typeof data.name !== "string" ||
        !data.name.trim()
      )
        return res(422, { error: "name required" });
      return res(200, { ...user, name: data.name });
    }
  }
  return res(404, { error: "Not found" });
}
export function bugGrade(fields: Record<string, string>) {
  const required = [
    "title",
    "environment",
    "preconditions",
    "steps",
    "expected",
    "actual",
    "severity",
    "frequency",
  ];
  const missing = required.filter(
    (k) =>
      !fields[k]?.trim() ||
      fields[k].trim().length < (k === "severity" || k === "frequency" ? 1 : 8),
  );
  return {
    score: required.length - missing.length,
    total: required.length,
    missing,
  };
}

export function recordPractice(
  s: State,
  module: number,
  activity: string,
  result: string,
): State {
  return study({
    ...s,
    practice: [
      ...s.practice,
      { module, activity, result, date: new Date().toISOString() },
    ].slice(-500),
  });
}
