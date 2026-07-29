import { AvatarEditorForm } from "@/components/employee/avatar-editor-form";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/exp-auth";
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
        <p className="eyebrow">Player appearance</p>
        <h2 className="mt-2 text-4xl sm:text-5xl">Create a look that feels like you.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          Shape every layer of your full-body player. Your selected identity
          stays yours while level progression evolves the stage around it.
        </p>
      </Card>

      <AvatarEditorForm initialStoredConfig={data?.avatar_config} />
    </div>
  );
}
