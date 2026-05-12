"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";

function redirectWithCompletionError(message: string): never {
  redirect(`/employee/onboarding?completionError=${encodeURIComponent(message)}`);
}

export async function completeTask(assignmentId: string, taskId: string) {
  await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { error: syncProgressError } = await supabase.rpc(
    "ensure_assignment_task_progress",
    {
      target_assignment_id: assignmentId,
    },
  );

  if (syncProgressError) {
    redirectWithCompletionError(
      `Failed to initialize task progress: ${syncProgressError.message}`,
    );
  }

  const { error } = await supabase.rpc("complete_assignment_task", {
    target_assignment_id: assignmentId,
    target_task_id: taskId,
  });

  if (error) {
    redirectWithCompletionError(`Failed to complete task: ${error.message}`);
  }

  revalidatePath("/employee");
  revalidatePath("/employee/onboarding");
  revalidatePath("/admin/assignments");
}
