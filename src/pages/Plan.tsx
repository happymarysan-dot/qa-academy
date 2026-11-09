import { ArrowUpRight, Clock } from "lucide-react";
import { plan, planModules } from "../content";
import { study, type State } from "../engine";
import { type Update } from "../Exercises";
import { Ring, go } from "../ui";
export default function Plan({
  state,
  update,
}: {
  state: State;
  update: Update;
}) {
  return (
    <>
      <p className="eyebrow">НЕ МАРАФОН. УСТОЙЧИВЫЙ РИТМ.</p>
      <h1>14 дней до более уверенного QA</h1>
      <p className="subtitle">
        Это обзорный план закрепления, не обещание освоить всю программу за две
        недели. Отмечайте и отменяйте выполнение в своём темпе.
      </p>
      <div className="card plan-progress">
        <Ring value={Math.round((state.plan.length / 14) * 100)} />
        <div>
          <h2>{state.plan.length} из 14 шагов</h2>
          <p className="muted">
            30–60 минут в день · глубокую практику можно растянуть
          </p>
        </div>
      </div>
      <div className="plan-list">
        {plan.map((p, i) => (
          <div
            className={`card plan-row ${state.plan.includes(i) ? "done" : ""}`}
            key={p}
          >
            <label className="plan-check">
              <input
                type="checkbox"
                checked={state.plan.includes(i)}
                onChange={() =>
                  update((s) =>
                    study({
                      ...s,
                      plan: s.plan.includes(i)
                        ? s.plan.filter((x) => x !== i)
                        : [...s.plan, i],
                    }),
                  )
                }
              />
              <span>ДЕНЬ {String(i + 1).padStart(2, "0")}</span>
              <strong>{p}</strong>
            </label>
            <span className="muted">
              <Clock size={14} /> {i > 11 ? "60" : "30–45"} мин
            </span>
            <button
              className="text-btn"
              onClick={() => go(`module/${planModules[i]}`)}
            >
              К материалам <ArrowUpRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
