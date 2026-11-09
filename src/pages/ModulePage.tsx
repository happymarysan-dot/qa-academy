import { useEffect, useState } from "react";
import { ArrowRight, Bookmark, Check, ChevronLeft } from "lucide-react";
import { modules } from "../content";
import { complete, study, type State } from "../engine";
import { Practice, Quiz, type Update } from "../Exercises";
import { walkthroughs, extraResources } from "../lesson-details";
import { Ring } from "../ui";
import Flashcards from "./Flashcards";
export default function ModulePage({
  id,
  selected,
  state,
  update,
}: {
  id: number;
  selected?: string;
  state: State;
  update: Update;
}) {
  const m = modules[id - 1];
  const [tab, setTab] = useState(
      selected === "practice"
        ? "practice"
        : selected === "quiz"
          ? "quiz"
          : "lessons",
    ),
    [lessonIndex, setLessonIndex] = useState(
      Math.max(
        0,
        m.lessons.findIndex((l) => l.id === selected),
      ),
    );
  useEffect(() => {
    if (selected === "practice") setTab("practice");
    else if (selected === "quiz") setTab("quiz");
    else if (selected) {
      const i = m.lessons.findIndex((l) => l.id === selected);
      if (i >= 0) {
        setLessonIndex(i);
        setTab("lessons");
      }
    }
  }, [selected, m]);
  const lesson = m.lessons[lessonIndex];
  function attempt(
    score: number,
    total: number,
    answers: Record<string, number[] | string>,
  ) {
    update((s) =>
      study({
        ...s,
        answers: {
          ...s.answers,
          ...Object.fromEntries(
            Object.entries(answers).map(([k, v]) => [
              "quiz-" + k,
              JSON.stringify(v),
            ]),
          ),
        },
        attempts: [
          ...s.attempts,
          { module: id, score, total, date: new Date().toISOString() },
        ],
      }),
    );
  }
  const finalQuestions = [
    ...modules.slice(0, 11).map((m) => m.questions[6]),
    ...m.questions,
  ];
  return (
    <>
      <a className="text-btn back" href="#modules">
        <ChevronLeft size={16} /> К программе
      </a>
      <div className="section-title">
        <div>
          <p className="eyebrow">
            МОДУЛЬ {String(id).padStart(2, "0")} · {m.level.toUpperCase()}
          </p>
          <h1>{m.title}</h1>
          <p className="subtitle">{m.subtitle}</p>
        </div>
        <Ring
          value={Math.round(
            (m.lessons.filter((l) => state.completed.includes(l.id)).length /
              6) *
              100,
          )}
          size={74}
        />
      </div>
      <p className="muted">
        Предпосылки:{" "}
        {m.prerequisites.length
          ? m.prerequisites.map((n) => modules[n - 1].title).join(" → ")
          : "можно начинать без подготовки"}
        .{" "}
        {m.prerequisites.some((n) =>
          modules[n - 1].lessons.some((l) => !state.completed.includes(l.id)),
        ) && "Рекомендуется сначала пройти основу; доступ к урокам открыт."}
      </p>
      <div className="tabs" role="tablist" aria-label="Разделы модуля">
        {[
          ["lessons", "Уроки · 6"],
          ["practice", "Практикум"],
          ["quiz", id === 12 ? "Финальная оценка" : "Проверка · 10"],
          ["cards", "Карточки · 6"],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            id={`tab-${key}`}
            aria-controls="module-panel"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const keys = ["lessons", "practice", "quiz", "cards"];
                const next =
                  keys[
                    (keys.indexOf(tab) + (e.key === "ArrowRight" ? 1 : 3)) % 4
                  ];
                setTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div id="module-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "lessons" ? (
          <div className="lesson-layout">
            <nav className="lesson-nav" aria-label="Уроки модуля">
              {m.lessons.map((l, i) => (
                <button
                  className={i === lessonIndex ? "selected" : ""}
                  key={l.id}
                  onClick={() => setLessonIndex(i)}
                >
                  <span>
                    {state.completed.includes(l.id) ? (
                      <Check size={15} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  {l.title}
                </button>
              ))}
            </nav>
            <article className="lesson-content" key={lesson.id}>
              <div className="section-title">
                <p className="eyebrow">УРОК {lessonIndex + 1} / 6 · ~20 МИН</p>
                <button
                  className={`icon-btn ${state.bookmarks.includes(lesson.id) ? "bookmarked" : ""}`}
                  aria-label={
                    state.bookmarks.includes(lesson.id)
                      ? "Убрать закладку"
                      : "Добавить закладку"
                  }
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      bookmarks: s.bookmarks.includes(lesson.id)
                        ? s.bookmarks.filter((x) => x !== lesson.id)
                        : [...s.bookmarks, lesson.id],
                    }))
                  }
                >
                  <Bookmark size={20} />
                </button>
              </div>
              <h2>{lesson.title}</h2>
              <p className="term">{lesson.term}</p>
              <div className="objectives">
                <strong>После урока вы сможете</strong>
                <ul>
                  <li>
                    Объяснить {lesson.term} своими словами и привести рабочий
                    пример.
                  </li>
                  <li>
                    Выбрать проверку для кейса «{lesson.title}» и обосновать
                    expected result.
                  </li>
                  <li>
                    Распознать типичную ошибку и зафиксировать ограничение
                    проверки.
                  </li>
                </ul>
              </div>
              <h3>Разберёмся на практике</h3>
              <p className="theory">{lesson.theory}</p>
              {id === 1 && lessonIndex === 2 && (
                <table>
                  <thead>
                    <tr>
                      <th>Вид</th>
                      <th>Вопрос</th>
                      <th>Объём</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Smoke</td>
                      <td>Сборка пригодна?</td>
                      <td>Широко, неглубоко</td>
                    </tr>
                    <tr>
                      <td>Retest</td>
                      <td>Баг исправлен?</td>
                      <td>Конкретный defect</td>
                    </tr>
                    <tr>
                      <td>Regression</td>
                      <td>Что сломалось рядом?</td>
                      <td>По рискам изменения</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {id === 1 && lessonIndex === 5 && (
                <div
                  className="pyramid"
                  aria-label="Пирамида тестов: немного E2E, больше integration, много unit"
                >
                  <div>E2E · дорого, сквозной путь</div>
                  <div>Integration · связи компонентов</div>
                  <div>Unit · быстрые проверки логики</div>
                </div>
              )}
              <div className="example">
                <p className="eyebrow">РАБОЧИЙ ПРИМЕР</p>
                <p>{lesson.example}</p>
              </div>
              <h3>Пошаговый разбор</h3>
              {walkthroughs[(id - 1) * 6 + lessonIndex].map((p, i) => (
                <p key={i} className="walkthrough">
                  {p}
                </p>
              ))}
              <h3>Попробуйте самостоятельно</h3>
              <p>{lesson.practice}</p>
              <label>
                Мой ответ / заметки
                <textarea
                  rows={5}
                  placeholder="Что проверяю → данные → ожидаемый результат → риск"
                  value={state.notes[lesson.id] || ""}
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      notes: { ...s.notes, [lesson.id]: e.target.value },
                    }))
                  }
                />
              </label>
              <details>
                <summary>Подсказка и объяснение</summary>
                <p>
                  {m.questions[lessonIndex].explanation} Сопоставьте с примером:{" "}
                  {lesson.example} Затем измените одно условие и предскажите
                  результат. Неизвестное явно запишите вопросом.
                </p>
              </details>
              <div className="warning">
                <strong>Частая ошибка</strong>
                <p>{lesson.mistake}</p>
              </div>
              <Quiz
                key={lesson.id}
                title="Mini-quiz: примените принцип"
                questions={[m.questions[lessonIndex]]}
                onFinish={attempt}
              />
              <div className="summary">
                <h3>Что забрать с собой</h3>
                <p>{lesson.theory.split(". ").slice(0, 2).join(". ")}.</p>
                <p>
                  <a href={m.resource} target="_blank" rel="noreferrer">
                    Официальная документация ↗ внешний, необязательный ресурс
                  </a>
                </p>
                {extraResources[id]?.map(([label, url]) => (
                  <p key={url}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {label} ↗ внешний ресурс
                    </a>
                  </p>
                ))}
              </div>
              <div className="actions">
                <button
                  className="primary"
                  onClick={() => {
                    update((s) => complete(s, lesson.id));
                    if (lessonIndex < 5) setLessonIndex(lessonIndex + 1);
                    else setTab("practice");
                  }}
                >
                  {state.completed.includes(lesson.id)
                    ? "Пройдено · дальше"
                    : "Отметить урок пройденным"}{" "}
                  <ArrowRight size={17} />
                </button>
                {state.completed.includes(lesson.id) && (
                  <button
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        completed: s.completed.filter((x) => x !== lesson.id),
                      }))
                    }
                  >
                    Вернуть в изучение
                  </button>
                )}
              </div>
              <p className="muted">
                Отметка урока — ваша самооценка. Результаты quizzes учитываются
                отдельно.
              </p>
            </article>
          </div>
        ) : tab === "practice" ? (
          <Practice id={id} state={state} update={update} />
        ) : tab === "quiz" ? (
          <Quiz
            key={`module-${id}`}
            questions={id === 12 ? finalQuestions : m.questions}
            onFinish={attempt}
            title={
              id === 12
                ? "12 тем: итоговая объективная часть"
                : "Проверка модуля"
            }
          />
        ) : (
          <Flashcards state={state} update={update} module={id} />
        )}
      </div>
    </>
  );
}
