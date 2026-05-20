import React, { useState } from 'react';
import { Steps } from '@alfalab/core-components/steps';
import { InputDesktop } from '@alfalab/core-components/input/desktop';
import { SelectDesktop } from '@alfalab/core-components/select/desktop';
import '@alfalab/core-components-themes/select/corp.css';
import { UniversalDateInputDesktop } from '@alfalab/core-components/universal-date-input/desktop';
import { Calendar } from '@alfalab/core-components/calendar';
import '@alfalab/core-components-themes/universal-date-input/corp.css';
import '@alfalab/core-components-themes/calendar/corp.css';
import { TitleView, type TitleViewProps, STATUS_COLOR_LABELS, STATUS_LABEL_TO_COLOR, type StatusColorLabel } from '../components/TitleView';
import { useBreakpoint } from '../utils/useBreakpoint';
import { BackgroundPlate, BackgroundPlateView } from '../components/BackgroundPlate';
import { Sortable, SortableItem } from '../components/Sortable';
import { BgPlateRowsDnd, type MoveAction, type DnDRow } from '../components/BgPlateRowsDnd';
import { Tabs as TabsBase, Tab } from '@alfalab/core-components/tabs';
const Tabs = TabsBase as React.ComponentType<React.ComponentProps<typeof TabsBase> & { TabList?: unknown }>;
import { SecondaryTabListDesktop } from '@alfalab/core-components/tabs/desktop';
import type { SecondaryTabListDesktopProps as SecondaryTabListProps } from '@alfalab/core-components/tabs/desktop';
import { ButtonDesktop as Button } from '@alfalab/core-components/button/desktop';
import '@alfalab/core-components-themes/button/corp.css';
import { Popover } from '@alfalab/core-components/popover';
import { StatusBadge } from '@alfalab/core-components/status-badge';
import { Link } from '@alfalab/core-components/link';
import { DiamondsSIcon } from '@alfalab/icons-glyph/DiamondsSIcon';
import { DotsHorizontalMIcon } from '@alfalab/icons-glyph/DotsHorizontalMIcon';
import { PlusMIcon } from '@alfalab/icons-glyph/PlusMIcon';
import { DevPanelWrapper, EditableText, type PropSpec, type AddOption } from '@local/devpanel';

type ChildKind = 'title' | 'tabs' | 'input' | 'select' | 'date';
type BgChild = { id: number; kind: ChildKind };
type BgRow = DnDRow<BgChild>;
type BgPlateItem = { id: number; children: BgRow[] };
type IdItem = { id: number };

function usePersisted<T>(key: string, initial: T, validate: (v: unknown) => v is T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (validate(parsed)) return parsed;
      }
    } catch { /* ignore corrupted entry */ }
    return initial;
  });
  React.useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota / privacy mode */ }
  }, [key, value]);
  return [value, setValue];
}

const isIdItemArray = (v: unknown): v is IdItem[] =>
  Array.isArray(v) && v.every(it => it && typeof (it as IdItem).id === 'number');

const CHILD_KINDS: ChildKind[] = ['title', 'tabs', 'input', 'select', 'date'];
const GROUPABLE_KINDS: ChildKind[] = ['input', 'select', 'date'];
const isGroupable = (k: ChildKind) => GROUPABLE_KINDS.includes(k);

const findChild = (rows: BgRow[], childId: number): BgChild | null => {
  for (const r of rows) {
    const c = r.items.find(it => it.id === childId);
    if (c) return c;
  }
  return null;
};
const findRow = (rows: BgRow[], rowId: number) => rows.find(r => r.id === rowId);

const isBgChild = (c: unknown): c is BgChild =>
  Boolean(c) && typeof (c as BgChild).id === 'number' &&
  CHILD_KINDS.includes((c as BgChild).kind as ChildKind);
const isBgRow = (r: unknown): r is BgRow =>
  Boolean(r) && typeof (r as BgRow).id === 'number' &&
  Array.isArray((r as BgRow).items) && (r as BgRow).items.every(isBgChild);
const isBgPlatesArray = (v: unknown): v is BgPlateItem[] =>
  Array.isArray(v) && v.every(it =>
    Boolean(it) && typeof (it as BgPlateItem).id === 'number' &&
    Array.isArray((it as BgPlateItem).children) &&
    (it as BgPlateItem).children.every(isBgRow),
  );

const nextId = (used: number[]) => (used.length > 0 ? Math.max(...used) + 1 : 0);

const allChildIds = (rows: BgRow[]): number[] =>
  rows.flatMap(r => r.items.map(it => it.id));
const allRowIds = (rows: BgRow[]): number[] => rows.map(r => r.id);

