"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/exp-auth";
import { getGrowthAreaForStep } from "@/lib/growth-areas";
import { normalizeSkillContributions } from "@/lib/skill-attribution";
import { createClient } from "@/lib/supabase/server";

type StepGrowthContext = {
  title: string;
  skill_contributions: unknown;
  milestone: { title: string } | null;
};

function redirectWithCompletionError(message: string): never {
  redirect(`/employee/onboarding?completionError=${encodeURIComponent(message)}`);
}

export async function completeTask(assignmentId: string, taskId: string) {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const [statsBeforeResult, stepContextResult] = await Promise.all([
    supabase
      .from("employee_stats")
      .select("total_xp, current_level")
      .eq("workspace_id", profile.workspace_id)
      .eq("employee_id", profile.id)
      .maybeSingle<{ total_xp: number; current_level: number }>(),
    supabase
      .from("tasks")
      .select("title, skill_contributions, milestone:milestones(title)")
      .eq("id", taskId)
      .maybeSingle<StepGrowthContext>(),
  ]);
  const statsBefore = statsBeforeResult.data;
  const stepContext = stepContextResult.data;
  const growthArea = getGrowthAreaForStep(
    stepContext?.milestone?.title ?? "",
    stepContext?.title ?? "",
  );
  const { error: syncProgressError } = await supabase.rpc(
    "ensure_assignment_task_progress",
    {
      target_assignment_id: assignmentId,
    },
  );

  if (syncProgressError) {
    redirectWithCompletionError(
      `Failed to initialize journey progress: ${syncProgressError.message}`,
    );
  }

  const { data: unlockedAchievements, error } = await supabase.rpc(
    "complete_assignment_task",
    {
      target_assignment_id: assignmentId,
      target_task_id: taskId,
    },
  );

  if (error) {
    redirectWithCompletionError(`Failed to complete growth step: ${error.message}`);
  }

  revalidatePath("/employee");
  revalidatePath("/employee/onboarding");
  revalidatePath("/admin/assignments");

  const achievementNames = Array.isArray(unlockedAchievements)
    ? unlockedAchievements.filter((name): name is string => typeof name === "string")
    : [];
  const { data: statsAfter } = await supabase
    .from("employee_stats")
    .select("total_xp, current_level")
    .eq("workspace_id", profile.workspace_id)
    .eq("employee_id", profile.id)
    .maybeSingle<{ total_xp: number; current_level: number }>();
  const feedback = new URLSearchParams({ completionSaved: "true" });
  feedback.set("growthArea", growthArea);
  const skillGains = normalizeSkillContributions(stepContext?.skill_contributions);
  if (skillGains.length > 0) {
    feedback.set("skillGains", JSON.stringify(skillGains));
  }

  if (statsBefore && statsAfter) {
    feedback.set(
      "xpEarned",
      String(Math.max(0, statsAfter.total_xp - statsBefore.total_xp)),
    );
    feedback.set("previousLevel", String(statsBefore.current_level));
  }

  if (achievementNames.length > 0) {
    feedback.set("achievementUnlocked", achievementNames.join(", "));
  }

  redirect(`/employee/onboarding?${feedback.toString()}`);
}
