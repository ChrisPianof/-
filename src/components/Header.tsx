import { Text } from '@alfalab/core-components/typography/text';
import { MagnifierMIcon } from '@alfalab/icons-glyph/MagnifierMIcon';
import { MailMIcon } from '@alfalab/icons-glyph/MailMIcon';
import { BellMIcon } from '@alfalab/icons-glyph/BellMIcon';
import { DoorOpenMIcon } from '@alfalab/icons-glyph/DoorOpenMIcon';
import { ChevronLeftMIcon } from '@alfalab/icons-glyph/ChevronLeftMIcon';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function IconBtn({ Icon }: { Icon: IconComponent }) {
  return (
    <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon width={24} height={24} style={{ opacity: 0.6 }} />
    </div>
  );
}

function DividerV() {
  return (
    <div style={{ padding: 'var(--gap-4) 0' }}>
      <div style={{ width: 1, height: 32, background: 'rgba(15,25,55,0.1)' }} />
    </div>
  );
}

export function Header({ showBack = false }: { showBack?: boolean }) {
  return (
    <div style={{
      height: 56,
      background: 'var(--color-light-base-bg-secondary)',
      display: 'flex', alignItems: 'center',
      padding: 'var(--gap-8) var(--gap-24)',
      position: 'fixed', top: 0, left: 248, right: 0,
      zIndex: 10,
      overflow: 'clip',
    }}>

      {/* Left — кнопка Назад */}
      {showBack && (
        <button style={{
          display: 'flex', alignItems: 'center', gap: 'var(--gap-2)',
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderRadius: 'var(--border-radius-10)', paddingLeft: 'var(--gap-16)', paddingRight: 'var(--gap-20)', paddingTop: 'var(--gap-4)', paddingBottom: 'var(--gap-4)',
        }}>
          <ChevronLeftMIcon width={24} height={24} style={{ opacity: 0.6 }} />
          <Text tag="span" view="primary-medium" weight="medium" color="secondary">Назад</Text>
        </button>
      )}

      {/* Right */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--gap-16)' }}>
        <IconBtn Icon={MagnifierMIcon} />
        <DividerV />
        <div style={{ display: 'flex', gap: 'var(--gap-8)' }}>
          <IconBtn Icon={MailMIcon} />
          <IconBtn Icon={BellMIcon} />
        </div>
        <DividerV />

        {/* SingleAccount */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-12)', paddingLeft: 'var(--gap-8)' }}>
          <div style={{
            width: 40, height: 40, flexShrink: 0,
            background: 'rgba(30,43,68,0.08)',
            WebkitMaskImage: 'url(/src/assets/icons/ic_superellipse_mask.svg)',
            WebkitMaskSize: 'cover',
            maskImage: 'url(/src/assets/icons/ic_superellipse_mask.svg)',
            maskSize: 'cover',
          }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text tag="span" view="primary-medium" weight="medium" color="primary" style={{ whiteSpace: 'nowrap' }}>ООО «Компания»</Text>
            <Text tag="span" view="primary-small" color="secondary" style={{ whiteSpace: 'nowrap' }}>Иван Иванов</Text>
          </div>
        </div>

        <DividerV />
        <IconBtn Icon={DoorOpenMIcon} />
      </div>
    </div>
  );
}
