> Этот репозиторий содержит учебный исходный код QA Academy. Прогресс, заметки и ответы хранятся в браузере и в репозиторий не входят. Само приложение остаётся локальным; публикация кода не включает GitHub Pages.

# QA Academy

Приватная локальная учебная SPA для одного ученика. Русский интерфейс и объяснения, English QA terminology и sample interview answers. Никаких аккаунтов, backend, аналитики, внешней AI, remote database или публикации.

## Быстрый запуск

Нужен Node.js 22.12+ (проверено на Node 24) и npm.

```bash
cd qa-academy
npm install
npm run dev
```

Откройте **http://localhost:3000**. Dev server слушает **127.0.0.1:3000**, `strictPort: true`. Preview настроен так же. Не добавляйте `--host`, не используйте 0.0.0.0, туннели или deployment.

Обычный локальный запуск готовой сборки:

```bash
npm run build
npm run preview
```

Для установки dependencies нужен интернет. После установки и сборки все материалы, fonts (system), icons и SQLite WASM работают **без внешней сети**, пока локальный сервер запущен. Это не PWA: закрытие сервера делает страницы недоступными; service worker не нужен. Vite HMR в dev использует только локальный WebSocket. Для спокойного обучения предпочтителен preview.

## Что реализовано

- 12 модулей, 72 урока: objectives, теория, пошаговый разбор, пример, практика, заметки, ошибки, mini-quiz, summary и официальные external resources.
- 120 уникальных объективных вопросов модулей; single choice, multiple choice и true/false, short-answer с явными accepted values в практикуме. Финальная проверка объединяет 11 вопросов предыдущих модулей и 10 вопросов capstone (21 задание). Проверка — deterministic, без AI.
- 72 flashcards с локальным scheduling: recall 1 → 2 → 4 … до 60 дней; «повторить» возвращает на сегодня. Это простой прозрачный алгоритм, не SM-2.
- Paths Manual QA Fundamentals, Web/API QA, QA Analyst, Game QA, Interview Prep; difficulty и рекомендованные prerequisites. Прогресс не блокирует доступ.
- Dashboard, local streak по датам браузера, история уроков/попыток/практики, weak-topic analytics, 14-дневный редактируемый план.
- Поиск по урокам и interview bank, glossary RU/EN, bookmarks, notes, dark/light theme, mobile navigation, keyboard focus и reduced motion.
- Registration simulator: 18–65 inclusive, email syntax/uniqueness и password ≥8 code points, prediction и coverage границ; discount ambiguity >100/≥100.
- Mock API explorer: local dataset, editable JSON, методы, роли, статусы и headers, field/status assertions; copyable Postman snippets и downloadable 5-request collection.
- Real SQLite (`sql.js`, local WASM) в Web Worker: 22 задания, users/orders/products/payments, expected SQL/output, ordered result grading. Один read-only SELECT/WITH, запрет comments/recursive CTE/write/functions с большим allocation, 4000 символов, 500 строк и timeout 2 секунды. Worker завершается при timeout. Это учебный guard, не универсальная песочница для чужого кода.
- Mock Network Inspector: filter, payload, responses, timings; 500 login, 401/403 и slow network. Инструкции DevTools/Charles/Fiddler.
- Bug builder с required-field checks, JSON/Markdown export; persistable test run board Passed/Failed/Blocked/Not Run.
- Requirements workshop: discount/login/checkout/payment, ambiguity checks, editable matrix и probability×impact.
- Game-state collision reproduction; keyboard challenge; checkout discount и повторная оплата с одним учебным ключом; browser-test simulation.
- 60 разных интервью-вопросов с RU commentary и English model answers; 5 случайных вопросов, timer, written answers, follow-up, 4×0–2 self-rating.
- Capstone Shop Local: требования, риски, план, 18 cases, 6 illustrative bugs, практическая финальная часть, summary и Markdown/JSON/CSV portfolio exports.
- JSON backup/restore, schema validation, reset с подтверждением. Невалидный импорт не изменяет state.

## Хранение и приватность

Используется **localStorage**, ключ `qa-academy-v1`, versioned JSON. Сохраняются completed lessons, bookmarks, notes, quiz answers/scores, interview answers/self-ratings, study dates, plan, card history, test board, last executed SQL draft и до 500 practice events. Данные в forms учебных симуляторов обычно живут в памяти и сбрасываются при смене вкладки/модуля; история outcomes сохраняется для registration/API/SQL. Это намеренное ограничение, не реальный backend.

Хранилище **не зашифровано**. Пользователи того же компьютера или browser profile могут получить доступ. Не вводите CV, имя/контакты, настоящие credentials, платёжные данные и конфиденциальную информацию. Учебные email используют `.test`.

