"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";

export type ReviewActivityState = {
  ok: boolean;
  message: string;
};

function friendlyReviewError(message: string) {
  if (message.includes("already been reviewed")) {
    return "This activity has already been reviewed.";
  }
  if (message.includes("not found")) {
    return "This activity is no longer available.";
  }
  if (message.includes("outside your workspace")) {
    return "This activity is not available in your workspace.";
  }
  return "The activity status could not be updated. Please try again.";
}

export async function reviewGrowthActivity(
  activityId: string,
  _previousState: ReviewActivityState,
  formData: FormData,
): Promise<ReviewActivityState> {
  await requireRole("ADMIN");

  const status = formData.get("status");
  if (status !== "approved" && status !== "rejected") {
    return { ok: false, message: "Choose a valid review decision." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("review_growth_activity", {
    target_activity_id: activityId,
    target_status: status,
  });

  if (error) {
    return { ok: false, message: friendlyReviewError(error.message) };
  }

  if (data !== status) {
    return { ok: false, message: "The review was saved, but its status could not be confirmed." };
  }

  revalidatePath("/admin/activities");
  revalidatePath("/employee/activities");
  revalidatePath("/employee/feed");

  return {
    ok: true,
    message: status === "approved" ? "Activity approved." : "Activity rejected.",
  };
}
