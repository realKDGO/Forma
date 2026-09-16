import { useEffect, useRef } from "react";
import { X } from "lucide-react";
export const Field = ({ label, error, help, children }) => (
  <div className="field">
    <label>
      {label}
      {children}
    </label>
    {help && <small className="muted">{help}</small>}
    {error && (
      <span className="error" role="alert">
        {error}
      </span>
    )}
  </div>
);
export const ProgressBar = ({ label, value, target, unit = "g" }) => {
  const p = Math.min(100, Math.round((value / Math.max(1, target)) * 100));
  return (
    <div>
      <div className="metric">
        <span>{label}</span>
        <strong style={{ fontSize: "1rem" }}>
          {Math.round(value)} / {target} {unit}
        </strong>
      </div>
      <div
        className="progress"
        aria-label={`${label}: ${Math.round(value)} of ${target} ${unit}`}
      >
        <span style={{ width: `${p}%` }} />
      </div>
    </div>
  );
};
export function Modal({ title, children, onClose, actions }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    const focusTarget = dialog?.querySelector("button, a, input, select, textarea");
    (focusTarget || dialog)?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);
  return (
    <div
      className="modal-wrap"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <section
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="page-head">
          <h2 id="modal-title">{title}</h2>
          {onClose && (
            <button
              className="btn icon secondary"
              aria-label="Close"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          )}
        </div>
        {children}
        {actions && (
          <div className="modal-actions">
            {actions}
          </div>
        )}
      </section>
    </div>
  );
}
export function Sheet({ title, onClose, children }) {
  return (
    <div
      className="sheet-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="sheet" role="dialog" aria-modal="true">
        <div className="page-head">
          <h2>{title}</h2>
          <button
            className="btn icon secondary"
            aria-label="Close"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export const Empty = ({ title, text, action }) => (
  <div className="empty">
    <h3>{title}</h3>
    <p className="muted">{text}</p>
    {action}
  </div>
);
export const Loading = () => (
  <div className="grid">
    <div className="skeleton" style={{ height: 62 }} />
    <div className="skeleton" style={{ height: 180 }} />
    <div className="skeleton" style={{ height: 130 }} />
  </div>
);
