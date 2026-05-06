"use server";

import { revalidatePath } from "next/cache";
import { getAppUrl } from "@/lib/env";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";

export type InviteEmployeeState = {
  ok: boolean;
  message: string;
  inviteLink?: string;
};

function normalizeEmail(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Employee email is required.");
  }

  return value.trim().toLowerCase();
}

export async function inviteEmployee(
  _previousState: InviteEmployeeState,
  formData: FormData,
): Promise<InviteEmployeeState> {
  try {
    const { profile } = await requireRole("ADMIN");
    const supabase = await createClient();
    const email = normalizeEmail(formData.get("email"));

    const { data, error } = await supabase
      .from("invites")
      .insert({
        workspace_id: profile.workspace_id,
        email,
        role: "EMPLOYEE",
        invited_by: profile.id,
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("token")
      .single<{ token: string }>();

    if (error || !data) {
      return {
        ok: false,
        message: error?.message ?? "Failed to create invite.",
      };
    }

    revalidatePath("/admin/employees");

    return {
      ok: true,
      message: "Invite created. Share this link with the employee.",
      inviteLink: `${getAppUrl()}/invite/${data.token}`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create invite.",
    };
  }
}
