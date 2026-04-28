import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "reward";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center rounded-full font-medium outline-none ring-0 disabled:pointer-events-none disabled:opacity-45",
        variant === "primary" && "bg-[var(--color-ink)] text-white hover:-translate-y-0.5 hover:bg-black",
        variant === "secondary" &&
          "border border-[var(--color-border)] bg-white/80 text-[var(--color-ink)] hover:-translate-y-0.5 hover:bg-white",
        variant === "ghost" &&
          "border border-transparent bg-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]",
        variant === "reward" &&
          "border border-[rgba(199,147,44,0.18)] bg-[var(--color-amber-soft)] text-[var(--color-amber)] hover:-translate-y-0.5",
        size === "sm" && "h-10 px-4 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className,
      )}
      {...props}
    />
  );
}
