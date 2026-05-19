# Rules.md — AlfaBank
## Overview
Правила двусторонней синхронизации Figma ↔ код. Маппинг компонентов, ведение figma_code_map.md, обновление при смене версии пакета.

## Термины и уточнения

«Положи в Left» — уточнить: внутрь `BackgroundPlate` или в колонку Left рядом с ней?

## Dev-сервер

Если порт 5175 не слушается (`lsof -iTCP:5175 -sTCP:LISTEN` → пусто) — запускать сам, не просить пользователя:

```bash
cd /Users/vadimpianof/Desktop/Claude/AlfaBank && npm run dev -- --port 5175
```

Через `Bash` с `run_in_background: true`. `preview_start` MCP заблокирован — использовать Bash. После запуска проверять stdout: `tail` лог-файла, дождаться `ready in Xms` и `Local: http://localhost:5175/`.

## Workflow: Figma → Design_system → Код

Применяется когда юзер даёт Figma-ссылку на паттерн / компонент. Все правила приёма паттерна — в одном месте.

### Pre-flight

- Проверить актуальное имя папки Google Drive (была `Сlaude` кириллицей, стала `Claude`):
  ```bash
  ls "$HOME/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/"
  ```
- Если Figma MCP недоступен → попросить юзера положить `.fig` в Google Drive и работать через `open <path>` + содержимое связанных файлов

### Шаги

1. **Изучить** через Figma MCP: `get_design_context`, `get_variable_defs`. Опционально `get_metadata`, `get_code_connect_map`, `get_libraries`. `get_screenshot` — только по явному запросу юзера (permissions ask).
2. **Извлечь имя** компонента / паттерна по конвенциям Альфы: `ЭтоБаза :: …`, `Паттерн :: …`, `Компонент :: …`, `❌ LocalComponents :: Figma Only`.
3. **Match check в `figma_code_map.md`** — поиск по Figma-имени и алиасам (колонка Figma).
4. **Branch:**
   - **Match найден** → дополнить связанный `.md` в `Design_system/` (новый раздел / вариант / правило). Не дублировать уже имеющееся. Если расхождение в значениях (например, spacing 24 → 16) — `.fig` источник истины для дизайна, обновить значение в `.md` (опционально one-line комментарий о смене).
   - **Match не найден** → создать новый `[Component].md` в `Design_system/`. ОБЯЗАТЕЛЬНЫЕ привязки:
     - Секция в `Components.md` (импорт + минимальный пример) — правило `_index.md:10`, AutoTest `md_index_freshness`
     - Строка в `figma_code_map.md` с алиасами (Figma-имя + короткое имя из имени `.fig`) — AutoTest `md_figma_indexed`
5. **Раздел `## Источник Figma` в `.md`** — формат:
   ```
   ## Источник Figma
   `~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/<Имя>.fig`
   ```
   Конвенции имён `.fig` (см. список в `Design_system/_index.md` → «Локальные .fig»):
   - `Компонент __ <Name>.fig` — отдельный компонент
   - `Раздел __ <Name>.fig` — паттерн / раздел
   - `Web __ <Name>.fig` — глобальная библиотека
6. **Алиасы в `figma_code_map.md`** — короткое имя из `.fig` (например, `Компонент __ TitleView.fig` → алиас «TitleView») + Figma-имя из node + жаргон («Островок», «Подложка»). Алиасы разделять `/`.
7. **Обновить `Design_system/_index.md` → «Локальные .fig» → "Текущее содержимое":**
   - `.fig` уже лежит → строка с ✅
   - `.fig` planned (юзер ещё не экспортил) → я указываю planned path в `.md`; в `_index.md` строка без ✅ до подтверждения юзера; обновляю на ✅ когда юзер скажет «положил»
8. **AutoTests прогоняются автоматически** (PostToolUse hook). Должны пройти:
   - `md_command_indexed`, `md_index_freshness` — секция в Components.md
   - `md_figma_indexed` — строка в figma_code_map.md
   - `md_hierarchy`, `md_links_only`, `md_long_line`, `md_dup_lines` — стандартные
9. **Отчёт юзеру:**
   - Какие `.md` изменены / созданы (markdown-ссылки)
   - Что добавлено (короткое summary)
   - Открытые TBD
   - **Путь к `.fig`** (точка контакта) — повторно в ответе для удобства

## Workflow: Код → Figma (reverse)

Применяется когда `.md` уже актуален (правило / variant закреплены в коде), а `.fig` отстал и нужно сказать дизайнеру обновить Figma.

1. Сформулировать diff: что есть в `.md`, чего нет / устарело в `.fig`
2. Уведомить юзера: путь к `.fig`, что обновить, какие значения / variants
3. Юзер обновляет Figma → экспортирует `.fig` обратно в Google Drive
4. (опц.) Я перепроверяю синхронность через `get_design_context` после обновления

## Edge cases

