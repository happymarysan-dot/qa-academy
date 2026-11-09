# QA Academy status

Все 12 модулей, основные тренажёры и локальное хранение реализованы. Известные границы функций описаны в README и внутри приложения.

Возможные будущие улучшения (не заявлены как выполненные):

- Полноценный persistent CRUD mock с local collections и state transitions между запросами.
- Дополнительные faulty fixtures для каждого capstone seed defect; сейчас кейсы за пределами симуляторов требуют отдельной среды и остаются Not Run.
- Расширенный SQL task bank и weighted topic analytics по отдельным вопросам, а не по модулю.
- IndexedDB migration для больших объёмов заметок; текущий localStorage предназначен для одного ученика.
- Формальное ручное WCAG review со screen readers, реальный mobile-device regression и cross-browser matrix.
- Специализированная офлайн sandbox для запуска Playwright snippets: сейчас реальный runner работает только через CLI.
