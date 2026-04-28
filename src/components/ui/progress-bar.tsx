import { cx } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  tone = "blue",
}: {
  value: number;
  className?: string;
  tone?: "blue" | "green" | "amber";
}) {
  return (
    <div className={cx("h-2.5 w-full overflow-hidden rounded-full bg-black/6", className)}>
      <div
        className={cx(
          "h-full rounded-full transition-all duration-500",
          tone === "blue" && "bg-[var(--color-blue)]",
          tone === "green" && "bg-[var(--color-green)]",
          tone === "amber" && "bg-[var(--color-amber)]",
        )}
        style={{ width: `${Math.max(6, value)}%` }}
      />
    </div>
  );
}
