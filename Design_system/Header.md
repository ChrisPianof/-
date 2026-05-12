# Header.md — AlfaBank
## Overview
Верхняя навигационная панель. Фиксирована при скролле, начинается правее Sidebar. Два варианта: только Right-зона или с кнопкой «Назад».

## Header

Высота: 8px паддинг + 40px контент. Фон: `#f2f3f5`. Начинается правее Sidebar.

## Варианты

  | Вариант | Описание |
  |---|---|
  | Default | Только правая зона (Right) |
  | С кнопкой «Назад» | Левая зона + правая зона |

## Зона Left (только вариант «С кнопкой Назад»)

  Кнопка «Назад»: иконка chevron_left 24×24px + текст SF Pro Text Medium 14px/20px `rgba(4,4,19,0.55)`
  Gap: 2px, паддинг `pl:16px pr:20px py:4px`, border-radius 10px

## Зона Right (всегда, justify-end)

  Состав слева направо с gap 16px:
  1. IconButton Search
  2. DividerVertical
  3. IconButton Mail + IconButton Notifications (gap 8px)
  4. DividerVertical
  5. SingleAccount
  6. DividerVertical
  7. IconButton Exit

  IconButton: контейнер 40×40px, иконка 24×24px, без фона и обводки
  DividerVertical: 1px × 32px, `rgba(15,25,55,0.1)`, паддинг 4px вертикальный

## SingleAccount

  Аватар: 40×40px, суперэллипс, фон `rgba(30,43,68,0.08)`
  Название компании: SF Pro Text Medium 14px/20px `rgba(3,3,6,0.88)`, nowrap
  Имя пользователя: SF Pro Text Regular 12px/16px `rgba(4,4,19,0.55)`, nowrap

## Адаптивность

  Right-зона не сжимается, фиксирована по правому краю.
  При уменьшении ширины сокращается только свободное пространство слева.
  min-width: ширина Right-зоны.

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| showBackButton | Кнопка «Назад» | toggle | — |

### Do
- Всегда отображать Right-зону
- Фиксировать при скролле

### Don't
- Don't сжимать Right-зону — она фиксирована по правому краю
- Don't перекрывать Header поверх Sidebar — он начинается правее Sidebar
