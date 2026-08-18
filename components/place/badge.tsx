import type { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  icon?: ReactNode;
}

export default function Badge({
  variant = "default",
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 font-sans text-xs font-medium";

  const variants = {
    default:
      "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]",
    success:
      "border-[var(--color-success)] bg-[var(--color-success-bg)] text-[var(--color-success)]",
    warning:
      "border-[var(--color-warning)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
    error:
      "border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)]",
    info:
      "border-[var(--color-info)] bg-[var(--color-info-bg)] text-[var(--color-info)]",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && (
        <span aria-hidden="true" className="flex shrink-0">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </span>
  );
}