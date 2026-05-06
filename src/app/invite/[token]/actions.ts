"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

export async function acceptInvite(token: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/invite/${token}`);
  }

  const { error } = await supabase.rpc("accept_invite", {
    invite_token: token,
    employee_full_name: optionalText(formData, "full_name"),
  });

  if (error) {
    throw new Error(`Failed to accept invite: ${error.message}`);
  }

  redirect("/employee");
}
