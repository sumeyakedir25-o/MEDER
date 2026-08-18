interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-4 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-gold)]"
      />

      <p className="font-sans text-sm text-[var(--color-text-muted)]">
        {message}
      </p>
    </div>
  );
}