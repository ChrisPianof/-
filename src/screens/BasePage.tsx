import React, { useState, type ReactNode } from 'react';
import { Steps } from '@alfalab/core-components/steps';
import { InputDesktop } from '@alfalab/core-components/input/desktop';
import { SelectDesktop } from '@alfalab/core-components/select/desktop';
import '@alfalab/core-components-themes/select/corp.css';
import { TitleView, type TitleViewProps } from '../components/TitleView';
import { useBreakpoint } from '../utils/useBreakpoint';
import { BackgroundPlate, BackgroundPlateView } from '../components/BackgroundPlate';
import { Tabs as TabsBase, Tab } from '@alfalab/core-components/tabs';
const Tabs = TabsBase as React.ComponentType<React.ComponentProps<typeof TabsBase> & { TabList?: unknown }>;
import { SecondaryTabListDesktop } from '@alfalab/core-components/tabs/desktop';
import type { SecondaryTabListDesktopProps as SecondaryTabListProps } from '@alfalab/core-components/tabs/desktop';
import { ButtonDesktop as Button } from '@alfalab/core-components/button/desktop';
import '@alfalab/core-components-themes/button/corp.css';
import { StatusBadge } from '@alfalab/core-components/status-badge';
import { Link } from '@alfalab/core-components/link';
import { DiamondsSIcon } from '@alfalab/icons-glyph/DiamondsSIcon';
import { DevPanelWrapper, type PropSpec } from '@local/devpanel';

type TabsProps = { size: string; tagView: string; tagShape: string };
type InputProps = { label: string; labelView: string; size: string; block: boolean; disabled?: boolean; error?: string | boolean; success?: boolean; hint?: string; clear?: boolean };
type SelectProps = { label: string; labelView: string; size: string; block: boolean; multiple?: boolean; disabled?: boolean; showSearch?: boolean; error?: string | boolean; hint?: string; clear?: boolean };

const titleAddon = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <StatusBadge view="positive-checkmark" size={16} />
    <Link view="default" underline>Изменить</Link>
  </div>
);

const buttonsGroup = (
  <div style={{ display: 'flex', gap: 16 }}>
    <Button view="primary" size={56}>Создать заявление</Button>
    <Button view="secondary" size={56}>Сохранить черновик</Button>
    <Button view="secondary" size={56}>Отмена</Button>
  </div>
);

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
  { name: 'heading', label: 'Заголовок', control: 'input' },
  { name: 'view', label: 'Размер', control: 'cycle', values: ['medium', 'large', 'xLarge'] },
  { name: 'subtitle', label: 'Подзаголовок', control: 'toggle+input', default: 'Подзаголовок' },
  { name: 'statusLabel', label: 'Статус-бейдж', control: 'toggle+input', default: 'Одобрено' },
  { name: 'titleAddon', label: 'Доп. элемент', control: 'node', default: titleAddon },
  { name: 'rightAddon', label: 'Правый аддон', control: 'node', default: rightAddonNode },
  { name: 'filterCompanySelectProps', label: 'Выбор компании', control: 'node', default: filterCompanySelectProps },
  { name: 'titleStatusProps', label: 'Статусный блок', control: 'node', default: titleStatusProps },
  { name: 'buttonsGroup', label: 'Кнопки', control: 'node', default: buttonsGroup },
  { name: 'showSkeleton', label: 'Скелетон', control: 'toggle' },
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

export default function BasePage() {
  const { device } = useBreakpoint();
  const [activeStep, setActiveStep] = useState(2);
  const [activeTab, setActiveTab] = useState('description');
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<{ key: string; content?: string }[]>([]);

  const selectOptions = [
    { key: 'opt1', content: 'Вариант 1', value: 'opt1' },
    { key: 'opt2', content: 'Вариант 2', value: 'opt2' },
    { key: 'opt3', content: 'Вариант 3', value: 'opt3' },
  ];

  const gridColumns =
    device === 'desktop' ? '1fr 400px' :
    device === 'tablet'  ? '1fr 400px' :
    '1fr';

  return (
    <>
      <DevPanelWrapper<TitleViewProps>
        title="TitleView"
        spec={TITLEVIEW_SPEC}
        baseProps={{
          heading: 'Заголовок страницы',
          view: 'xLarge',
          subtitle: 'Подзаголовок',
          statusLabel: 'Одобрено',
          titleAddon,
          rightAddon: rightAddonNode,
          filterCompanySelectProps,
          titleStatusProps,
          buttonsGroup,
        }}
        render={(p) => <TitleView {...p} />}
      />

      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: gridColumns, gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <BackgroundPlate view={BackgroundPlateView.Primary}>
            <DevPanelWrapper<TabsProps>
              title="TabsSecondary"
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
            <div style={{ marginTop: 20 }}>
              <DevPanelWrapper<InputProps>
                title="Input"
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
            </div>
            <div style={{ marginTop: 24 }}>
              <DevPanelWrapper<SelectProps>
                title="Select"
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
            </div>
          </BackgroundPlate>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <DevPanelWrapper
            title="IsleBlock"
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
        </div>
      </div>
    </>
  );
}
