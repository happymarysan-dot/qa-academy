import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { study, type State } from "../engine";
import { type Update } from "../Exercises";
import { interviewTopics } from "../practice-data";
export default function Interview({
  state,
  update,
}: {
  state: State;
  update: Update;
}) {
  const [ids, setIds] = useState<number[]>([]),
    [index, setIndex] = useState(0),
    [submitted, setSubmitted] = useState(false),
    [rubric, setRubric] = useState([0, 0, 0, 0]),
    [saved, setSaved] = useState(false),
    [timer, setTimer] = useState(false),
    [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!timer || !ids.length || submitted) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [timer, ids.length, submitted]);
  function start() {
    const pool = interviewTopics.map((_, i) => i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setIds(pool.slice(0, 5));
    setIndex(0);
    setSubmitted(false);
    setSaved(false);
    setSeconds(0);
  }
  const id = ids[index],
    q = interviewTopics[id];
  return (
    <>
      <p className="eyebrow">60 ВОПРОСОВ · ENGLISH ANSWERS · SELF-ASSESSMENT</p>
      <h1>Interview room</h1>
      <p className="subtitle">
        Спокойная репетиция перед настоящим разговором. 5 случайных вопросов,
        follow-ups и разбор по рубрике.
      </p>
      <div className="card">
        <label className="option">
          <input
            type="checkbox"
            checked={timer}
            onChange={(e) => setTimer(e.target.checked)}
          />
          Считать время ответа (без ограничения)
        </label>
        <button className="primary" onClick={start}>
          {ids.length ? "Новый случайный набор" : "Начать интервью"}{" "}
          <ArrowRight size={17} />
        </button>
        <p className="muted">
          Свободный текст не оценивается автоматически. Вы выставляете баллы по
          рубрике после сравнения с примером.
        </p>
      </div>
      {q && (
        <div className="card interview-card">
          <div className="section-title">
            <span className="tag teal">QUESTION {index + 1} / 5</span>
            {timer && (
              <span className="mono">
                {Math.floor(seconds / 60)}:
                {String(seconds % 60).padStart(2, "0")}
              </span>
            )}
          </div>
          <h2>{q[0]}</h2>
          <label>
            Your answer in English
            <textarea
              rows={7}
              value={state.answers[`interview-${id}`] || ""}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  answers: {
                    ...s.answers,
                    [`interview-${id}`]: e.target.value,
                  },
                }))
              }
              disabled={submitted}
              placeholder="Definition → example → checks → honest limits"
            />
          </label>
          {!submitted ? (
            <button
              className="primary"
              disabled={!state.answers[`interview-${id}`]?.trim()}
              onClick={() => setSubmitted(true)}
            >
              Отправить и открыть разбор
            </button>
          ) : (
            <>
              <div className="example">
                <p className="eyebrow">
                  MODEL ANSWER · ADAPT TO YOUR ACTUAL EXPERIENCE
                </p>
                <p>{q[1]}</p>
                <small>{q[2]}</small>
              </div>
              <h3>Follow-up</h3>
              <p>
                Can you give a concrete example? What would you check if the
                first attempt failed?
              </p>
              <label>
                Мой ответ на follow-up
                <textarea
                  value={state.answers[`followup-${id}`] || ""}
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      answers: {
                        ...s.answers,
                        [`followup-${id}`]: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <h3>Рубрика самостоятельной оценки</h3>
              <p className="muted">
                0 — отсутствует, 1 — частично, 2 — ясно и корректно. Балл не
                подтверждает уровень специалиста.
              </p>
              {[
                "Техническая точность",
                "Логичная структура",
                "Конкретный пример",
                "Честные ограничения",
              ].map((x, i) => (
                <label className="rubric-row" key={x}>
                  {x}
                  <select
                    value={rubric[i]}
                    onChange={(e) => {
                      setSaved(false);
                      setRubric(
                        rubric.map((v, j) =>
                          j === i ? Number(e.target.value) : v,
                        ),
                      );
                    }}
                  >
                    {[0, 1, 2].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
              ))}
              <div className="actions">
                <button
                  disabled={saved}
                  onClick={() => {
                    update((s) =>
                      study({
                        ...s,
                        answers: {
                          ...s.answers,
                          [`rubric-${id}`]: `${rubric.join(",")} = ${rubric.reduce((a, b) => a + b, 0)}/8`,
                        },
                      }),
                    );
                    setSaved(true);
                  }}
                >
                  {saved
                    ? "Самооценка сохранена"
                    : `Сохранить ${rubric.reduce((a, b) => a + b, 0)}/8`}
                </button>
                <button
                  className="primary"
                  onClick={() => {
                    if (index < 4) {
                      setIndex(index + 1);
                      setSubmitted(false);
                      setRubric([0, 0, 0, 0]);
                      setSaved(false);
                      setSeconds(0);
                    } else {
                      setIds([]);
                    }
                  }}
                >
                  {index < 4 ? "Следующий вопрос" : "Завершить набор"}{" "}
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <h2 className="section-gap">Банк вопросов · {interviewTopics.length}</h2>
      <p className="muted">
        В режиме тренировки модельный ответ виден сразу. В mock interview он
        раскрывается только после отправки.
      </p>
      <div className="question-bank">
        {interviewTopics.map((q, i) => (
          <details className="card" key={q[0]}>
            <summary>
              {String(i + 1).padStart(2, "0")} · {q[0]}
            </summary>
            <p>{q[1]}</p>
            <p className="muted">{q[2]}</p>
            {state.answers[`rubric-${i}`] && (
              <small>Ваша самооценка: {state.answers[`rubric-${i}`]}</small>
            )}
          </details>
        ))}
      </div>
    </>
  );
}