function removeItemFromRows(rows: BgRow[], itemId: number): { rows: BgRow[]; removed: BgChild | null } {
  let removed: BgChild | null = null;
  const nextRows: BgRow[] = [];
  for (const row of rows) {
    const idx = row.items.findIndex(it => it.id === itemId);
    if (idx < 0) { nextRows.push(row); continue; }
    removed = row.items[idx];
    const nextItems = row.items.filter(it => it.id !== itemId);
    if (nextItems.length > 0) nextRows.push({ ...row, items: nextItems });
  }
  return { rows: nextRows, removed };
}

function applyMove(rows: BgRow[], action: MoveAction): BgRow[] {
  if (action.srcItemId === action.destItemId) return rows;
  const { rows: withoutSrc, removed } = removeItemFromRows(rows, action.srcItemId);
  if (!removed) return rows;

  const destRowIdx = withoutSrc.findIndex(r => r.id === action.destRowId);
  if (destRowIdx < 0) return rows;
  const destRow = withoutSrc[destRowIdx];
  const destItemIdx = destRow.items.findIndex(it => it.id === action.destItemId);

  if (action.side === 'left' || action.side === 'right') {
    if (destItemIdx < 0) return rows;
    const groupable = isGroupable(removed.kind) && destRow.items.every(it => isGroupable(it.kind));
    if (!groupable) return rows;
    const insertAt = action.side === 'left' ? destItemIdx : destItemIdx + 1;
    const nextItems = [...destRow.items.slice(0, insertAt), removed, ...destRow.items.slice(insertAt)];
    const nextRows = [...withoutSrc];
    nextRows[destRowIdx] = { ...destRow, items: nextItems };
    return nextRows;
  }
  const newRow: BgRow = { id: nextId(allRowIds(withoutSrc)), items: [removed] };
  const insertRowAt = action.side === 'top' ? destRowIdx : destRowIdx + 1;
  return [...withoutSrc.slice(0, insertRowAt), newRow, ...withoutSrc.slice(insertRowAt)];
}

type TabsProps = { size: string; tagView: string; tab1: string; tab2: string; tab3: string };
type TabsViewProps = { view: string; size: string; tab1: string; tab2: string; tab3: string };
const PX_TO_TAB_SIZE: Record<string, 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl'> = {
  '32': 'xxs', '40': 'xs', '48': 's', '56': 'm', '64': 'l', '72': 'xl',
};
type InputProps = { label: string; labelView: string; size: string; block: boolean; disabled?: boolean; error?: string | boolean; success?: boolean; hint?: string; clear?: boolean };
type SelectProps = { label: string; labelView: string; size: string; block: boolean; multiple?: boolean; disabled?: boolean; showSearch?: boolean; error?: string | boolean; hint?: string; clear?: boolean };
type DateProps = { label: string; labelView: string; size: string; view: string; picker: boolean; block: boolean; disabled?: boolean; error?: string | boolean; hint?: string; autoCorrection?: boolean };

const titleAddon = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-8)' }}>
    <StatusBadge view="positive-checkmark" size={16} />
    <Link view="default" underline>Изменить</Link>
  </div>
);

type TitleViewDevProps = Omit<TitleViewProps, 'statusColor'> & {
  statusColorLabel?: StatusColorLabel;
  button1?: string;
  button2?: string;
  button3?: string;
  button4?: boolean;
  menuItem1?: string;
  menuItem2?: string;
  menuItem3?: string;
};

const filterCompanySelectProps = {
  options: [{ key: 'c1', content: 'ООО Ромашка' }, { key: 'c2', content: 'ИП Иванов' }],
  selected: [],
  placeholder: 'Компания',
};

const titleStatusProps = {
  type: 'positive' as const,
  title: 'Заявление одобрено банком',
  text: 'Средства будут переведены в течение 3 рабочих дней',
};

const rightAddonNode = <DiamondsSIcon width={24} height={24} />;

const TITLEVIEW_SPEC: PropSpec[] = [
  { name: 'statusLabel', label: 'Статус-бейдж', control: 'toggle+input', default: 'Одобрено' },
  { name: 'statusColorLabel', label: 'Цвет статуса', control: 'cycle', values: [...STATUS_COLOR_LABELS] },
  { name: 'heading', label: 'Заголовок', control: 'input' },
  { name: 'view', label: 'Размер', control: 'cycle', values: ['medium', 'large', 'xLarge'] },
  { name: 'titleAddon', label: 'Доп. элемент', control: 'node', default: titleAddon },
  { name: 'rightAddon', label: 'Правый аддон', control: 'node', default: rightAddonNode },
  { name: 'filterCompanySelectProps', label: 'Выбор компании', control: 'node', default: filterCompanySelectProps },
  { name: 'subtitle', label: 'Подзаголовок', control: 'toggle+input', default: 'Подзаголовок' },
  { name: 'titleStatusProps', label: 'Статусный блок', control: 'node', default: titleStatusProps },
  { name: 'button1', label: 'Кнопка 1', control: 'toggle+input', default: 'Создать заявление' },
  { name: 'button2', label: 'Кнопка 2', control: 'toggle+input', default: 'Сохранить черновик' },
  { name: 'button3', label: 'Кнопка 3', control: 'toggle+input', default: 'Отмена' },
  { name: 'button4', label: 'Кнопка ⋯ (меню)', control: 'toggle', default: true },
  { name: 'menuItem1', label: '⋯ Пункт 1', control: 'toggle+input', default: 'Дублировать' },
  { name: 'menuItem2', label: '⋯ Пункт 2', control: 'toggle+input', default: 'Отменить' },
  { name: 'menuItem3', label: '⋯ Пункт 3', control: 'toggle+input', default: 'Скачать PDF' },
  { name: 'showSkeleton', label: 'Скелетон', control: 'toggle', default: true },
];

