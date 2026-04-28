import type { HTMLAttributes } from "react";
import { cx } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("surface-panel rounded-[28px]", className)} {...props} />;
}
