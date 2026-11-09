import { describe, it, expect, vi } from "vitest";
import {
  grade,
  registration,
  discount,
  fresh,
  complete,
  load,
  save,
  exportState,
  importState,
  streak,
  review,
  mockApi,
  bugGrade,
  KEY,
} from "../src/engine";
import { modules, flashcards } from "../src/content";
import { interviewTopics, capstoneCases, seedBugs } from "../src/practice-data";
const memory = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) || null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
  };
};
describe("deterministic grading", () => {
  it("requires complete multiple selection, ignores ordering", () => {
    const q = modules[0].questions[8];
    expect(grade(q, [1, 0])).toBe(true);
    expect(grade(q, [0])).toBe(false);
    expect(grade(q, [0, 1, 2])).toBe(false);
  });
  it("does not reward an empty response", () =>
    expect(grade(modules[0].questions[0], [])).toBe(false));
  it("grades short answers with transparent normalization", () => {
    const q = {
      ...modules[0].questions[0],
      type: "short" as const,
      accepted: ["retest", "retesting"],
    };
    expect(grade(q, " RETEST ")).toBe(true);
    expect(grade(q, "regression")).toBe(false);
  });
});
describe("registration boundaries", () => {
  it.each(["18", "19", "64", "65"])("accepts %s", (a) =>
    expect(registration(a, "new@example.test", "12345678").ok).toBe(true),
  );
  it.each(["", "17", "66", "18.5", "abc"])("rejects %s", (a) =>
    expect(registration(a, "new@example.test", "12345678").ok).toBe(false),
  );
  it("rejects duplicate and short password", () => {
    expect(
      registration("25", "USED@example.test", "1234567").errors,
    ).toHaveLength(2);
  });
  it("distinguishes exclusive and inclusive price boundary", () => {
    expect(discount(10000)).toBe(9000);
    expect(discount(10000, false)).toBe(10000);
    expect(discount(10001)).toBe(9001);
  });
});
describe("local storage and backup", () => {
  it("persists full state", () => {
    const s = complete(fresh(), "1-1");
    s.notes["1-1"] = "My note";
    s.answers.a = "answer";
    s.cards.a = { due: "2026-11-10T00:00:00Z", interval: 1, reviews: 1 };
    const storage = memory();
    save(s, storage);
    expect(load(storage)).toEqual(s);
  });
  it("round trips without losing Unicode", () => {
    const s = fresh();
    s.notes.a = "Проверка NULL";
    expect(importState(exportState(s))).toEqual(s);
  });
  it("rejects invalid and future backups", () => {
    expect(() => importState("{")).toThrow();
    expect(() => importState('{"version":99}')).toThrow();
    const s = fresh();
    expect(() =>
      importState(
        JSON.stringify({ ...s, attempts: [{ module: 0, score: 9, total: 1 }] }),
      ),
    ).toThrow();
    expect(() => importState(JSON.stringify({ ...s, notes: [] }))).toThrow();
  });
  it("recovers from corrupt saved JSON", () => {
    const store = memory();
    store.setItem(KEY, "oops");
    expect(load(store)).toEqual(fresh());
  });
  it("surfaces write errors to caller", () =>
    expect(() =>
      save(fresh(), {
        setItem: () => {
          throw Error("quota");
        },
      }),
    ).toThrow("quota"));
});
describe("progression and review", () => {
  it("is idempotent for lesson and study date", () => {
    const s = complete(complete(fresh(), "1-1"), "1-1");
    expect(s.completed).toEqual(["1-1"]);
    expect(s.studyDates).toHaveLength(1);
    expect(s.recent).toEqual(["1-1"]);
  });
  it("counts contiguous dates, allows yesterday", () => {
    expect(
      streak(["2026-11-07", "2026-11-08"], new Date("2026-11-09T12:00:00Z")),
    ).toBe(2);
    expect(streak(["2026-11-06"], new Date("2026-11-09T12:00:00Z"))).toBe(0);
  });
  it("schedules repeated recall and resets hard cards", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-09T12:00:00Z"));
    let s = review(fresh(), "1-1", true);
    expect(s.cards["1-1"].interval).toBe(1);
    s = review(s, "1-1", true);
    expect(s.cards["1-1"].interval).toBe(2);
    s = review(s, "1-1", false);
    expect(s.cards["1-1"].interval).toBe(0);
    expect(s.cards["1-1"].reviews).toBe(3);
    vi.useRealTimers();
  });
});
describe("API mock and structured artifacts", () => {
  it("covers required response statuses", () => {
    expect(mockApi("GET", "/users/1", "", "").status).toBe(200);
    expect(mockApi("GET", "/users/999", "", "").status).toBe(404);
    expect(mockApi("POST", "/users", "{", "").status).toBe(400);
    expect(mockApi("POST", "/users", "{}", "").status).toBe(422);
    expect(
      mockApi("POST", "/users", '{"name":"A","email":"alex@example.test"}', "")
        .status,
    ).toBe(409);
    expect(
      mockApi("POST", "/users", '{"name":"A","email":"new@example.test"}', "")
        .status,
    ).toBe(201);
    expect(mockApi("DELETE", "/users/1", "", "").body).toBeNull();
    expect(mockApi("GET", "/admin", "", "").status).toBe(401);
    expect(mockApi("GET", "/admin", "", "user").status).toBe(403);
    expect(mockApi("GET", "/admin", "", "admin").status).toBe(200);
    expect(mockApi("GET", "/rate-limit", "", "").status).toBe(429);
    expect(mockApi("GET", "/error", "", "").status).toBe(500);
    expect(mockApi("GET", "/unavailable", "", "").status).toBe(503);
  });
  it("validates pagination and null payload", () => {
    expect(mockApi("GET", "/users?page=0", "", "").status).toBe(400);
    expect(mockApi("POST", "/users", "null", "").status).toBe(422);
  });
  it("grades bug structure honestly", () =>
    expect(bugGrade({ title: "bug" }).missing).toHaveLength(8));
});
describe("curriculum completeness", () => {
  it("contains all twelve modules with substantial unique seed content", () => {
    expect(modules).toHaveLength(12);
    const ids = new Set();
    modules.forEach((m) => {
      expect(m.lessons.length).toBeGreaterThanOrEqual(6);
      expect(m.questions.length).toBeGreaterThanOrEqual(10);
      expect(
        flashcards.filter((c) => c.module === m.id).length,
      ).toBeGreaterThanOrEqual(5);
      m.lessons.forEach((l) => {
        expect(l.theory.length).toBeGreaterThan(180);
        expect(l.practice.length).toBeGreaterThan(25);
        expect(ids.has(l.id)).toBe(false);
        ids.add(l.id);
      });
      m.questions.forEach((q) => {
        expect(q.correct.every((i) => i >= 0 && i < q.options.length)).toBe(
          true,
        );
        expect(grade(q, q.correct)).toBe(true);
      });
    });
    expect(
      new Set(modules.flatMap((m) => m.questions.map((q) => q.prompt))).size,
    ).toBe(120);
  });
  it("has a 60-question bilingual interview bank and capstone evidence", () => {
    expect(interviewTopics).toHaveLength(60);
    expect(new Set(interviewTopics.map((q) => q[0])).size).toBe(60);
    expect(capstoneCases).toHaveLength(18);
    expect(seedBugs).toHaveLength(6);
  });
});
