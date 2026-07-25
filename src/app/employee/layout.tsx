import { requireRole } from "@/lib/exp-auth";
import { EmployeeGameShell } from "@/components/layout/employee-game-shell";

export const dynamic = "force-dynamic";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("EMPLOYEE");

  return <EmployeeGameShell profile={profile}>{children}</EmployeeGameShell>;
}
