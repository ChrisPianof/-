# _index.md — AlfaBank
## Overview
Индекс дизайн-системы AlfaBank: файлы, правила, компоненты, структура src/, маршруты. Читать при любой задаче.

**Формат записей:** plain text без markdown-ссылок — индекс читает Claude, ссылки избыточны.

## Файлы дизайн-системы

Components.md — готовые компоненты с кодом для переиспользования. Как только компонент начинает использоваться в BasePage — сразу добавлять секцию в Components.md. При любых сомнениях — сначала читать BasePage.tsx, потом делать вывод.
  **Правило:** при создании любого нового файла [ComponentName].md в Design_system/ — сразу добавить секцию в Components.md (импорт + минимальный пример). Файл без записи в Components.md считается незавершённым.
Buttons.md — документация ButtonDesktop: views, sizes, IconButton, corp-тема gotcha
BackgroundPlate.md — документация компонента BackgroundPlate (5 вьюх, скелетон, hover)
TitleView.md — документация компонента TitleView: пропы, зоны, DotsButton
TabsView.md — документация компонента Tabs: пропы, Tab, gotcha с dedupe
TabsSecondary.md — Secondary-вариант Tabs (теги): size, tagView, tagShape, corp-тема, паттерн обёртки
Input.md — документация компонента Input: пропы, onChange-сигнатура, corp-тема
PageStructure.md — иерархия зон страницы, отступы, порядок зон
DevPanel — **глобальная папка**, лежит в `/Desktop/Claude/Tools/DevPanel/`. Читать `_index.md` — операционные правила: типы контролов, принцип работы, формат секции в файлах компонентов.
  Читать ОБЯЗАТЕЛЬНО когда: добавляется/правится секция «Пропсы в DevPanel» в любом [Component].md, реализуется или меняется DevPanel в коде, обсуждаются типы контролов (input/toggle/cycle/number/node)
Tokens.md — токены и стили: цвета, отступы, скругления, тени, типографика.
  Читать ТОЛЬКО при сборке экрана на базе BasePage или нового компонента.
  При обсуждении, анализе или других задачах — не читать, токены не тратить.

## Утилиты

src/utils/useBreakpoint.ts — хук на основе `useMatchMedia` из `@alfalab/core-components/mq`. Определяет текущее устройство (mobile/tablet/desktop) по токенам из `mq.json` пакета. Использовать для адаптации сетки.

## Структура src/

src/components/ — реализованные компоненты (Sidebar, Header, TitleView)
src/screens/ — экраны (один файл = один экран):
  BasePage.tsx — шаблон страницы: TitleView + Body (8+4 сетка). Брать за основу для новых экранов.
src/utils/useBreakpoint.ts — хук определения устройства (mobile/tablet/desktop)

## Маршруты

| Маршрут | Файл | Роль |
|---------|------|------|
| `/` | App.tsx → Index | список экранов |
| `/base` | BasePage.tsx | шаблон страницы |

При добавлении нового экрана — добавить строку в эту таблицу и маршрут в `src/App.tsx`.

## Сборка страницы

При команде «Собери страницу»:
1. Читать `PageStructure.md` и `Components.md`
2. Взять `src/screens/BasePage.tsx` как основу — не пересоздавать структуру заново
3. Заменить плейсхолдеры на нужный контент
4. Добавить маршрут в `src/App.tsx` и в таблицу выше

Новый файл с нуля — только если экран принципиально не вписывается в шаблон (например, fullscreen без Sidebar).

## Правило

Все компоненты берутся ТОЛЬКО из @alfalab/core-components.
Модифицировать исходный код компонентов ЗАПРЕЩЕНО.
Кастомизация — только через официальные props и CSS-переменные пакета.

При получении ссылки на Figma — только определить, какой компонент имеется в виду, найти его в этом индексе и использовать компонент из @alfalab/core-components.
Тащить div-вёрстку из Figma ЗАПРЕЩЕНО.

Это десктопный прототип — всегда использовать /desktop субпакет:
- ButtonDesktop из @alfalab/core-components/button/desktop
- По аналогии для всех компонентов у которых есть /desktop субпакет
Использовать базовый /button (без /desktop) НЕЛЬЗЯ — он рендерит мобильный вариант, который в corp теме чёрный.

Corp тема — два обязательных импорта:
- main.tsx: import '@alfalab/core-components/themes/corp.css'
- index.css: @import '@alfalab/core-components-themes/button/corp.css'
Одного импорта corp.css в main.tsx недостаточно — компонент перезаписывает CSS-переменные своим vars.css.

