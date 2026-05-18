import React, { useState } from 'react';
import { Steps } from '@alfalab/core-components/steps';
import { InputDesktop } from '@alfalab/core-components/input/desktop';
import { SelectDesktop } from '@alfalab/core-components/select/desktop';
import '@alfalab/core-components-themes/select/corp.css';
import { TitleView, type TitleViewProps, STATUS_COLOR_LABELS, STATUS_LABEL_TO_COLOR, type StatusColorLabel } from '../components/TitleView';
import { useBreakpoint } from '../utils/useBreakpoint';
import { BackgroundPlate, BackgroundPlateView } from '../components/BackgroundPlate';
import { Sortable, SortableItem } from '../components/Sortable';
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
import { DevPanelWrapper, type PropSpec, type AddOption } from '@local/devpanel';

type ChildKind = 'title' | 'tabs' | 'input' | 'select';
type BgChild = { id: number; kind: ChildKind };
type BgPlateItem = { id: number; children: BgChild[] };
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

const CHILD_KINDS: ChildKind[] = ['title', 'tabs', 'input', 'select'];
const isBgPlatesArray = (v: unknown): v is BgPlateItem[] =>
  Array.isArray(v) && v.every(it =>
    it && typeof (it as BgPlateItem).id === 'number' &&
    Array.isArray((it as BgPlateItem).children) &&
    (it as BgPlateItem).children.every(c =>
      c && typeof c.id === 'number' && CHILD_KINDS.includes(c.kind as ChildKind)),
  );

const nextId = (used: number[]) => (used.length > 0 ? Math.max(...used) + 1 : 0);

type TabsProps = { size: string; tagView: string; tagShape: string };
type InputProps = { label: string; labelView: string; size: string; block: boolean; disabled?: boolean; error?: string | boolean; success?: boolean; hint?: string; clear?: boolean };
type SelectProps = { label: string; labelView: string; size: string; block: boolean; multiple?: boolean; disabled?: boolean; showSearch?: boolean; error?: string | boolean; hint?: string; clear?: boolean };

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
  { name: 'size', label: 'Размер', control: 'cycle', values: ['xxs', 'xs', 's', 'm', 'l', 'xl'] },
  { name: 'tagView', label: 'Вид тега', control: 'cycle', values: ['outlined', 'filled', 'transparent'] },
  { name: 'tagShape', label: 'Форма тега', control: 'cycle', values: ['rounded', 'rectangular'] },
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

const childGap = (kind: ChildKind, prevKind: ChildKind | null): string => {
  if (prevKind === null) return '0';
  if (kind === 'input' || kind === 'select') return 'var(--gap-24)';
  return 'var(--gap-20)';
};