const TABS_SPEC: PropSpec[] = [
  { name: 'size', label: 'Размер', control: 'cycle', values: ['32', '40', '48', '56', '64', '72'] },
  { name: 'tagView', label: 'Вид тега', control: 'cycle', values: ['outlined', 'filled', 'transparent'] },
  { name: 'tab1', label: 'Таб 1', control: 'input' },
  { name: 'tab2', label: 'Таб 2', control: 'input' },
  { name: 'tab3', label: 'Таб 3', control: 'input' },
];

const TABSVIEW_SPEC: PropSpec[] = [
  { name: 'view', label: 'Вид', control: 'cycle', values: ['primary', 'secondary'] },
  { name: 'size', label: 'Размер', control: 'cycle', values: ['xxs', 'xs', 's', 'm', 'l', 'xl'] },
  { name: 'tab1', label: 'Таб 1', control: 'input' },
  { name: 'tab2', label: 'Таб 2', control: 'input' },
  { name: 'tab3', label: 'Таб 3', control: 'input' },
];

const INPUT_SPEC: PropSpec[] = [
  { name: 'label', label: 'Лейбл', control: 'input' },
  { name: 'labelView', label: 'Вид лейбла', control: 'cycle', values: ['inner', 'outer'] },
  { name: 'size', label: 'Размер', control: 'cycle', values: ['40', '48', '56', '64'] },
  { name: 'block', label: 'На всю ширину', control: 'toggle', default: true },
  { name: 'disabled', label: 'Отключён', control: 'toggle', default: true },
  { name: 'error', label: 'Ошибка', control: 'toggle+input', default: 'Ошибка заполнения' },
  { name: 'success', label: 'Успех', control: 'toggle', default: true },
  { name: 'hint', label: 'Подсказка', control: 'toggle+input', default: 'Подсказка' },
  { name: 'clear', label: 'Кнопка очистки', control: 'toggle', default: true },
];

const SELECT_SPEC: PropSpec[] = [
  { name: 'label', label: 'Лейбл', control: 'input' },
  { name: 'labelView', label: 'Вид лейбла', control: 'cycle', values: ['inner', 'outer'] },
  { name: 'size', label: 'Размер', control: 'cycle', values: ['40', '48', '56', '64', '72'] },
  { name: 'block', label: 'На всю ширину', control: 'toggle', default: true },
  { name: 'multiple', label: 'Мультивыбор', control: 'toggle', default: true },
  { name: 'disabled', label: 'Отключён', control: 'toggle', default: true },
  { name: 'showSearch', label: 'Поиск', control: 'toggle', default: true },
  { name: 'error', label: 'Ошибка', control: 'toggle+input', default: 'Ошибка' },
  { name: 'hint', label: 'Подсказка', control: 'toggle+input', default: 'Подсказка' },
  { name: 'clear', label: 'Кнопка сброса', control: 'toggle', default: true },
];

// Date picker всегда занимает половину ширины (block-toggle убран — фикс ширины 50%).
const DATE_SPEC: PropSpec[] = [
  { name: 'label', label: 'Лейбл', control: 'input' },
  { name: 'view', label: 'Вид', control: 'cycle', values: ['date', 'date-time', 'date-range', 'time'] },
  { name: 'size', label: 'Размер', control: 'cycle', values: ['48', '56', '64', '72'] },
  { name: 'picker', label: 'Календарь-пикер', control: 'toggle', default: true },
  { name: 'disabled', label: 'Отключён', control: 'toggle', default: true },
  { name: 'error', label: 'Ошибка', control: 'toggle+input', default: 'Неверный формат' },
  { name: 'hint', label: 'Подсказка', control: 'toggle+input', default: 'ДД.ММ.ГГГГ' },
  { name: 'autoCorrection', label: 'Автокоррекция', control: 'toggle', default: true },
];

const TYPE_LABELS: Record<string, ChildKind> = { Select: 'select', Input: 'input', 'Date Picker': 'date' };
const KIND_TO_TYPE_LABEL: Partial<Record<ChildKind, string>> = { select: 'Select', input: 'Input', date: 'Date Picker' };
const TYPE_SWAP_OPTIONS = ['Select', 'Input', 'Date Picker'];

