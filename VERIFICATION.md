# Verification · 2026-11-09

Проверено в Linux, Node 24.22.1, Chromium через Playwright. Это конкретная проверенная конфигурация, не обещание cross-browser/WCAG сертификации.

- [x] `npm test`: **39 passed**, 2 files. Scoring (включая multi-select и short answer), registration/discount, persistence и backup validation, lesson progression, streak, flashcard scheduling, mock API, bug structure, curriculum counts; real SQLite executes все 22 task solutions, NULL/JOIN/aggregation/reconciliation и rejects restricted SQL.
- [x] `npm run lint`: без ошибок/предупреждений.
- [x] `npm run build`: TypeScript и production Vite build прошли. SQLite WASM и worker bundled locally, vendor/app разделены.
- [x] `npm run test:e2e`: **9 passed** на production preview, дополнительно до этого 8 сценариев прошли на dev.
- [x] Все 12 module routes, 6 уроков каждого, quizzes (10 для модулей 1–11, финал 21 вопрос), practice tabs, bookmarks/notes/progression после reload.
- [x] Реальный SQL Worker/WASM исполняется и проверяет expected output локально.
- [x] Registration prediction, checkout double submission, quiz 10/10 с сохранением.
- [x] Backup download → reset → restore; неверный import сохраняет текущие данные.
- [x] Flashcard recall history, plan checkboxes, content search, interview submission и self-rating.
- [x] Network/requirements/game/browser simulation; bug builder 8/8, test board status после reload; Markdown/CSV downloads с проверкой содержимого и строк.
- [x] Mobile 390×844: menu navigation, no horizontal document overflow, light theme. Визуально просмотрены screenshots desktop 1440px и mobile SQL.
- [x] Отдельная production-проверка `http://localhost:3000` с browser routing, блокирующим любые внешние hosts: **0 external requests, 0 page errors**, включая загрузку WASM.
- [x] `ss -ltn 'sport = :3000'`: Local Address **127.0.0.1:3000**. Значение `0.0.0.0:*` в Peer Address — wildcard удалённого peer, не listening interface.

Screenshots находятся в `artifacts/`: dashboard-desktop.png, dashboard-mobile.png, sql-mobile.png, privacy-light-mobile.png. Проверка не использовала персональные данные и не публиковала сайт.

## Не проверялось / границы

Реальные Postman/Charles/Fiddler/Unreal installations, сторонние API, mobile hardware, реальный payment provider и production нагрузка не запускались. Для них есть инструкции, exercises и явные ограничения. Screen-reader review и полная WCAG assessment не проводились. Свободные ответы не AI-graded; seed capstone defects иллюстративны. LocalStorage и backups не зашифрованы.

Production preview оставлен работающим только на loopback. Для обычной учебы: `npm run build`, затем `npm run preview`; dev также доступен через `npm run dev`. Одновременно используйте только один сервер на порту 3000.

## GitHub Pages preparation · 2026-11-10

- `npm run lint`, all 39 unit tests and `npm run build:pages` passed.
- All 9 Playwright smoke tests passed against the production preview at `http://127.0.0.1:3000/qa-academy/` with a 390px mobile check, real SQL Worker/WASM, persistence and JSON/Markdown/CSV exports.
- Generated JS/CSS and WASM paths include `/qa-academy/`; hash routes stay under that prefix.
- Public-hosting privacy text distinguishes public lessons from browser-local progress; the storage key and export/import format are unchanged.
- `.github/workflows/pages.yml` builds and publishes only static `dist`. GitHub repository Settings → Pages → Source must be set to GitHub Actions before the first deployment.