Corp тема компонента — импортировать в том же файле где используется компонент, ПОСЛЕ импорта компонента:
```tsx
import { ButtonDesktop } from '@alfalab/core-components/button/desktop';
import '@alfalab/core-components-themes/button/corp.css';
```
Причина: в Vite компонентный default.desktop.css грузится через JS позже чем index.css и перезаписывает :root переменные. Импорт corp.css рядом с компонентом гарантирует правильный порядок каскада.

Deprecated (не использовать):
- confirmation-v1 → использовать confirmation
- file-upload-item-v1 → использовать file-upload-item
- pass-code-v1 → использовать pass-code
- pattern-lock-v1 → использовать pattern-lock

Источник: https://github.com/core-ds/core-components

## Импорт

```tsx
import { Button } from '@alfalab/core-components/button';
import { Input } from '@alfalab/core-components/input';
// каждый компонент — отдельный subpackage
```

### Do
- Читать перед началом любой задачи в AlfaBank
- Использовать только компоненты из @alfalab/core-components
- Добавлять новый экран в таблицу маршрутов и в src/App.tsx
- Всегда использовать /desktop субпакет для компонентов с десктопным вариантом

### Don't
- Don't создавать UI-компоненты с нуля — только через пакет
- Don't модифицировать исходный код компонентов @alfalab
- Don't использовать /button, /input, /select без /desktop суффикса

## Компоненты (UI)

accordion — аккордеон
action-button — кнопка действия
alert — уведомление-баннер
amount — отображение суммы
amount-input — поле ввода суммы
attach — прикрепление файлов
backdrop — подложка/затемнение
badge — бейдж
bank-card — банковская карта
bottom-sheet — боттом-шит
button — кнопка
calendar — календарь
calendar-input — поле с календарём
calendar-range — диапазон дат
calendar-with-skeleton — календарь со скелетоном
card-image — обложка карточки
cdn-icon — иконки CDN
chart — графики
checkbox — чекбокс
checkbox-group — группа чекбоксов
circular-progress-bar — круговой прогресс
code-input — ввод кода (SMS)
collapse — коллапс
comment — комментарий
confirmation — подтверждение (OTP)
custom-button — кастомная кнопка
custom-picker-button — пикер-кнопка
date-input — ввод даты
date-range-input — диапазон дат
date-time-input — дата и время
divider — разделитель
drawer — выдвижная панель
dropzone — зона перетаскивания
file-upload-item — элемент загрузки файла
filter-tag — тег-фильтр
form-control — обёртка поля формы
gallery — галерея
gap — отступ
grid — сетка
icon-button — иконка-кнопка
icon-view — отображение иконки
indicator — индикатор
input — текстовое поле
input-autocomplete — поле с автодополнением
international-phone-input — международный телефон
intl-phone-input — телефон (альт.)
link — ссылка
list — список
list-header — заголовок списка
loader — лоадер
markdown — рендер markdown
masked-input — поле с маской
modal — модальное окно
navigation-bar — навигационная панель
notification — уведомление
number-input — числовое поле
page-indicator — индикатор страницы
pagination — пагинация
pass-code — ввод пин-кода
password-input — поле пароля
pattern-lock — паттерн-лок
phone-input — ввод телефона
picker-button — кнопка-пикер
plate — плашка
popover — поповер
popup-sheet — попап-шит
portal — портал
product-cover — обложка продукта
progress-bar — прогресс-бар
pure-cell — ячейка
radio — радио-кнопка
radio-group — группа радио
scrollbar — скроллбар
segmented-control — сегментированный контрол
select — селект
select-with-tags — селект с тегами
side-panel — боковая панель
skeleton — скелетон
slider — слайдер
slider-input — слайдер с полем
sortable-list — сортируемый список
space — пространство
spinner — спиннер
status — статус
status-badge — статусный бейдж
stepped-progress-bar — пошаговый прогресс
steps — шаги
switch — переключатель
system-message — системное сообщение
tab-bar — таббар
table — таблица
tabs — табы
tag — тег
text — текст
textarea — текстовая область
time-input — ввод времени
toast — тост-уведомление
toast-plate — плашка тоста
tooltip — тултип
typography — типографика
underlay — подложка
universal-date-input — универсальный ввод даты
universal-modal — универсальная модалка
with-suffix — суффикс

## Утилиты и инфраструктура

config — конфигурация
data — данные
global-store — глобальный стор
hooks — хуки
keyboard-focusable — фокус клавиатуры
mq — media queries
notification-manager — менеджер уведомлений
portal — портал
shared — общие утилиты
stack — стек
stack-context — контекст стека
themes — темы
types — типы
utils — утилиты
vars — CSS-переменные
