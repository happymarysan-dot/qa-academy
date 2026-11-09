import { useState } from "react";
import { LockKeyhole, Download, Upload } from "lucide-react";
import {
  fresh,
  today,
  exportState,
  importState,
  download,
  type State,
} from "../engine";
import { type Update } from "../Exercises";
export default function Privacy({
  state,
  update,
}: {
  state: State;
  update: Update;
}) {
  const [message, setMessage] = useState(""),
    [reset, setReset] = useState(false);
  return (
    <>
      <p className="eyebrow">
        <LockKeyhole size={14} /> LOCAL BY DESIGN
      </p>
      <h1>Ваше обучение. Ваши данные.</h1>
      <p className="subtitle">
        Без аккаунтов, облака, аналитики и внешних AI API.
      </p>
      <div className="stack">
        <section className="card">
          <h2>Как это работает</h2>
          <p>
            QA Academy — локальная SPA. Vite dev и preview привязаны к{" "}
            <code>127.0.0.1:3000</code>. Откройте{" "}
            <code>http://localhost:3000</code>. HTTP допустим здесь из-за
            ограничения доступа localhost; он не обеспечивает защиту на
            публичных сетях. Не меняйте host на 0.0.0.0 и не публикуйте
            приложение.
          </p>
          <p>
            Уроки, иконки, JavaScript и SQLite WASM находятся локально. Во время
            обучения внешние запросы не нужны. Установка npm-пакетов требует
            интернета один раз; после build можно запускать preview без сети.
            Локальный сервер должен продолжать работать. Внешние ссылки
            открываются только по вашему действию и отмечены ↗.
          </p>
          <h3>Хранилище — не шифрование</h3>
          <p>
            Прогресс, ответы, заметки, история карточек и попыток сохраняются в
            localStorage этого origin. Другие пользователи компьютера или того
            же профиля браузера могут получить доступ. Не сохраняйте CV,
            контакты, реальные пароли, токены, карты и конфиденциальные
            сведения. Смена браузера, профиля или порта создаёт отдельное
            хранилище. Очистка данных браузера удалит прогресс.
          </p>
          <p>
            Не используйте приватный режим для долгого хранения. Приложение не
            делает резервные копии автоматически и не загружает данные. Экспорты
            также не зашифрованы.
          </p>
        </section>
        <section className="card">
          <h2>Резервная копия</h2>
          <p>
            Экспорт включает локальные заметки и ответы. Импорт полностью
            заменяет текущие данные после проверки структуры; сначала сохраните
            backup.
          </p>
          <div className="actions">
            <button
              className="primary"
              onClick={() =>
                download(`qa-academy-${today()}.json`, exportState(state))
              }
            >
              <Download size={17} /> Экспорт JSON
            </button>
            <label className="button import-button">
              <Upload size={17} /> Выбрать backup
              <input
                type="file"
                accept="application/json,.json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    if (file.size > 5_000_000) throw Error("Максимум 5 MB.");
                    const raw = await file.text();
                    const incoming = importState(raw);
                    update(() => incoming);
                    setMessage("Backup проверен и восстановлен.");
                  } catch (err) {
                    setMessage(
                      "Импорт отклонён: " +
                        (err instanceof Error ? err.message : String(err)),
                    );
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {message && (
            <p className="feedback" role="status">
              {message}
            </p>
          )}
        </section>
        <section className="card">
          <h2>Начать заново</h2>
          <p>
            Сброс удалит локальный прогресс этого приложения. Файлы backup на
            диске останутся.
          </p>
          {!reset ? (
            <button className="danger" onClick={() => setReset(true)}>
              Сбросить данные…
            </button>
          ) : (
            <div className="actions">
              <button
                className="danger"
                onClick={() => {
                  update(() => fresh());
                  setReset(false);
                  setMessage("Локальные данные сброшены.");
                }}
              >
                Да, удалить мой прогресс
              </button>
              <button onClick={() => setReset(false)}>Отмена</button>
            </div>
          )}
        </section>
        <section className="card">
          <h2>Об учебных ограничениях</h2>
          <p>
            Mock API не отправляет HTTP и не сохраняет mutations. Game State Lab
            не является Unreal. Browser Test Simulation не исполняет Playwright.
            SQL использует настоящий SQLite с учебными read-only ограничениями.
            Bug builder проверяет структуру, а не смысл отчёта. Интервью
            оцениваете вы по rubric. Завершение курса не подтверждает
            квалификацию и коммерческий опыт.
          </p>
        </section>
      </div>
    </>
  );
}
