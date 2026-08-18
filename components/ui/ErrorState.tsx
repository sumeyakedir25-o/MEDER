import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now. Please try again.",
  action,
}: ErrorStateProps) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center px-6 py-16 text-center"
      role="alert"
    >
      <div
        aria-hidden="true"
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)]"
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
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </div>

      <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
        {title}
      </h2>

      <p className="mt-2 max-w-md font-sans text-sm leading-6 text-[var(--color-text-muted)]">
        {message}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}