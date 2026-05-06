"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";

export async function completeTask(assignmentId: string, taskId: string) {
  await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { error } = await supabase.rpc("complete_assignment_task", {
    target_assignment_id: assignmentId,
    target_task_id: taskId,
  });

  if (error) {
    throw new Error(`Failed to complete task: ${error.message}`);
  }

  revalidatePath("/employee");
  revalidatePath("/employee/onboarding");
  revalidatePath("/admin/assignments");
}