const STEPS_SPEC: PropSpec[] = [
  { name: 'activeStep', label: 'Активный шаг', control: 'number' },
  { name: 'ordered', label: 'Нумерация', control: 'toggle', default: true },
  { name: 'isMarkCompletedSteps', label: 'Отмечать пройденные', control: 'toggle', default: true },
  { name: 'interactive', label: 'Кликабельность', control: 'toggle', default: true },
];

const BLOCK_TITLE_LEFT_ICON = <DiamondsSIcon width={20} height={20} />;
const BLOCK_TITLE_RIGHT_ICON = <DotsHorizontalMIcon width={20} height={20} />;
const BLOCK_TITLE_SPEC: PropSpec[] = [
  { name: 'heading', label: 'Заголовок', control: 'input' },
  { name: 'view', label: 'Размер', control: 'cycle', values: ['small', 'xsmall'] },
  { name: 'leftAddon', label: 'Иконка слева', control: 'node', default: BLOCK_TITLE_LEFT_ICON },
  { name: 'rightAddon', label: 'Иконка справа', control: 'node', default: BLOCK_TITLE_RIGHT_ICON },
  { name: 'subtitle', label: 'Подпись', control: 'toggle+input', default: 'Подпись' },
  { name: 'showSkeleton', label: 'Скелетон', control: 'toggle', default: true },
];

