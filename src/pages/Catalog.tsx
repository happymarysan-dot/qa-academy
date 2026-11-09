import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { modules, paths } from "../content";
import { type State } from "../engine";
import { icons } from "../ui";
export default function Catalog({ state }: { state: State }) {
  const [path, setPath] = useState(paths[0]);
  return (
    <>
      <p className="eyebrow">12 МОДУЛЕЙ · 72 УРОКА · ПРАКТИКА В КАЖДОМ</p>
      <h1>Программа обучения</h1>
      <p className="subtitle">
        Выберите направление или проходите по порядку. Основа знакома? Проверьте
        себя и двигайтесь к пробелам.
      </p>
      <label className="filter-label">
        Учебный путь
        <select value={path} onChange={(e) => setPath(e.target.value)}>
          {paths.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <div className="catalog-grid">
        {modules
          .filter((m) => path === paths[0] || m.path.includes(path))
          .map((m) => {
            const Icon = icons[m.id - 1];
            const count = m.lessons.filter((l) =>
              state.completed.includes(l.id),
            ).length;
            return (
              <a
                href={`#module/${m.id}`}
                className="card module-card"
                key={m.id}
              >
                <div className="section-title">
                  <div className="module-icon">
                    <Icon size={23} />
                  </div>
                  <span className="mono">{String(m.id).padStart(2, "0")}</span>
                </div>
                <div className="chips">
                  <span className="tag">{m.level}</span>
                  <span className="tag">6 уроков</span>
                </div>
                <h2>{m.title}</h2>
                <p>{m.subtitle}</p>
                <small>
                  Предпосылки:{" "}
                  {m.prerequisites.length
                    ? m.prerequisites
                        .map((n) => modules[n - 1].title)
                        .join(", ")
                    : "не нужны"}
                </small>
                <div className="progress-track">
                  <div style={{ width: `${(count / 6) * 100}%` }} />
                </div>
                <div className="card-meta">
                  <span>{count}/6 завершено · 10 вопросов</span>
                  <ArrowUpRight size={17} />
                </div>
              </a>
            );
          })}
      </div>
    </>
  );
}
