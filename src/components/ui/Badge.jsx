import './Badge.css';

const VARIANT_CLASS = {
  recruiting: 'ui-badge--recruiting',
  closed: 'ui-badge--closed',
  cancelled: 'ui-badge--cancelled',
  activity: 'ui-badge--activity',
  gender: 'ui-badge--gender',
  waiting: 'ui-badge--waiting',
  arrived: 'ui-badge--arrived',
  late: 'ui-badge--late',
  absent: 'ui-badge--absent',
};

const VARIANT_LABEL = {
  recruiting: '모집중',
  closed: '모집마감',
  cancelled: '취소됨',
  activity: '활동유형',
  gender: '성별조건',
  waiting: '대기중',
  arrived: '도착',
  late: '지각',
  absent: '불참',
};

/**
 * 상태·카테고리 표시용 배지 컴포넌트.
 */
export default function Badge({ variant = 'recruiting', children, className = '' }) {
  const classes = [
    'ui-badge',
    VARIANT_CLASS[variant] ?? VARIANT_CLASS.recruiting,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children ?? VARIANT_LABEL[variant]}</span>;
}
