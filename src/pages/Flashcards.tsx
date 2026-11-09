import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { modules, flashcards } from "../content";
import { review, type State } from "../engine";
import { type Update } from "../Exercises";
export default function Flashcards({
  state,
  update,
  module,
}: {
  state: State;
  update: Update;
  module?: number;
}) {
  const [filter, setFilter] = useState(module || 0),
    [index, setIndex] = useState(0),
    [flipped, setFlipped] = useState(false),
    [all, setAll] = useState(false);
  const cards = flashcards.filter(
    (c) =>
      (!filter || c.module === filter) &&
      (all ||
        !state.cards[c.id] ||
        new Date(state.cards[c.id].due) <= new Date()),
  );
  const card = cards[index % Math.max(1, cards.length)];
  const due = flashcards.filter(
    (c) => !state.cards[c.id] || new Date(state.cards[c.id].due) <= new Date(),
  ).length;
  function answer(easy: boolean) {
    if (card) update((s) => review(s, card.id, easy));
    setFlipped(false);
    setIndex(easy && !all ? index : index + 1);
  }
  return (
    <section className="stack">
      <p className="eyebrow">SPACED REPETITION · АКТИВНОЕ ВСПОМИНАНИЕ</p>
      <h1>Знание, которое остаётся</h1>
      <p className="subtitle">
        Сначала объясните термин вслух, затем откройте карточку. «Помню»
        удваивает интервал от 1 до 60 дней; «Повторить» оставляет её на сегодня.
      </p>
      <div className="form-grid">
        {!module && (
          <label>
            Тема
            <select
              value={filter}
              onChange={(e) => {
                setFilter(Number(e.target.value));
                setIndex(0);
                setFlipped(false);
              }}
            >
              <option value="0">Все модули</option>
              {modules.map((m) => (
                <option value={m.id} key={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="option">
          <input
            type="checkbox"
            checked={all}
            onChange={(e) => {
              setAll(e.target.checked);
              setIndex(0);
            }}
          />
          Показывать и будущие карточки
        </label>
      </div>
      <span className="muted">
        Всего к повторению: {due} · В этой подборке: {cards.length}
      </span>
      {card ? (
        <>
          <button
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
            aria-label={flipped ? "Скрыть объяснение" : "Открыть объяснение"}
          >
            <small>
              {modules[card.module - 1].title} ·{" "}
              {flipped ? "ОБЪЯСНЕНИЕ" : "ВСПОМНИТЕ ТЕРМИН"}
            </small>
            {flipped ? <p>{card.back}</p> : <h2>{card.front}</h2>}
            <span>
              {flipped
                ? "Нажмите, чтобы вернуться к вопросу"
                : "Нажмите или Enter, чтобы перевернуть"}
            </span>
          </button>
          <div className="actions centered">
            <button disabled={!flipped} onClick={() => answer(false)}>
              <RotateCcw size={16} /> Повторить сегодня
            </button>
            <button
              className="primary"
              disabled={!flipped}
              onClick={() => answer(true)}
            >
              <Check size={16} /> Помню
            </button>
          </div>
          <p className="muted centered">
            История повторений этой карточки:{" "}
            {state.cards[card.id]?.reviews || 0}
          </p>
        </>
      ) : (
        <div className="card empty">
          <Check size={32} />
          <h2>На сегодня всё</h2>
          <p>
            Будущие повторения уже запланированы. Можно включить все карточки
            или перейти к практике.
          </p>
        </div>
      )}
    </section>
  );
}
