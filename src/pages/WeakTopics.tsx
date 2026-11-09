import { Target } from "lucide-react";
import { modules } from "../content";
import { type State } from "../engine";
export default function WeakTopics({ state }: { state: State }) {
  const rows = modules
    .map((m) => {
      const a = state.attempts.filter((x) => x.module === m.id);
      return {
        m,
        n: a.length,
        rate: a.length
          ? Math.round(
              (a.reduce((s, x) => s + x.score, 0) /
                a.reduce((s, x) => s + x.total, 0)) *
                100,
            )
          : 0,
      };
    })
    .filter((x) => x.n);
  if (!rows.length) return null;
  return (
    <section className="card section-gap">
      <div className="section-title">
        <h2>Что повторить дальше</h2>
        <Target size={20} />
      </div>
      <p className="muted">
        По всем объективным попыткам, включая повторные. Самооценки интервью
        сюда не входят. Ниже 70% — рекомендация вернуться к теории.
      </p>
      {rows.map(({ m, rate, n }) => (
        <div className="analytics-row" key={m.id}>
          <a href={`#module/${m.id}`}>{m.title}</a>
          <div className="progress-track">
            <div style={{ width: `${rate}%` }} />
          </div>
          <span>
            {rate}% · {n} попыт.
          </span>
          <a href={`#module/${m.id}`}>
            {rate < 70 ? "Повторить" : "Закрепить"} ↗
          </a>
        </div>
      ))}
    </section>
  );
}
