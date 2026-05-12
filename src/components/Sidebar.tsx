import { useState } from 'react';
import { Text } from '@alfalab/core-components/typography/text';
import { TileMIcon } from '@alfalab/icons-glyph/TileMIcon';
import { AScoresCircleMIcon } from '@alfalab/icons-glyph/AScoresCircleMIcon';
import { PlusCircleMIcon } from '@alfalab/icons-glyph/PlusCircleMIcon';
import { RocketMIcon } from '@alfalab/icons-glyph/RocketMIcon';
import { ArrowsCwMIcon } from '@alfalab/icons-glyph/ArrowsCwMIcon';
import { ArrowDownLineDownMIcon } from '@alfalab/icons-glyph/ArrowDownLineDownMIcon';
import { DocumentStampLineMIcon } from '@alfalab/icons-glyph/DocumentStampLineMIcon';
import { DocumentLinesMIcon } from '@alfalab/icons-glyph/DocumentLinesMIcon';
import { SquareAcademicCapMIcon } from '@alfalab/icons-glyph/SquareAcademicCapMIcon';
import { DocumentStampMIcon } from '@alfalab/icons-glyph/DocumentStampMIcon';
import { CategoryInvoiceMIcon } from '@alfalab/icons-glyph/CategoryInvoiceMIcon';
import { CardMIcon } from '@alfalab/icons-glyph/CardMIcon';
import { EagleMIcon } from '@alfalab/icons-glyph/EagleMIcon';
import { GearMIcon } from '@alfalab/icons-glyph/GearMIcon';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const NAV_ITEMS: { label: string; Icon: IconComponent }[] = [
  { label: 'Все сервисы', Icon: TileMIcon },
  { label: 'Альфа-Выгодно', Icon: AScoresCircleMIcon },
];

const MENU_ITEMS: { label: string; Icon: IconComponent }[] = [
  { label: 'Новый платёж', Icon: PlusCircleMIcon },
  { label: 'Лента операций', Icon: RocketMIcon },
  { label: 'Платежи в работе', Icon: ArrowsCwMIcon },
  { label: 'Импорт платежей', Icon: ArrowDownLineDownMIcon },
  { label: 'Выписка', Icon: DocumentStampLineMIcon },
  { label: 'Счета', Icon: DocumentLinesMIcon },
  { label: 'Аккредитивы', Icon: SquareAcademicCapMIcon },
  { label: 'Справки', Icon: DocumentStampMIcon },
  { label: 'Счета на оплату', Icon: CategoryInvoiceMIcon },
  { label: 'Карты', Icon: CardMIcon },
];

function Cell({ label, Icon, product = false, active = false }: {
  label: string;
  Icon: IconComponent;
  product?: boolean;
  active?: boolean;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ padding: 'var(--gap-4) var(--gap-12)', cursor: 'pointer' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--gap-8)',
        borderRadius: 'var(--border-radius-12)',
        paddingLeft: 'var(--gap-4)', paddingRight: 'var(--gap-8)', paddingTop: 'var(--gap-4)', paddingBottom: 'var(--gap-4)',
        background: active ? '#e7e8eb' : hover ? 'rgba(15,25,55,0.06)' : 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {active && (
          <div style={{
            position: 'absolute', left: 0, top: 4, bottom: 4,
            width: 2, background: 'var(--color-light-accent-primary)', borderRadius: '0 2px 2px 0',
          }} />
        )}
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon width={20} height={20} style={{ opacity: (active || product) ? 1 : 0.6 }} />
        </div>
        <Text
          tag="span"
          view="primary-medium"
          weight="medium"
          color="primary"
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {label}
        </Text>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ padding: 'var(--gap-12) var(--gap-16)' }}>
      <div style={{ height: 1, background: 'rgba(15,25,55,0.1)' }} />
    </div>
  );
}

export function Sidebar({ activeItem }: { activeItem?: string }) {
  return (
    <div style={{
      width: 248, height: '100vh',
      background: 'var(--color-light-base-bg-secondary)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0,
      overflow: 'hidden',
      flexShrink: 0,
    }}>

      {/* LogoCell */}
      <div style={{
        padding: 'var(--gap-12)', display: 'flex', alignItems: 'center', gap: 'var(--gap-12)',
        position: 'sticky', top: 0, zIndex: 1, background: 'var(--color-light-base-bg-secondary)',
      }}>
        <div style={{
          width: 40, height: 40, background: 'var(--color-light-accent-primary)', flexShrink: 0,
          WebkitMaskImage: 'url(/src/assets/logo/logo_superellipse_mask.svg)',
          WebkitMaskSize: 'cover', maskImage: 'url(/src/assets/logo/logo_superellipse_mask.svg)',
          maskSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="/src/assets/logo/logo_alfa_sign.svg" width={24} height={24} />
        </div>
        <img src="/src/assets/logo/logo_alfa_biznes_text.svg" width={123} height={16} />
      </div>

      {/* Gradient under LogoCell */}
      <div style={{
        height: 8, marginTop: -8,
        background: 'linear-gradient(var(--color-light-base-bg-secondary), transparent)',
        position: 'relative', zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Cells */}
      <div style={{
        flex: 1, overflowY: 'auto', paddingTop: 'var(--gap-8)',
        scrollbarWidth: 'none',
      }}>
        {NAV_ITEMS.map(item => (
          <Cell key={item.label} label={item.label} Icon={item.Icon} product active={activeItem === item.label} />
        ))}
        <Divider />
        {MENU_ITEMS.map(item => (
          <Cell key={item.label} label={item.label} Icon={item.Icon} active={activeItem === item.label} />
        ))}
        <Divider />
        <Cell label="Госзакупки" Icon={EagleMIcon} />
      </div>

      {/* Footer */}
      <div style={{ position: 'relative' }}>
        <div style={{
          height: 32, pointerEvents: 'none',
          background: 'linear-gradient(transparent, var(--color-light-base-bg-secondary))',
        }} />
        <div style={{ paddingBottom: 'var(--gap-12)', paddingTop: 'var(--gap-4)', paddingLeft: 'var(--gap-12)', paddingRight: 'var(--gap-12)' }}>
          <Cell label="Настроить меню" Icon={GearMIcon} />
        </div>
      </div>
    </div>
  );
}
