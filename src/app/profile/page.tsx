import { RouteGate } from "@/components/auth/route-gate";
import { ProfileView } from "@/components/profile/profile-view";

export default function ProfilePage() {
  return (
    <RouteGate mode="app">
      <ProfileView />
    </RouteGate>
  );
}
