# Buttons.md — AlfaBank
## Overview
ButtonDesktop из @alfalab/core-components. Views, sizes, IconButton, правила corp-темы и обязательного /desktop субпакета.

## ButtonDesktop

Пакет: `@alfalab/core-components/button/desktop`
Всегда использовать `/desktop` субпакет — базовый `/button` рендерит мобильный вариант (чёрный в corp-теме).

## Импорт

```tsx
import { ButtonDesktop } from '@alfalab/core-components/button/desktop';
import '@alfalab/core-components-themes/button/corp.css';
```

Corp-тему импортировать в том же файле после компонента — иначе Vite-каскад сломан.

## View

```tsx
<ButtonDesktop view="primary"   size={56}>Создать заявление</ButtonDesktop>
<ButtonDesktop view="secondary" size={56}>Сохранить черновик</ButtonDesktop>
<ButtonDesktop view="tertiary"  size={56}>Отмена</ButtonDesktop>
<ButtonDesktop view="ghost"     size={56}>Действие</ButtonDesktop>
<ButtonDesktop view="text"      size={56}>Ссылка-кнопка</ButtonDesktop>
<ButtonDesktop view="link"      size={56}>Ссылка</ButtonDesktop>
```

## Size

| Токен | Высота | Применение |
|-------|--------|------------|
| 32    | 32px   | компактные таблицы, теги |
| 40    | 40px   | фильтры, вторичные действия |
| 48    | 48px   | стандарт внутри карточек |
| 56    | 56px   | основные CTA на странице |
| 64    | 64px   | крупные акцентные блоки |
| 72    | 72px   | hero-секции |

## Основные пропы

```tsx
<ButtonDesktop
  view="primary"
  size={56}
  loading={false}       // показывает спиннер, блокирует клик
  disabled={false}
  block={false}         // 100% ширина контейнера
  leftAddons={<Icon />}
  rightAddons={<Icon />}
  onClick={() => {}}
>
  Текст
</ButtonDesktop>
```

## IconButton

Кнопка без текста — отдельный компонент:

```tsx
import { IconButtonDesktop } from '@alfalab/core-components/icon-button/desktop';
import '@alfalab/core-components-themes/icon-button/corp.css';

<IconButtonDesktop view="primary" size={48} icon={<DotsHorizontalMIcon />} />
```

## Corp-тема: известная проблема

Vite инжектирует ESM-путь button CSS последним (после corp.css) → кнопка становится чёрной.

Фикс в `src/corp-overrides.css` — добавлены `!important` на все `--button-primary-*` переменные. Этот файл импортируется последним в `main.tsx`.

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| view | Вид | cycle | primary → secondary → tertiary → ghost → text → link |
| size | Размер | cycle | 32 → 40 → 48 → 56 → 64 → 72 |
| loading | Загрузка | toggle | — |
| disabled | Отключён | toggle | — |
| block | На всю ширину | toggle | — |

### Do
- Использовать ButtonDesktop из /button/desktop субпакета
- Импортировать corp.css после импорта компонента в том же файле

### Don't
- Don't использовать /button без /desktop — рендерит мобильный вариант (чёрный в corp-теме)
- Don't ставить импорт corp.css до импорта компонента — Vite-каскад сломается
- Don't добавлять IconButton через ButtonDesktop — для иконки есть отдельный IconButtonDesktop
