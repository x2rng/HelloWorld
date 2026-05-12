import { AvatarEditorForm } from "@/components/employee/avatar-editor-form";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/exp-auth";
import { normalizeAvatarConfig } from "@/lib/avatar-config";
import { createClient } from "@/lib/supabase/server";

type ProfileAvatarRow = {
  avatar_config: unknown;
};

export const dynamic = "force-dynamic";

export default async function EmployeeAvatarPage() {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar_config")
    .eq("id", profile.id)
    .maybeSingle<ProfileAvatarRow>();

  if (error) {
    throw new Error(`Failed to load avatar config: ${error.message}`);
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-[36px] p-6 sm:p-8">
        <p className="eyebrow">Avatar identity</p>
        <h2 className="mt-2 text-4xl">Create your EXP avatar.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          Choose a simple full-body identity. Your look stays yours while the
          stage frame evolves as your level increases.
        </p>
      </Card>

      <AvatarEditorForm initialConfig={normalizeAvatarConfig(data?.avatar_config)} />
    </div>
  );
}
