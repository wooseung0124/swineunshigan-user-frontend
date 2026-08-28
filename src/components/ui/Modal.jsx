import { useEffect } from 'react';
import Button from './Button';
import './Modal.css';

/**
 * 확인·알림용 모달 컴포넌트.
 */
export default function Modal({
  isOpen,
  title,
  children,
  confirmLabel = '확인',
  cancelLabel,
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  actionsLayout = 'column',
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && onCancel) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const actionClass =
    actionsLayout === 'row'
      ? 'ui-modal__actions ui-modal__actions--row'
      : 'ui-modal__actions';

  return (
    <div
      className="ui-modal__overlay"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="ui-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'ui-modal-title' : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <h2 id="ui-modal-title" className="ui-modal__title">
            {title}
          </h2>
        )}
        {children && <div className="ui-modal__body">{children}</div>}
        <div className={actionClass}>
          {cancelLabel && (
            <Button variant="secondary" fullWidth onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          {onConfirm && (
            <Button variant={confirmVariant} fullWidth onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
