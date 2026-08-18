import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center px-6 py-16 text-center">
      <div
        aria-hidden="true"
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-gold)]"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </div>

      <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
        {title}
      </h2>

      {message && (
        <p className="mt-2 max-w-md font-sans text-sm leading-6 text-[var(--color-text-muted)]">
          {message}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}