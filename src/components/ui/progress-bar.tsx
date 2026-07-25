import { cx } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  tone = "blue",
}: {
  value: number;
  className?: string;
  tone?: "blue" | "green" | "amber" | "purple" | "cyan" | "orange";
}) {
  return (
    <div className={cx("h-2.5 w-full overflow-hidden rounded-full bg-[var(--progress-track)]", className)}>
      <div
        className={cx(
          "h-full rounded-full transition-all duration-500",
          tone === "blue" && "bg-[var(--color-blue)]",
          tone === "green" && "bg-[var(--color-green)]",
          tone === "amber" && "bg-[var(--color-amber)]",
          tone === "purple" && "bg-[var(--color-purple)]",
          tone === "cyan" && "bg-[var(--color-cyan)]",
          tone === "orange" && "bg-[var(--color-orange)]",
        )}
        style={{ width: `${Math.max(6, value)}%` }}
      />
    </div>
  );
}
