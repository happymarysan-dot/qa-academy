import { useState } from "react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { modules } from "../content";
import { type State } from "../engine";
import WeakTopics from "./WeakTopics";
export default function Materials({ state }: { state: State }) {
  const [kind, setKind] = useState("bookmarks");
  const lessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, module: m.id })),
  );
  const rows = lessons.filter((l) =>
    kind === "bookmarks" ? state.bookmarks.includes(l.id) : !!state.notes[l.id],
  );
  return (
    <>
      <p className="eyebrow">ВАШИ МАТЕРИАЛЫ ОСТАЮТСЯ В БРАУЗЕРЕ</p>
      <h1>Вернуться к важному</h1>
      <div className="tabs">
        <button
          onClick={() => setKind("bookmarks")}
          className={kind === "bookmarks" ? "selected" : ""}
        >
          Закладки · {state.bookmarks.length}
        </button>
        <button
          onClick={() => setKind("notes")}
          className={kind === "notes" ? "selected" : ""}
        >
          Заметки · {Object.values(state.notes).filter(Boolean).length}
        </button>
      </div>
      {rows.length ? (
        rows.map((l) => (
          <div className="card material" key={l.id}>
            <a href={`#module/${l.module}/${l.id}`}>
              <h2>
                {l.title} <ArrowUpRight size={19} />
              </h2>
            </a>
            <p>{kind === "notes" ? state.notes[l.id] : l.theory}</p>
          </div>
        ))
      ) : (
        <div className="card empty">
          <Bookmark size={32} />
          <p>Откройте урок и добавьте закладку или заметку.</p>
        </div>
      )}
      <WeakTopics state={state} />
    </>
  );
}