export default function BasePage() {
  const { device } = useBreakpoint();
  const [activeStep, setActiveStep] = useState(2);
  type SelectValue = { key: string; content?: string }[];
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [selectValues, setSelectValues] = useState<Record<string, SelectValue>>({});
  const [dateValues, setDateValues] = useState<Record<string, string>>({});
  const getActiveTab = (key: string) => activeTabs[key] ?? 'description';
  const setActiveTabFor = (key: string) => (id: string) =>
    setActiveTabs(prev => ({ ...prev, [key]: id }));
  const setInputValueFor = (key: string) => (value: string) =>
    setInputValues(prev => ({ ...prev, [key]: value }));
  const setSelectValueFor = (key: string) => (value: SelectValue) =>
    setSelectValues(prev => ({ ...prev, [key]: value }));
  const setDateValueFor = (key: string) => (value: string) =>
    setDateValues(prev => ({ ...prev, [key]: value }));
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [titleViews, setTitleViews] = usePersisted<IdItem[]>(
    'alfabank.base.v2.titleViews', [{ id: 0 }], isIdItemArray,
  );
  const [tabsViews, setTabsViews] = usePersisted<IdItem[]>(
    'alfabank.base.v4.tabsViews', [{ id: 0 }],
    (v): v is IdItem[] => isIdItemArray(v) && v.length > 0,
  );
  const [bgPlates, setBgPlates] = usePersisted<BgPlateItem[]>(
    'alfabank.base.v3.bgPlates',
    [{ id: 0, children: [
      { id: 0, items: [{ id: 0, kind: 'tabs' }] },
      { id: 1, items: [{ id: 1, kind: 'input' }] },
      { id: 2, items: [{ id: 2, kind: 'select' }] },
    ] }],
    isBgPlatesArray,
  );
  const [isleBlocks, setIsleBlocks] = usePersisted<IdItem[]>(
    'alfabank.base.v2.isleBlocks', [{ id: 0 }], isIdItemArray,
  );

  const addTitleView = () =>
    setTitleViews(prev => [...prev, { id: nextId(prev.map(i => i.id)) }]);
  const removeTitleView = (id: number) => () =>
    setTitleViews(prev => prev.filter(i => i.id !== id));

  const addTabsView = () =>
    setTabsViews(prev => [...prev, { id: nextId(prev.map(i => i.id)) }]);
  const removeTabsView = (id: number) => () =>
    setTabsViews(prev => prev.filter(i => i.id !== id));

  const addBgPlate = () =>
    setBgPlates(prev => [...prev, { id: nextId(prev.map(i => i.id)), children: [] }]);
  const duplicateBgPlate = (id: number) => () =>
    setBgPlates(prev => {
      const idx = prev.findIndex(bp => bp.id === id);
      if (idx === -1) return prev;
      const source = prev[idx];
      const newId = nextId(prev.map(i => i.id));
      const usedRowIds = prev.flatMap(bp => allRowIds(bp.children));
      const usedItemIds = prev.flatMap(bp => allChildIds(bp.children));
      const clone: BgPlateItem = {
        id: newId,
        children: source.children.map(row => {
          const newRowId = nextId(usedRowIds);
          usedRowIds.push(newRowId);
          return {
            id: newRowId,
            items: row.items.map(item => {
              const newItemId = nextId(usedItemIds);
              usedItemIds.push(newItemId);
              return { ...item, id: newItemId };
            }),
          };
        }),
      };
      return [...prev.slice(0, idx + 1), clone, ...prev.slice(idx + 1)];
    });
  const removeBgPlate = (id: number) => () =>
    setBgPlates(prev => prev.filter(i => i.id !== id));

  const addIsleBlock = () =>
    setIsleBlocks(prev => [...prev, { id: nextId(prev.map(i => i.id)) }]);
  const removeIsleBlock = (id: number) => () =>
    setIsleBlocks(prev => prev.filter(i => i.id !== id));

  const addChildTo = (bgId: number, kind: ChildKind) => () =>
    setBgPlates(prev => prev.map(bp => {
      if (bp.id !== bgId) return bp;
      const newItemId = nextId(allChildIds(bp.children));
      const newRowId = nextId(allRowIds(bp.children));
      const newRow: BgRow = { id: newRowId, items: [{ id: newItemId, kind }] };
      return { ...bp, children: [...bp.children, newRow] };
    }));
  const removeChild = (bgId: number, childId: number) => () =>
    setBgPlates(prev => prev.map(bp =>
      bp.id !== bgId ? bp : { ...bp, children: removeItemFromRows(bp.children, childId).rows },
    ));
  const moveChild = (bgId: number) => (action: MoveAction) =>
    setBgPlates(prev => prev.map(bp =>
      bp.id !== bgId ? bp : { ...bp, children: applyMove(bp.children, action) },
    ));
  const swapChildKind = (bgId: number, childId: number) => (nextLabel: string) => {
    const nextKind = TYPE_LABELS[nextLabel];
    if (!nextKind) return;
    setBgPlates(prev => prev.map(bp =>
      bp.id !== bgId ? bp : { ...bp, children: bp.children.map(row => ({
        ...row,
        items: row.items.map(c => c.id !== childId ? c : { ...c, kind: nextKind }),
      })) },
    ));
  };

  const titleViewAddOptions: AddOption[] = [
    { label: 'TitleView', onSelect: addTitleView },
    { label: 'TabsView', onSelect: addTabsView },
  ];
  const tabsViewAddOptions: AddOption[] = [
    { label: 'TabsView', onSelect: addTabsView },
    { label: 'TitleView', onSelect: addTitleView },
  ];
  const bgPlateChildrenAddOptions = (bgId: number): AddOption[] => [
    { label: 'TitleView', onSelect: addChildTo(bgId, 'title') },
    { label: 'TagGroup', onSelect: addChildTo(bgId, 'tabs') },
    { label: 'Input', onSelect: addChildTo(bgId, 'input') },
    { label: 'Select', onSelect: addChildTo(bgId, 'select') },
    { label: 'Date Picker', onSelect: addChildTo(bgId, 'date') },
  ];
  const isleBlockAddOptions: AddOption[] = [
    { label: 'IsleBlock', onSelect: addIsleBlock },
  ];

  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menuAnchor?.contains(target)) return;
      if (target.closest('[data-overflow-menu]')) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen, menuAnchor]);

  const selectOptions = [
    { key: 'opt1', content: 'Вариант 1', value: 'opt1' },
    { key: 'opt2', content: 'Вариант 2', value: 'opt2' },
    { key: 'opt3', content: 'Вариант 3', value: 'opt3' },
  ];

  const gridColumns =
    device === 'desktop' ? '1fr 400px' :
    device === 'tablet'  ? '1fr 400px' :
    '1fr';

  const renderTitleView = (tvId: number) => (
    <DevPanelWrapper<TitleViewDevProps>
      title="TitleView"
      onDuplicate={addTitleView}
      onDelete={titleViews.length > 1 ? removeTitleView(tvId) : undefined}
      addOptions={titleViewAddOptions}
      spec={TITLEVIEW_SPEC}
      baseProps={{
        heading: 'Заголовок страницы',
        view: 'large',
        subtitle: 'Подзаголовок',
        statusLabel: 'Одобрено',
        statusColorLabel: 'Approve' as StatusColorLabel,
        titleAddon,
        rightAddon: rightAddonNode,
        filterCompanySelectProps,
        titleStatusProps,
        button1: 'Создать заявление',
        button2: 'Сохранить черновик',
        button3: 'Отмена',
        button4: true,
        menuItem1: 'Дублировать',
        menuItem2: 'Отменить',
      }}
      render={({ button1, button2, button3, button4, menuItem1, menuItem2, menuItem3, statusColorLabel, ...rest }, ctx) => {
        const statusColor = statusColorLabel ? STATUS_LABEL_TO_COLOR[statusColorLabel] : undefined;
        const menuItems: { key: string; label: string }[] = [
          { key: 'menuItem1', label: menuItem1 ?? '' },
          { key: 'menuItem2', label: menuItem2 ?? '' },
          { key: 'menuItem3', label: menuItem3 ?? '' },
        ].filter(m => Boolean(m.label));
        const buttons = [
          button1 && <Button key="1" view="primary" size={56}><EditableText value={button1} onChange={v => ctx.setProp('button1', v)} /></Button>,
          button2 && <Button key="2" view="secondary" size={56}><EditableText value={button2} onChange={v => ctx.setProp('button2', v)} /></Button>,
          button3 && <Button key="3" view="secondary" size={56}><EditableText value={button3} onChange={v => ctx.setProp('button3', v)} /></Button>,
          button4 && (
            <Button
              key="4"
              ref={setMenuAnchor}
              view="secondary"
              size={56}
              style={{ width: 56, minWidth: 56, paddingLeft: 0, paddingRight: 0 }}
              onClick={() => setMenuOpen(v => !v)}
            >
              <DotsHorizontalMIcon width={20} height={20} />
            </Button>
          ),
        ].filter(Boolean);
        const buttonsGroup = buttons.length > 0 ? (
          <>
            <div style={{ display: 'flex', gap: 'var(--gap-16)' }}>{buttons}</div>
            <Popover
              open={button4 && menuItems.length > 0 ? menuOpen : false}
              anchorElement={menuAnchor}
              position="bottom-start"
              offset={[0, 8]}
              zIndex={10001}
            >
              <div
                data-overflow-menu
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 'var(--gap-8) 0',
                  minWidth: 220,
                }}
              >
                {menuItems.map(({ label, key }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      appearance: 'none',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      padding: 'var(--gap-12) var(--gap-16)',
                      fontFamily: 'var(--font-family-system)',
                      fontSize: 16,
                      color: 'var(--color-light-text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <EditableText value={label} onChange={v => ctx.setProp(key, v)} />
                  </button>
                ))}
              </div>
            </Popover>
          </>
        ) : undefined;
        return <TitleView
          {...rest}
          statusColor={statusColor}
          buttonsGroup={buttonsGroup}
          onHeadingChange={v => ctx.setProp('heading', v)}
          onSubtitleChange={v => ctx.setProp('subtitle', v)}
          onStatusLabelChange={v => ctx.setProp('statusLabel', v)}
        />;
      }}
    />
  );

  // TabsView — опциональная зона между TitleView и Body. Primary/secondary вид.
  // Не путать с TagGroup внутри BgPlate (фильтрация).
  const renderTabsView = (tvId: number) => {
    const tabKey = `tv:${tvId}`;
    return (
    <DevPanelWrapper<TabsViewProps>
      title="TabsView"
      onDuplicate={addTabsView}
      onDelete={removeTabsView(tvId)}
      addOptions={tabsViewAddOptions}
      spec={TABSVIEW_SPEC}
      baseProps={{ view: 'primary', size: 'm', tab1: 'Раздел 1', tab2: 'Раздел 2', tab3: 'Раздел 3' }}
      render={(p, ctx) => (
        // width:100% — чтобы primary TabList'а полоска снизу растянулась на всю ширину
        // (`.tabs__component::before { width: 100% }` берёт ширину родителя).
        <div style={{ width: '100%' }}>
          <Tabs
            view={p.view as 'primary' | 'secondary'}
            size={p.size as 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl'}
            selectedId={getActiveTab(tabKey)}
            onChange={(_, { selectedId }) => setActiveTabFor(tabKey)(selectedId as string)}
          >
            <Tab title={<EditableText value={p.tab1} onChange={v => ctx.setProp('tab1', v)} />} id='description' />
            <Tab title={<EditableText value={p.tab2} onChange={v => ctx.setProp('tab2', v)} />} id='dev' />
            <Tab title={<EditableText value={p.tab3} onChange={v => ctx.setProp('tab3', v)} />} id='updates' />
          </Tabs>
        </div>
      )}
    />
    );
  };

  const renderChild = (bgId: number, child: BgChild) => {
    const childKey = `bg${bgId}:c${child.id}`;
    const addOptions = bgPlateChildrenAddOptions(bgId);
    const onDelete = removeChild(bgId, child.id);
    const typeSwap = {
      current: KIND_TO_TYPE_LABEL[child.kind] ?? 'Select',
      options: TYPE_SWAP_OPTIONS,
      onChange: swapChildKind(bgId, child.id),
    };
    if (child.kind === 'title') return (
      <DevPanelWrapper<TitleViewProps>
        title="TitleView"
        onDelete={onDelete}
        addOptions={addOptions}
        spec={BLOCK_TITLE_SPEC}
        baseProps={{
          heading: 'Заголовок секции',
          view: 'small',
        }}
        render={(p, ctx) => (
          <TitleView
            {...p}
            onHeadingChange={v => ctx.setProp('heading', v)}
            onSubtitleChange={v => ctx.setProp('subtitle', v)}
          />
        )}
      />
    );
    if (child.kind === 'tabs') return (
      <DevPanelWrapper<TabsProps>
        title="TagGroup"
        onDelete={onDelete}
        addOptions={addOptions}
        spec={TABS_SPEC}
        baseProps={{ size: '40', tagView: 'filled', tab1: 'Описание', tab2: 'Разработчику', tab3: 'Обновления' }}
        render={(p, ctx) => {
          const DynamicTabList = (props: SecondaryTabListProps) => (
            <SecondaryTabListDesktop {...props} tagView={p.tagView as 'filled' | 'outlined' | 'transparent'} tagShape="rectangular" />
          );
          return (
            // SecondaryTabList использует display: inline-flex, а Tabs root — block <div>.
            // Это создаёт line-box контекст с +4px к высоте (line-height шрифта).
            // Оборачиваем в flex-column, чтобы убрать inline-context и rect.height = visible.
            <div style={{ display: 'flex' }}>
              <Tabs
                TabList={DynamicTabList as never}
                size={PX_TO_TAB_SIZE[p.size] ?? 'xs'}
                selectedId={getActiveTab(childKey)}
                onChange={(_, { selectedId }) => setActiveTabFor(childKey)(selectedId as string)}
              >
                <Tab title={<EditableText value={p.tab1} onChange={v => ctx.setProp('tab1', v)} />} id='description' />
                <Tab title={<EditableText value={p.tab2} onChange={v => ctx.setProp('tab2', v)} />} id='dev' />
                <Tab title={<EditableText value={p.tab3} onChange={v => ctx.setProp('tab3', v)} />} id='updates' />
              </Tabs>
            </div>
          );
        }}
      />
    );
    if (child.kind === 'input') return (
      <DevPanelWrapper<InputProps>
        title="Input"
        onDelete={onDelete}
        addOptions={addOptions}
        typeSwap={typeSwap}
        spec={INPUT_SPEC}
        baseProps={{ label: 'Название поля', block: true, labelView: 'inner', size: '56' }}
        render={(p, ctx) => (
          <div style={{ width: p.block ? '100%' : '50%' }}>
            <InputDesktop
              label={<EditableText value={p.label} onChange={v => ctx.setProp('label', v)} />}
              labelView={p.labelView as 'inner' | 'outer'}
              size={Number(p.size) as 40 | 48 | 56 | 64}
              block
              disabled={p.disabled}
              error={p.error}
              success={p.success}
              hint={p.hint}
              clear={p.clear}
              value={inputValues[childKey] ?? ''}
              onChange={(_, { value }) => setInputValueFor(childKey)(value)}
            />
          </div>
        )}
      />
    );
    if (child.kind === 'date') return (
      <DevPanelWrapper<DateProps>
        key="date"
        title="Date Picker"
        onDelete={onDelete}
        addOptions={addOptions}
        typeSwap={typeSwap}
        spec={DATE_SPEC}
        baseProps={{ label: 'Дата контракта', view: 'date', picker: true, block: true, labelView: 'inner', size: '56', autoCorrection: true }}
        render={(p, ctx) => {
          const commonProps = {
            label: <EditableText value={p.label} onChange={v => ctx.setProp('label', v)} />,
            labelView: p.labelView as 'inner' | 'outer',
            size: Number(p.size) as 48 | 56 | 64 | 72,
            block: true,
            disabled: p.disabled,
            error: p.error,
            hint: p.hint,
            autoCorrection: p.autoCorrection,
            value: dateValues[childKey] ?? '',
            onChange: (_date: Date | null, valueStr: string) => setDateValueFor(childKey)(valueStr),
          };
          // UniversalDateInputDesktop = discriminated union по view: 'time' не принимает picker,
          // а 'date'/'date-time'/'date-range' принимает. При runtime ветка выбирается по p.picker;
          // TS-сужение здесь не делаем — кастуем агрессивно, поведение корректно.
          const DateInput = UniversalDateInputDesktop as unknown as React.ComponentType<Record<string, unknown>>;
          const view = p.view;
          const isTime = view === 'time';
          return (
            <div style={{ width: '50%' }}>
              {p.picker && !isTime
                ? <DateInput view={view} picker Calendar={Calendar} {...commonProps} />
                : <DateInput view={view} {...commonProps} />}
            </div>
          );
        }}
      />
    );
    return (
      <DevPanelWrapper<SelectProps>
        key="select"
        title="Select"
        onDelete={onDelete}
        addOptions={addOptions}
        typeSwap={typeSwap}
        spec={SELECT_SPEC}
        baseProps={{ label: 'Выпадающий список', block: true, multiple: true, labelView: 'inner', size: '56' }}
        render={(p, ctx) => (
          <div style={{ width: p.block ? '100%' : '50%' }}>
            <SelectDesktop
              label={<EditableText value={p.label} onChange={v => ctx.setProp('label', v)} />}
              labelView={p.labelView as 'inner' | 'outer'}
              size={Number(p.size) as 40 | 48 | 56 | 64 | 72}
              block
              multiple={p.multiple}
              disabled={p.disabled}
              showSearch={p.showSearch}
              error={p.error}
              hint={p.hint}
              clear={p.clear}
              options={selectOptions}
              selected={selectValues[childKey] ?? []}
              onChange={({ selectedMultiple }) => setSelectValueFor(childKey)(selectedMultiple as SelectValue)}
            />
          </div>
        )}
      />
    );
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-32)' }}>
        <Sortable items={titleViews} onReorder={setTitleViews}>
          {(tv) => (
            <SortableItem id={tv.id}>
              {renderTitleView(tv.id)}
            </SortableItem>
          )}
        </Sortable>
      </div>

      {tabsViews.length > 0 && (
        <div style={{ marginTop: 'var(--gap-32)', display: 'flex', flexDirection: 'column', gap: 'var(--gap-32)' }}>
          <Sortable items={tabsViews} onReorder={setTabsViews}>
            {(tv) => (
              <SortableItem id={tv.id}>
                {renderTabsView(tv.id)}
              </SortableItem>
            )}
          </Sortable>
        </div>
      )}

      <div style={{ marginTop: 'var(--gap-32)', display: 'grid', gridTemplateColumns: gridColumns, gap: 'var(--gap-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-24)' }}>
          <Sortable items={bgPlates} onReorder={setBgPlates}>
            {(bp) => (
              <SortableItem id={bp.id}>
                <BackgroundPlate
                  view={BackgroundPlateView.Primary}
                  onDuplicate={duplicateBgPlate(bp.id)}
                  onDelete={bgPlates.length > 1 ? removeBgPlate(bp.id) : undefined}
                  addOptions={bgPlateChildrenAddOptions(bp.id)}
                >
                  <BgPlateRowsDnd
                    rows={bp.children}
                    onMove={moveChild(bp.id)}
                    renderItem={(_row, child) => renderChild(bp.id, child)}
                    canGroup={(_srcRowId, srcItemId, destRowId, _destItemId) => {
                      const src = findChild(bp.children, srcItemId);
                      const destRow = findRow(bp.children, destRowId);
                      if (!src || !destRow) return false;
                      if (!isGroupable(src.kind)) return false;
                      return destRow.items.every(it => isGroupable(it.kind));
                    }}
                    getRowGap={(prev, curr) => {
                      // Правила из BackgroundPlate.md / PageStructure.md:
                      // Title/TagGroup → Input/Select/Date: 20px
                      // Input/Select/Date → Input/Select/Date: 24px
                      const isTitleOrTabs = (row: typeof prev) =>
                        row.items.some(it => it.kind === 'title' || it.kind === 'tabs');
                      if (isTitleOrTabs(prev) || isTitleOrTabs(curr)) return 'var(--gap-20)';
                      return 'var(--gap-24)';
                    }}
                  />
                </BackgroundPlate>
              </SortableItem>
            )}
          </Sortable>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-24)' }}>
          {isleBlocks.length === 0 ? (
            <IsleBlockPlaceholder onAdd={addIsleBlock} />
          ) : (
          <Sortable items={isleBlocks} onReorder={setIsleBlocks}>
            {(ib) => (
              <SortableItem id={ib.id}>
                <DevPanelWrapper
                  title="IsleBlock"
                  onDuplicate={addIsleBlock}
                  onDelete={removeIsleBlock(ib.id)}
                  addOptions={isleBlockAddOptions}
                  spec={STEPS_SPEC}
                  baseProps={{ activeStep, ordered: false, isMarkCompletedSteps: true, interactive: true }}
                  render={(p) => (
                    <div style={{
                      borderRadius: 'var(--border-radius-16)',
                      background: 'var(--color-light-base-bg-primary)',
                      paddingTop: 'var(--gap-32)',
                      paddingBottom: 'calc(var(--gap-32) + var(--gap-4))',
                      paddingLeft: 'var(--gap-24)',
                      paddingRight: 'var(--gap-24)',
                    }}>
                      <Steps
                        isVerticalAlign={true}
                        ordered={p.ordered as boolean}
                        activeStep={p.activeStep as number}
                        isMarkCompletedSteps={p.isMarkCompletedSteps as boolean}
                        interactive={p.interactive as boolean}
                        onChange={setActiveStep}
                      >
                        <div>Шаг первый</div>
                        <div>Шаг второй</div>
                        <div>Шаг третий</div>
                        <div>Шаг четвёртый</div>
                        <div>Шаг пятый</div>
                      </Steps>
                    </div>
                  )}
                />
              </SortableItem>
            )}
          </Sortable>
          )}
        </div>
      </div>
    </>
  );
}

const ISLE_PLACEHOLDER_CSS = `
.isle-placeholder {
  width: 100%;
  min-height: 120px;
  padding: var(--gap-32);
  border-radius: var(--border-radius-16);
  border: 1.5px dashed transparent;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  color: transparent;
}
.isle-placeholder:hover {
  border-color: var(--color-light-border-primary);
  color: var(--color-light-text-secondary);
}
`;

function IsleBlockPlaceholder({ onAdd }: { onAdd: () => void }) {
  return (
    <>
      <style>{ISLE_PLACEHOLDER_CSS}</style>
      <button type="button" className="isle-placeholder" onClick={onAdd}>
        <PlusMIcon width={24} height={24} />
      </button>
    </>
  );
}