Origin определяет хранилище: `localhost` и `127.0.0.1`, другой порт, профиль или браузер имеют разные данные. Для учебы выберите один адрес, рекомендуем `http://localhost:3000`. Перед очисткой browser data, переустановкой или импортом сделайте backup через About/Privacy. Backup-файл тоже не шифруется. Импорт **заменяет**, а не объединяет state.

HTTP здесь допустим из-за loopback-only доступа. **HTTP без TLS не защищает публичные сети.** Не публикуйте приложение. External docs открываются только по вашему клику, помечены ↗; они потребуют сети и действуют по своим privacy policies. Внешний JSONPlaceholder tutorial — optional, приложение его не вызывает.

## Проверки

```bash
npm test
npm run lint
npm run build
```

Настоящие E2E smoke tests (отдельная установка Chromium, не нужна ученику):

```bash
npm run browsers:install
npm run test:e2e
```

`test:e2e` запускает Vite на loopback, если он ещё не запущен. Для Linux с отсутствующими системными библиотеками установите Chromium dependencies средствами вашей ОС; `npx playwright install-deps chromium` может потребовать административных прав. В managed sandbox разрешение на loopback listen/Chromium может быть ограничено политикой среды.

Unit tests проверяют scoring, registration/discount boundaries, storage errors и corrupt data, JSON roundtrip/rejection, lesson progression, streak, spaced repetition, API statuses, bug-field checks, curriculum counts и все SQL solutions. E2E проходят 12 модулей, quiz, persistence, SQL Worker/WASM, отсутствие external requests, checkout, mobile menu и theme. См. `VERIFICATION.md`.

## Честные ограничения

- Mock API не делает HTTP. Mutations независимы и не сохраняют изменения dataset; assertions задаются безопасными полями, произвольный `pm.test` JS здесь не исполняется.
- JSONPlaceholder не является полноценным CRUD backend, POST фиктивен; validation может отсутствовать. Collection содержит exercise на наблюдение этого ограничения.
- Game State Lab — deterministic state machine, не Unreal runtime. Unreal tutorial вводный и не даёт коммерческого опыта.
- Browser Test Simulation не запускает Playwright. Реальный runner используется в CLI E2E tests; учебный snippet ученик запускает отдельно.
- Свободные тексты, portfolio и качество bug report автоматически не оцениваются. Builder проверяет структуру, rubric выставляет ученик. Счётчик завершённых уроков — self-report; quiz results хранятся отдельно.
- Seed capstone reports демонстрационные. Не все defects присутствуют в корректных симуляторах; реальные провайдеры, mobile device matrix, Unreal и external tools не исполняются в SPA. Export cases изначально имеют Not Run.
- Уроки — практический фундамент с заданиями, не замена официальной документации или полноценному рабочему опыту. Уровень на dashboard отражает только учебный прогресс, не сертификацию.

## Структура

`src/content.ts` — modules/lessons/cards/glossary/plan; `questions.ts` — applied checks; `lesson-details.ts` — расширенный разбор; `practice-data.ts` — SQL tasks, interview bank, portfolio, Postman collection. `engine.ts` — pure grading/storage/progression/mock functions. `sql.ts`, `sql-worker.ts`, `sql-client.ts` — engine, worker и timeout. `App.tsx` — shell, `pages/` — отдельные учебные страницы, `ui.tsx` — общие элементы; `Exercises.tsx` — интерактивные лаборатории; `styles.css` — локальная адаптивная тема. Tests: `tests/*.test.ts`, `tests/e2e`.

## Troubleshooting

- **Порт занят:** остановите свой процесс на 3000; strictPort намеренно не выбирает другой порт. Не запускайте сервер с внешним host.
- **localhost не открывается:** проверьте вывод Vite и доступность IPv4 loopback. Попробуйте 127.0.0.1:3000 для диагностики, учитывая отдельное хранилище origin.
- **Данные исчезли:** проверьте browser profile, origin и private mode; восстановите JSON backup. Автоматического cloud recovery нет.
- **Storage quota/permissions:** приложение покажет ошибку сохранения; экспортируйте текущий state до закрытия. Не очищайте данные без backup.
- **SQL timeout:** упростите JOIN, фильтруйте раньше; все seed solutions рассчитаны на маленький dataset. На очень медленном устройстве первая загрузка WASM может потребовать повторного запуска.
- **WASM не загружается:** используйте Vite/preview, не открывайте index.html через file://; пересоберите dist. WASM должен быть в dist/assets.
- **npm не подключается:** проверьте сеть/корпоративный proxy; не отключайте TLS verification. Runtime доступа к npm не требует.
