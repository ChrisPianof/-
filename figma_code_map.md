# figma_code_map.md — AlfaBank
## Overview
Маппинг Figma-компонентов → @alfalab/core-components. Источник истины для двусторонней синхронизации.

@alfalab/core-components: 50.12.0

| Figma | Код (npm / путь) | Тип | Статус | Заметка |
|-------|-----------------|-----|--------|---------|
| IsleBlock | `@alfalab/core-components/steps` → `Steps` | component | ✓ | Нет /desktop субпакета. Карточка-обёртка — вручную. Corp: `@alfalab/core-components-themes/steps/corp.css` |

### Do
- Обновлять при каждой новой Figma-ссылке
- Указывать статус: ✓ найден · ~ частичный · ✗ отсутствует
- Проверять changelog при смене версии @alfalab

### Don't
- Don't игнорировать строки со статусом ✗ — спросить дизайнера
- Don't удалять строки со статусом ~ без финального решения
