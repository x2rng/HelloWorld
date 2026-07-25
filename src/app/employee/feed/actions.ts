"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";

export type GiveRecognitionState = {
  ok: boolean;
  message: string;
  activityTotal?: number;
  dailyRemaining?: number;
  activityGiven?: number;
};

type RecognitionResult = {
  activity_total?: unknown;
  daily_used?: unknown;
  activity_given?: unknown;
};

function friendlyRecognitionError(message: string) {
  if (message.includes("daily 100-point")) return "You have reached your recognition budget for today.";
  if (message.includes("at most 10")) return "You can give up to 10 points to this activity.";
  if (message.includes("own activity")) return "You cannot recognize your own activity.";
  if (message.includes("not shared") || message.includes("not available")) return "This activity is not available for recognition.";
  return "Kudos could not be sent. Please try again.";
}

export async function giveActivityRecognition(
  activityId: string,
  _previousState: GiveRecognitionState,
  formData: FormData,
): Promise<GiveRecognitionState> {
  await requireRole("EMPLOYEE");
  const points = Number(formData.get("points"));
  if (![1, 5, 10].includes(points)) return { ok: false, message: "Choose a valid recognition amount." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("give_activity_recognition", {
    target_activity_id: activityId,
    target_points: points,
  });
  if (error) return { ok: false, message: friendlyRecognitionError(error.message) };

  const result = data && typeof data === "object" ? data as RecognitionResult : {};
  const activityTotal = Number(result.activity_total);
  const dailyUsed = Number(result.daily_used);
  const activityGiven = Number(result.activity_given);
  if (![activityTotal, dailyUsed, activityGiven].every(Number.isFinite)) {
    return { ok: false, message: "Kudos was sent, but the updated total could not be loaded." };
  }

  revalidatePath("/employee/feed");
  return {
    ok: true,
    message: "Kudos sent.",
    activityTotal,
    dailyRemaining: Math.max(0, 100 - dailyUsed),
    activityGiven,
  };
}