- **Локальный компонент `❌ LocalComponents :: Figma Only`** — записать только в `figma_code_map.md` со статусом ✗ и пометкой «не реализуется в коде». Отдельный `.md` НЕ создавать — `md_figma_indexed` чек не требуется для таких, потому что нет `.md` файла.
- **Паттерн пересекает несколько компонентов** (например, Footer формы = Button × N + Checkbox) — атомарные компоненты дополняются в их `.md`; композиционный паттерн идёт как раздел в `.md` главного связанного компонента (например, Footer формы → раздел в Buttons.md). Если разрастается до 100+ строк — выделить в отдельный `.md` с правилами выше.
- **Конфликт значений (Figma обновился)** — `.fig` побеждает для дизайна-значений (spacing, color, size). Логику применения в коде менять только если изменение значений требует переразметки.
- **Имя `.fig` меняется** — юзер сообщает, я обновляю алиасы в `figma_code_map.md` (колонка Figma) и список в `Design_system/_index.md` → «Локальные .fig».
- **Версия `@alfalab/core-components` поменялась** — `alfalab_version_wrapper.sh` hook сработает на `npm install`. По его сигналу пройтись по `figma_code_map.md` строкам со статусом ~ или ✗, проверить changelog (см. секцию ниже).
- **Granularity «новый компонент vs новый вариант существующего»:**
  - Новый размер / view существующего → дополнить раздел в существующем `.md`
  - Новая variant с заметной спецификой (например, TitleView Medium с 5 sub-вариантами) → отдельный подраздел в существующем `.md`
  - Принципиально новый компонент (другая семантика, отдельный npm-пакет) → новый `.md` + все привязки

## .fig — точка контакта

`.fig` файлы — источник истины для **дизайна** (значения, варианты, визуал).
`.md` файлы — источник истины для **правил применения в коде** (когда что использовать, gotchas, импорты).

Двусторонняя синхронизация:
- Дизайн меняется → `.fig` обновляется (юзер) → `.md` обновляется (Claude через Figma → Код workflow)
- Код меняется → `.md` обновляется (Claude/юзер) → `.fig` обновляется (юзер вручную через Код → Figma)

## figma_code_map.md

`AlfaBank/figma_code_map.md` — источник истины для двусторонней синхронизации.
Обновлять при каждой новой Figma-ссылке.

Статусы: ✓ найден · ~ частичный · ✗ отсутствует

## Уведомление об обновлении

При чтении `figma_code_map.md` — если в строке версии есть `⚠`, сообщить дизайнеру:
«@alfalab обновился до X.X.X. Нужно проверить маппинги — открываю changelog.»
Затем открыть releases, найти изменения между версиями, обновить затронутые строки в map.

## Components.md

Не дублировать пропы и примеры если у компонента есть отдельный `.md`-файл.
В `Components.md` — только ссылка на `.md` + минимальный импорт.
Полная документация (пропы, примеры, gotchas) — в файле компонента.

## Corp-тема (CSS-каскад)

Corp-тему компонента импортировать в том же файле где используется компонент, **после импорта компонента**:

```tsx
import { ButtonDesktop } from '@alfalab/core-components/button/desktop';
import '@alfalab/core-components-themes/button/corp.css';
```

**Why:** в Vite компонентный `default.desktop.css` грузится через JS позже чем `index.css` и перезаписывает `:root` (чёрный цвет вместо красного). Импорт рядом с компонентом гарантирует правильный порядок каскада.

**Перед добавлением:** проверить наличие corp.css — `ls node_modules/@alfalab/core-components-themes/<component>/`. Для некоторых компонентов (например `input`) есть только `site.css`.

### Финальный фикс через !important

Если corp-тема всё равно не применяется (Vite инжектирует ESM-путь компонентного CSS последним, после corp.css) — `!important` на переменные в `src/corp-overrides.css`:

```css
:root {
  --button-primary-base-bg-color: var(--color-light-accent-primary) !important;
  --button-primary-hover-bg-color: var(--color-light-accent-primary-hover) !important;
  --button-primary-active-bg-color: var(--color-light-accent-primary-press) !important;
  --button-primary-color: var(--color-static-text-primary-inverted) !important;
}
```

Файл импортируется последним в `main.tsx`. CSS custom properties поддерживают `!important` — декларация побеждает любой non-important override независимо от порядка загрузки.

## Changelog @alfalab/core-components

https://github.com/core-ds/core-components/releases

Открывать когда версия в figma_code_map.md изменилась — проверить deprecated и breaking changes, обновить маппинги.

### Do
- Читать перед работой с любой Figma-ссылкой
- Обновлять figma_code_map.md при каждом новом маппинге
- Искать аналог в @alfalab/core-components по семантике, а не по совпадению имён

### Don't
- Don't тащить div-вёрстку из Figma в код
- Don't игнорировать ⚠ в строке версии figma_code_map.md
- Don't маппить по имени — только по назначению и структуре
