import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Code2,
  Database,
  Flame,
  MessageSquare,
  ShieldCheck,
  Target,
  CalendarDays,
} from "lucide-react";
import { modules } from "../content";
import { streak, type State } from "../engine";
import { Ring, go, icons } from "../ui";
import WeakTopics from "./WeakTopics";
export default function Dashboard({
  state,
  pct,
}: {
  state: State;
  pct: number;
}) {
  const next = modules
    .flatMap((m) => m.lessons.map((l) => ({ m, l })))
    .find(({ l }) => !state.completed.includes(l.id));
  const attempts = state.attempts;
  const accuracy = attempts.length
    ? Math.round(
        (attempts.reduce((a, x) => a + x.score, 0) /
          attempts.reduce((a, x) => a + x.total, 0)) *
          100,
      )
    : 0;
  const focus = modules.filter((m) => [3, 4, 7, 10].includes(m.id));
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            <span className="live-dot" /> ВАШ ЛИЧНЫЙ ПУТЬ В QA
          </p>
          <h1>
            Практика. Понимание.
            <br />
            <em>Уверенность на интервью.</em>
          </h1>
          <p className="subtitle">
            От знакомых инструментов — к новым возможностям.
            <br />
            Один урок, один разобранный кейс, один шаг вперёд.
          </p>
        </div>
        <div className="heading-mark" aria-hidden="true">
          <ShieldCheck size={70} strokeWidth={1} />
          <span>
            QUALITY IS A<br />
            WAY OF THINKING
          </span>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat">
          <span>
            <Target size={17} /> Текущий уровень
          </span>
          <strong>
            {pct < 35
              ? "Junior"
              : pct < 80
                ? "Junior+ · практика"
                : "Финальное повторение"}
          </strong>
          <small>Учебный прогресс, не сертификация</small>
        </div>
        <div className="stat">
          <span>
            <BookOpen size={17} /> Программа
          </span>
          <strong>
            {state.completed.length}
            <small> / 72 урока</small>
          </strong>
          <div className="progress-track">
            <div style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="stat">
          <span>
            <Flame size={17} /> Серия занятий
          </span>
          <strong>
            {streak(state.studyDates)} <small>дн.</small>
          </strong>
          <small>По локальным датам вашей практики</small>
        </div>
        <div className="stat">
          <span>
            <Check size={17} /> Точность ответов
          </span>
          <strong>{attempts.length ? accuracy + "%" : "—"}</strong>
          <small>{attempts.length} сохранённых попыток</small>
        </div>
      </div>
      <div className="overview-grid">
        <section className="continue-card">
          <div>
            <span className="tag teal">
              {next ? "РЕКОМЕНДУЕМЫЙ СЛЕДУЮЩИЙ ШАГ" : "ПРОГРАММА ПРОЙДЕНА"}
            </span>
            <p className="small-label">
              {next
                ? `Модуль ${String(next.m.id).padStart(2, "0")} · ${next.m.title}`
                : "Повторение и capstone"}
            </p>
            <h2>{next?.l.title || "Вернитесь к слабым темам"}</h2>
            <p>
              {next
                ? next.l.theory.split(". ")[0] + "."
                : "Откройте историю попыток и повторите темы, где результат ниже 70%."}
            </p>
            <div className="actions">
              <button
                className="primary"
                onClick={() =>
                  go(next ? `module/${next.m.id}/${next.l.id}` : "module/12")
                }
              >
                {state.completed.length
                  ? "Продолжить обучение"
                  : "Начать обучение"}{" "}
                <ArrowRight size={17} />
              </button>
              <span className="muted">
                <Clock size={14} /> 15–25 мин · {next?.m.level || "Практика"}
              </span>
            </div>
          </div>
          <div className="continue-art" aria-hidden="true">
            <div className="orbit one" />
            <div className="orbit two" />
            <div className="art-core">
              <Code2 size={40} />
              <small>learn. test. repeat.</small>
            </div>
            <div className="float-label">
              <Check size={13} /> understanding passed
            </div>
          </div>
        </section>
        <section className="card daily-plan">
          <div className="section-title">
            <h3>Ваш учебный ритм</h3>
            <CalendarDays size={19} />
          </div>
          <Ring value={Math.round((state.plan.length / 14) * 100)} />
          <p>
            <strong>{state.plan.length} из 14 дней</strong>
            <br />
            <span className="muted">Небольшие шаги каждый день</span>
          </p>
          <button className="text-btn" onClick={() => go("plan")}>
            Открыть план <ArrowRight size={15} />
          </button>
        </section>
      </div>
      <div className="section-title section-gap">
        <div>
          <p className="eyebrow">УСИЛИВАЕМ ПРАКТИЧЕСКУЮ БАЗУ</p>
          <h2>Ваши точки роста</h2>
        </div>
        <a href="#modules" className="text-btn">
          Вся программа <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="focus-grid">
        {focus.map((m) => {
          const Icon = icons[m.id - 1];
          const count = m.lessons.filter((l) =>
            state.completed.includes(l.id),
          ).length;
          return (
            <a className="focus-card" key={m.id} href={`#module/${m.id}`}>
              <div className="section-title">
                <div className="module-icon">
                  <Icon size={21} />
                </div>
                <span className="mono">{String(m.id).padStart(2, "0")}</span>
              </div>
              <h3>{m.title}</h3>
              <p>{m.subtitle}</p>
              <div className="progress-track">
                <div style={{ width: `${(count / 6) * 100}%` }} />
              </div>
              <div className="card-meta">
                <span>{count}/6 уроков</span>
                <ArrowUpRight size={16} />
              </div>
            </a>
          );
        })}
      </div>
      <div className="bottom-grid">
        <section className="card">
          <div className="section-title">
            <h3>Короткая практика</h3>
            <span className="tag">10–15 МИН</span>
          </div>
          <a className="practice-link" href="#module/3/practice">
            <span className="module-icon">
              <Code2 size={18} />
            </span>
            <span>
              <strong>Поговорим с API</strong>
              <small>Запросы, ответы и проверка контракта</small>
            </span>
            <ArrowRight size={18} />
          </a>
          <a className="practice-link" href="#module/4/practice">
            <span className="module-icon">
              <Database size={18} />
            </span>
            <span>
              <strong>Найти пропавший платёж</strong>
              <small>Настоящий SQL, учебные данные</small>
            </span>
            <ArrowRight size={18} />
          </a>
          <a className="practice-link" href="#interview">
            <span className="module-icon">
              <MessageSquare size={18} />
            </span>
            <span>
              <strong>Ответить по-английски</strong>
              <small>60 вопросов и честная самооценка</small>
            </span>
            <ArrowRight size={18} />
          </a>
        </section>
        <section className="card">
          <div className="section-title">
            <h3>История обучения</h3>
            <Clock size={17} />
          </div>
          {!state.recent.length &&
          !attempts.length &&
          !state.practice.length ? (
            <div className="empty">
              <BookOpen size={29} />
              <p>Здесь появятся ваши первые результаты.</p>
              <small>Пройдите урок и сохраните mini-quiz.</small>
            </div>
          ) : (
            <>
              <div className="stack compact">
                {state.recent.slice(0, 3).map((id) => {
                  const m = modules.find((m) =>
                    m.lessons.some((l) => l.id === id),
                  );
                  return (
                    <a
                      key={id}
                      href={`#module/${m?.id}/${id}`}
                      className="history-item"
                    >
                      <Check size={15} />
                      {m?.lessons.find((l) => l.id === id)?.title}
                    </a>
                  );
                })}
              </div>
              {attempts
                .slice(-3)
                .reverse()
                .map((a, i) => (
                  <p className="history-item" key={i}>
                    <span className="tag">
                      {a.score}/{a.total}
                    </span>
                    {modules[a.module - 1].title}
                    <small>{new Date(a.date).toLocaleDateString("ru")}</small>
                  </p>
                ))}
            </>
          )}
        </section>
      </div>
      {state.practice.length > 0 && (
        <section className="card section-gap">
          <h3>Последние упражнения</h3>
          {state.practice
            .slice(-5)
            .reverse()
            .map((p, i) => (
              <p className="history-item" key={i}>
                <span className="tag">М{p.module}</span>
                <span>{p.activity}</span>
                <strong>{p.result}</strong>
                <small>{new Date(p.date).toLocaleDateString("ru")}</small>
              </p>
            ))}
        </section>
      )}
      <WeakTopics state={state} />
    </>
  );
}
