import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="font-sans text-sm font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`min-h-11 w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-4 py-3 font-sans text-sm text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-[var(--color-error)]"
            : "border-[var(--color-border)]"
        } ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && id ? `${id}-error` : undefined}
        {...props}
      />

      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          className="font-sans text-xs text-[var(--color-error)]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}