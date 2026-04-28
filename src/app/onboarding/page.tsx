import { RouteGate } from "@/components/auth/route-gate";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default function OnboardingPage() {
  return (
    <RouteGate mode="onboarding">
      <OnboardingFlow />
    </RouteGate>
  );
}
