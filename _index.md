# _index.md — AlfaBank

React-прототип на @alfalab/core-components (Vite + TS).

## Правила и маппинг

- [Rules.md](Rules.md) — правила работы с Figma-ссылками и двусторонней синхронизации
- [figma_code_map.md](figma_code_map.md) — маппинг Figma-компонентов/токенов → @alfalab/core-components

## Дизайн-система

- [Design_system/_index.md](Design_system/_index.md) — индекс дизайн-системы (все компоненты, токены, правила)

## Код

- `src/components/` — React-реализации
- `src/screens/` — экраны
- `src/utils/` — утилиты

## Скрипты и preview

- [scripts/check_alfalab_version.py](scripts/check_alfalab_version.py) — хук: проверяет версию @alfalab после npm install, обновляет figma_code_map.md
- Preview-сервер: конфиг `alfabank2` в корневом `.claude/launch.json`. CWD через bash: `bash -c "cd 'AlfaBank' && npm run dev"`
