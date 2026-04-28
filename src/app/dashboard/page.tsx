import { RouteGate } from "@/components/auth/route-gate";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default function DashboardPage() {
  return (
    <RouteGate mode="app">
      <DashboardView />
    </RouteGate>
  );
}
