import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm(): void;
  onCancel(): void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (event.target === event.currentTarget && !loading) {
      onCancel();
    }
  }

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <button
          type="button"
          className="dialog-close-button"
          onClick={onCancel}
          disabled={loading}
          aria-label="Fechar confirmação"
        >
          <X size={19} />
        </button>

        <div
          className={
            destructive
              ? "dialog-icon destructive"
              : "dialog-icon"
          }
        >
          <AlertTriangle size={28} />
        </div>

        <h2 id="confirm-dialog-title">{title}</h2>

        <p id="confirm-dialog-description">
          {description}
        </p>

        <div className="dialog-actions">
          <button
            type="button"
            className="dialog-cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={
              destructive
                ? "dialog-confirm-button destructive"
                : "dialog-confirm-button"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Aguarde..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
