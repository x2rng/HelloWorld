import { AvatarCustomizer } from "@/components/avatar/avatar-customizer";
import { RouteGate } from "@/components/auth/route-gate";

export default function AvatarPage() {
  return (
    <RouteGate mode="avatar">
      <AvatarCustomizer />
    </RouteGate>
  );
}
