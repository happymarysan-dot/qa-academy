import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { glossary } from "../content";
export default function Glossary() {
  const [q, setQ] = useState("");
  const rows = glossary.filter((x) =>
    `${x.en} ${x.ru} ${x.definition}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <p className="eyebrow">
        ОБЪЯСНЯЕМ ПО-РУССКИ · РАБОТАЕМ С ENGLISH TERMINOLOGY
      </p>
      <h1>Глоссарий RU / EN</h1>
      <label>
        Найти термин
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="severity, JOIN, риск…"
        />
      </label>
      <div className="glossary-grid">
        {rows.map((x) => (
          <div className="card" key={x.en}>
            <span className="term">{x.en}</span>
            <h3>{x.ru}</h3>
            <p>{x.definition}</p>
            <a href={`#module/${x.module}`}>
              К модулю <ArrowUpRight size={14} />
            </a>
          </div>
        ))}
      </div>
      {!rows.length && <p>Совпадений нет.</p>}
    </>
  );
}
