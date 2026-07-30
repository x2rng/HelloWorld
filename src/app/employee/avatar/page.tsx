import { AvatarEditorForm } from "@/components/employee/avatar-editor-form";
import { Card } from "@/components/ui/card";
import { getCompanionStage } from "@/lib/avatar/get-companion-stage";
import { requireRole } from "@/lib/exp-auth";
import { getLevelInfo } from "@/lib/levels";
import { createClient } from "@/lib/supabase/server";

type ProfileAvatarRow = {
  avatar_config: unknown;
};

type EmployeeXpRow = {
  total_xp: number;
};

export const dynamic = "force-dynamic";

export default async function EmployeeAvatarPage() {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const [avatarResult, statsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("avatar_config")
      .eq("id", profile.id)
      .maybeSingle<ProfileAvatarRow>(),
    supabase
      .from("employee_stats")
      .select("total_xp")
      .eq("workspace_id", profile.workspace_id)
      .eq("employee_id", profile.id)
      .maybeSingle<EmployeeXpRow>(),
  ]);

  if (avatarResult.error || statsResult.error) {
    throw new Error("Your companion editor could not be loaded.");
  }
  const level = getLevelInfo(statsResult.data?.total_xp ?? 0);
  const companionStage = getCompanionStage(level.level);

  return (
    <div className="space-y-5">
      <Card className="rounded-[36px] p-6 sm:p-8">
        <p className="eyebrow">Player Companion</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Choose your companion</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          Choose a companion that will grow with you throughout your onboarding
          journey. You can adjust its look now and change it later.
        </p>
      </Card>

      <AvatarEditorForm
        initialStoredConfig={avatarResult.data?.avatar_config}
        companionStage={companionStage.id}
      />
    </div>
  );
}
