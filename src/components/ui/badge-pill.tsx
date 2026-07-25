import { cx } from "@/lib/utils";

export function BadgePill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "red" | "purple" | "cyan" | "orange";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "neutral" && "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)]",
        tone === "blue" && "bg-[var(--color-blue-soft)] text-[var(--color-blue)]",
        tone === "green" && "bg-[var(--color-green-soft)] text-[var(--color-green)]",
        tone === "amber" && "bg-[var(--color-amber-soft)] text-[var(--color-amber)]",
        tone === "red" && "bg-[var(--color-red-soft)] text-[var(--color-red)]",
        tone === "purple" && "bg-[var(--color-purple-soft)] text-[var(--color-purple)]",
        tone === "cyan" && "bg-[var(--color-cyan-soft)] text-[var(--color-cyan)]",
        tone === "orange" && "bg-[var(--color-orange-soft)] text-[var(--color-orange)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