export default function BasePage() {
  const { device } = useBreakpoint();
  const [activeStep, setActiveStep] = useState(2);
  const [activeTab, setActiveTab] = useState('description');
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<{ key: string; content?: string }[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [titleViews, setTitleViews] = usePersisted<IdItem[]>(
    'alfabank.base.v2.titleViews', [{ id: 0 }], isIdItemArray,
  );
  const [bgPlates, setBgPlates] = usePersisted<BgPlateItem[]>(
    'alfabank.base.v2.bgPlates',
    [{ id: 0, children: [{ id: 0, kind: 'tabs' }, { id: 1, kind: 'input' }, { id: 2, kind: 'select' }] }],
    isBgPlatesArray,
  );
  const [isleBlocks, setIsleBlocks] = usePersisted<IdItem[]>(
    'alfabank.base.v2.isleBlocks', [{ id: 0 }], isIdItemArray,
  );

  const addTitleView = () =>
    setTitleViews(prev => [...prev, { id: nextId(prev.map(i => i.id)) }]);
  const removeTitleView = (id: number) => () =>
    setTitleViews(prev => prev.filter(i => i.id !== id));

  const addBgPlate = () =>
    setBgPlates(prev => [...prev, { id: nextId(prev.map(i => i.id)), children: [] }]);
  const removeBgPlate = (id: number) => () =>
    setBgPlates(prev => prev.filter(i => i.id !== id));

  const addIsleBlock = () =>
    setIsleBlocks(prev => [...prev, { id: nextId(prev.map(i => i.id)) }]);
  const removeIsleBlock = (id: number) => () =>
    setIsleBlocks(prev => prev.filter(i => i.id !== id));

  const addChildTo = (bgId: number, kind: ChildKind) => () =>
    setBgPlates(prev => prev.map(bp =>
      bp.id !== bgId ? bp : { ...bp, children: [...bp.children, { id: nextId(bp.children.map(c => c.id)), kind }] },
    ));
  const removeChild = (bgId: number, childId: number) => () =>
    setBgPlates(prev => prev.map(bp =>
      bp.id !== bgId ? bp : { ...bp, children: bp.children.filter(c => c.id !== childId) },
    ));
  const reorderChildren = (bgId: number) => (next: BgChild[]) =>
    setBgPlates(prev => prev.map(bp => bp.id !== bgId ? bp : { ...bp, children: next }));

  const titleViewAddOptions: AddOption[] = [
    { label: 'TitleView', onSelect: addTitleView },
  ];
  const bgPlateChildrenAddOptions = (bgId: number): AddOption[] => [
    { label: 'TitleView', onSelect: addChildTo(bgId, 'title') },
    { label: 'TabsSecondary', onSelect: addChildTo(bgId, 'tabs') },
    { label: 'Input', onSelect: addChildTo(bgId, 'input') },
    { label: 'Select', onSelect: addChildTo(bgId, 'select') },
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
      onDelete={removeTitleView(tvId)}
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
      render={({ button1, button2, button3, button4, menuItem1, menuItem2, menuItem3, statusColorLabel, ...rest }) => {
        const statusColor = statusColorLabel ? STATUS_LABEL_TO_COLOR[statusColorLabel] : undefined;
        const menuItems = [menuItem1, menuItem2, menuItem3].filter((s): s is string => Boolean(s));
        const buttons = [
          button1 && <Button key="1" view="primary" size={56}>{button1}</Button>,
          button2 && <Button key="2" view="secondary" size={56}>{button2}</Button>,
          button3 && <Button key="3" view="secondary" size={56}>{button3}</Button>,
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
                {menuItems.map((label, i) => (
                  <button
                    key={`${i}-${label}`}
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
                    {label}
                  </button>
                ))}
              </div>
            </Popover>
          </>
        ) : undefined;
        return <TitleView {...rest} statusColor={statusColor} buttonsGroup={buttonsGroup} />;
      }}
    />
  );

  const renderChild = (bgId: number, child: BgChild) => {
    const addOptions = bgPlateChildrenAddOptions(bgId);
    const onDelete = removeChild(bgId, child.id);
    if (child.kind === 'title') return (
      <DevPanelWrapper<TitleViewProps>
        title="TitleView"
        onDelete={onDelete}
        addOptions={addOptions}
        spec={BLOCK_TITLE_SPEC}
        baseProps={{
          heading: 'Заголовок секции',
          view: 'small',
          leftAddon: BLOCK_TITLE_LEFT_ICON,
          rightAddon: BLOCK_TITLE_RIGHT_ICON,
        }}
        render={(p) => <TitleView {...p} />}
      />
    );
    if (child.kind === 'tabs') return (
      <DevPanelWrapper<TabsProps>
        title="TabsSecondary"
        onDelete={onDelete}
        addOptions={addOptions}
        spec={TABS_SPEC}
        baseProps={{ size: 'xs', tagView: 'filled', tagShape: 'rounded' }}
        render={(p) => {
          const DynamicTabList = (props: SecondaryTabListProps) => (
            <SecondaryTabListDesktop {...props} tagView={p.tagView as 'filled' | 'outlined' | 'transparent'} tagShape={p.tagShape as 'rounded' | 'rectangular'} />
          );
          return (
            <Tabs
              TabList={DynamicTabList as never}
              size={p.size as 'xs' | 'xxs' | 's' | 'm' | 'l' | 'xl'}
              selectedId={activeTab}
              onChange={(_, { selectedId }) => setActiveTab(selectedId as string)}
            >
              <Tab title='Описание' id='description' />
              <Tab title='Разработчику' id='dev' />
              <Tab title='Обновления' id='updates' />
            </Tabs>
          );
        }}
      />
    );
    if (child.kind === 'input') return (
      <DevPanelWrapper<InputProps>
        title="Input"
        onDelete={onDelete}
        addOptions={addOptions}
        spec={INPUT_SPEC}
        baseProps={{ label: 'Название поля', block: true, labelView: 'inner', size: '48' }}
        render={(p) => (
          <InputDesktop
            label={p.label}
            labelView={p.labelView as 'inner' | 'outer'}
            size={Number(p.size) as 40 | 48 | 56 | 64}
            block={p.block}
            disabled={p.disabled}
            error={p.error}
            success={p.success}
            hint={p.hint}
            clear={p.clear}
            value={inputValue}
            onChange={(_, { value }) => setInputValue(value)}
          />
        )}
      />
    );
    return (
      <DevPanelWrapper<SelectProps>
        title="Select"
        onDelete={onDelete}
        addOptions={addOptions}
        spec={SELECT_SPEC}
        baseProps={{ label: 'Выпадающий список', block: true, multiple: true, labelView: 'inner', size: '48' }}
        render={(p) => (
          <SelectDesktop
            label={p.label}
            labelView={p.labelView as 'inner' | 'outer'}
            size={Number(p.size) as 40 | 48 | 56 | 64 | 72}
            block={p.block}
            multiple={p.multiple}
            disabled={p.disabled}
            showSearch={p.showSearch}
            error={p.error}
            hint={p.hint}
            clear={p.clear}
            options={selectOptions}
            selected={selectedOptions}
            onChange={({ selectedMultiple }) => setSelectedOptions(selectedMultiple as typeof selectedOptions)}
          />
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

      <div style={{ marginTop: 'var(--gap-32)', display: 'grid', gridTemplateColumns: gridColumns, gap: 'var(--gap-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-24)' }}>
          <Sortable items={bgPlates} onReorder={setBgPlates}>
            {(bp) => (
              <SortableItem id={bp.id}>
                <BackgroundPlate
                  view={BackgroundPlateView.Primary}
                  onDuplicate={addBgPlate}
                  onDelete={removeBgPlate(bp.id)}
                  addOptions={bgPlateChildrenAddOptions(bp.id)}
                >
                  <Sortable items={bp.children} onReorder={reorderChildren(bp.id)}>
                    {(child) => {
                      const idx = bp.children.findIndex(c => c.id === child.id);
                      const prevKind = idx > 0 ? bp.children[idx - 1].kind : null;
                      const gap = childGap(child.kind, prevKind);
                      return (
                        <div style={{ marginTop: gap }}>
                          <SortableItem id={child.id}>
                            {renderChild(bp.id, child)}
                          </SortableItem>
                        </div>
                      );
                    }}
                  </Sortable>
                </BackgroundPlate>
              </SortableItem>
            )}
          </Sortable>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-24)' }}>
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
        </div>
      </div>
    </>
  );
}
