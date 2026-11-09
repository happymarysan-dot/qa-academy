import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Library,
  LockKeyhole,
  Menu,
  MessageSquare,
  Search,
  Sun,
  Moon,
  X,
  CalendarDays,
  Layers,
} from "lucide-react";
import { modules } from "./content";
import { load, save, type State } from "./engine";
import { type Update } from "./Exercises";
import { searchContent } from "./search";
import { go } from "./ui";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import ModulePage from "./pages/ModulePage";
import Plan from "./pages/Plan";
import Flashcards from "./pages/Flashcards";
import Interview from "./pages/Interview";
import Glossary from "./pages/Glossary";
import Materials from "./pages/Materials";
import Privacy from "./pages/Privacy";
function useRoute() {
  const [route, setRoute] = useState(location.hash.slice(1) || "dashboard");
  useEffect(() => {
    const f = () => {
      setRoute(location.hash.slice(1) || "dashboard");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return route;
}
export default function App() {
  const route = useRoute();
  const [narrow, setNarrow] = useState(
    () => window.matchMedia("(max-width:700px)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width:700px)");
    const changed = () => setNarrow(media.matches);
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  const [state, setState] = useState<State>(() => load()),
    [error, setError] = useState(""),
    [open, setOpen] = useState(false),
    [query, setQuery] = useState("");
  const update: Update = (fn) => setState((s) => fn(s));
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    try {
      save(state);
      setError("");
    } catch {
      setError(
        "Не удалось сохранить прогресс: хранилище недоступно или заполнено. Экспортируйте backup перед закрытием.",
      );
    }
  }, [state]);
  useEffect(() => {
    setOpen(false);
  }, [route]);
  const nav = [
    ["dashboard", "Обзор", LayoutDashboard],
    ["modules", "Программа", BookOpen],
    ["plan", "План на 14 дней", CalendarDays],
    ["flashcards", "Карточки", Layers],
    ["interview", "Интервью", MessageSquare],
    ["glossary", "Глоссарий RU / EN", Library],
    ["bookmarks", "Мои материалы", Bookmark],
  ] as const;
  const total = modules.reduce((n, m) => n + m.lessons.length, 0);
  const pct = Math.round(
    (state.completed.filter((x) =>
      modules.some((m) => m.lessons.some((l) => l.id === x)),
    ).length /
      total) *
      100,
  );
  let page;
  const [pageId, moduleId, lessonId] = route.split("/");
  if (pageId === "module" && modules[Number(moduleId) - 1])
    page = (
      <ModulePage
        key={moduleId}
        id={Number(moduleId)}
        selected={lessonId}
        state={state}
        update={update}
      />
    );
  else if (pageId === "modules") page = <Catalog state={state} />;
  else if (pageId === "plan") page = <Plan state={state} update={update} />;
  else if (pageId === "flashcards")
    page = <Flashcards state={state} update={update} />;
  else if (pageId === "interview")
    page = <Interview state={state} update={update} />;
  else if (pageId === "glossary") page = <Glossary />;
  else if (pageId === "bookmarks") page = <Materials state={state} />;
  else if (pageId === "privacy")
    page = <Privacy state={state} update={update} />;
  else page = <Dashboard state={state} pct={pct} />;
  const results = searchContent(query);
  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("main");
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        К содержимому
      </a>
      {open && (
        <button
          className="scrim"
          aria-label="Закрыть меню"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        id="main-sidebar"
        inert={narrow && !open}
        className={open ? "sidebar open" : "sidebar"}
      >
        <a href="#dashboard" className="brand">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <span>
            QA Academy<small>PRIVATE LEARNING SPACE</small>
          </span>
        </a>
        <div className="sidebar-caption">ВАШЕ ПРОСТРАНСТВО</div>
        <nav aria-label="Главная навигация">
          {nav.map(([id, name, Icon]) => (
            <a
              href={`#${id}`}
              key={id}
              className={
                pageId === id || (id === "modules" && pageId === "module")
                  ? "active"
                  : ""
              }
            >
              <Icon size={19} />
              {name}
              {id === "modules" && <small>12</small>}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            <span>Ваш путь к следующему уровню</span>
            <strong>{pct}%</strong>
            <div className="progress-track">
              <div style={{ width: `${pct}%` }} />
            </div>
            <small>
              {state.completed.length} из {total} уроков
            </small>
          </div>
          <a href="#privacy" className="privacy-link">
            <LockKeyhole size={16} />
            <span>
              Только на вашем устройстве
              <small>Локально. Приватно. Без облака.</small>
            </span>
          </a>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            aria-label="Открыть меню"
            aria-controls="main-sidebar"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Menu size={22} />
          </button>
          <span className="breadcrumb">
            Моё обучение <ChevronRight size={14} />{" "}
            <strong>
              {pageId === "module"
                ? modules[Number(moduleId) - 1]?.title
                : nav.find((x) => x[0] === pageId)?.[1] || "Обзор"}
            </strong>
          </span>
          <div className="header-tools">
            <div className="search-box">
              <Search size={16} />
              <input
                aria-label="Поиск по всем урокам"
                placeholder="Найти тему, термин, урок…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd>⌕</kbd>
              {query && (
                <button
                  className="icon-btn"
                  aria-label="Очистить поиск"
                  onClick={() => setQuery("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              className="icon-btn"
              aria-label={
                state.theme === "dark" ? "Светлая тема" : "Тёмная тема"
              }
              onClick={() =>
                update((s) => ({
                  ...s,
                  theme: s.theme === "dark" ? "light" : "dark",
                }))
              }
            >
              {state.theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <span className="avatar" aria-label="Профиль локального ученика">
              QA
            </span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {error && (
            <div className="feedback bad" role="alert">
              {error}
            </div>
          )}
          {query ? (
            <section className="stack">
              <p className="eyebrow">ПОИСК ПО УЧЕБНЫМ МАТЕРИАЛАМ</p>
              <h1>Найдено материалов: {results.length}</h1>
              <p className="muted">
                Ищем уроки, разборы, задания, quiz, glossary и interview bank.
              </p>
              {results.map((entry) => (
                <button
                  key={entry.id}
                  className="card result"
                  onClick={() => {
                    go(entry.route);
                    setQuery("");
                  }}
                >
                  <small>{entry.label}</small>
                  <h3>{entry.title}</h3>
                  <p>{entry.text.slice(0, 200)}…</p>
                  <ArrowRight size={18} />
                </button>
              ))}
              {!results.length && (
                <p>Попробуйте «NULL», «оплата» или «regression».</p>
              )}
            </section>
          ) : (
            page
          )}
          <footer>
            <span>QA Academy · Учимся задавать правильные вопросы.</span>
            <a href="#privacy">
              <LockKeyhole size={13} /> Local only
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
