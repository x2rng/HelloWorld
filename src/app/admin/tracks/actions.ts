"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/exp-auth";
import { normalizeSkillContributions, normalizeSkillFocus } from "@/lib/skill-attribution";
import { createClient } from "@/lib/supabase/server";

function requiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function positiveInt(formData: FormData, key: string, fallback: number) {
  const value = formData.get(key);
  const parsed = typeof value === "string" ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function jsonField(formData: FormData, key: string): unknown {
  const value = formData.get(key);
  if (typeof value !== "string") return [];
  try { return JSON.parse(value); } catch { throw new Error(`${key} is not valid JSON.`); }
}

async function assertTrackWorkspace(trackId: string, workspaceId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("onboarding_tracks")
    .select("id")
    .eq("id", trackId)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to verify onboarding track: ${error.message}`);
  }

  if (!data) {
    throw new Error("Onboarding track was not found in this workspace.");
  }
}

async function assertMilestoneTrack(milestoneId: string, trackId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("id")
    .eq("id", milestoneId)
    .eq("track_id", trackId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to verify milestone: ${error.message}`);
  }

  if (!data) {
    throw new Error("Milestone was not found in this onboarding track.");
  }
}

async function assertTaskMilestone(taskId: string, milestoneId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").select("id").eq("id", taskId).eq("milestone_id", milestoneId).maybeSingle();
  if (error) throw new Error(`Failed to verify task: ${error.message}`);
  if (!data) throw new Error("Task was not found in this milestone.");
}

export async function updateTrackSkillFocus(trackId: string, formData: FormData) {
  const { profile } = await requireRole("ADMIN");
  await assertTrackWorkspace(trackId, profile.workspace_id);
  const supabase = await createClient();
  const { error } = await supabase.from("onboarding_tracks").update({ skill_focus: normalizeSkillFocus(jsonField(formData, "skill_focus")) }).eq("id", trackId).eq("workspace_id", profile.workspace_id);
  if (error) throw new Error(`Failed to update track skills: ${error.message}`);
  revalidatePath(`/admin/tracks/${trackId}`);
  revalidatePath("/employee");
  revalidatePath("/employee/onboarding");
}

export async function updateMilestoneSkillFocus(trackId: string, milestoneId: string, formData: FormData) {
  const { profile } = await requireRole("ADMIN");
  await assertTrackWorkspace(trackId, profile.workspace_id);
  await assertMilestoneTrack(milestoneId, trackId);
  const supabase = await createClient();
  const { error } = await supabase.from("milestones").update({ skill_focus: normalizeSkillFocus(jsonField(formData, "skill_focus")) }).eq("id", milestoneId);
  if (error) throw new Error(`Failed to update milestone skills: ${error.message}`);
  revalidatePath(`/admin/tracks/${trackId}`);
  revalidatePath("/employee");
  revalidatePath("/employee/onboarding");
}

export async function updateTaskSkillContributions(trackId: string, milestoneId: string, taskId: string, formData: FormData) {
  const { profile } = await requireRole("ADMIN");
  await assertTrackWorkspace(trackId, profile.workspace_id);
  await assertMilestoneTrack(milestoneId, trackId);
  await assertTaskMilestone(taskId, milestoneId);
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ skill_contributions: normalizeSkillContributions(jsonField(formData, "skill_contributions")) }).eq("id", taskId).eq("milestone_id", milestoneId);
  if (error) throw new Error(`Failed to update task skill contributions: ${error.message}`);
  revalidatePath(`/admin/tracks/${trackId}`);
  revalidatePath("/employee");
  revalidatePath("/employee/onboarding");
}

export async function createTrack(formData: FormData) {
  const { user, profile } = await requireRole("ADMIN");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("onboarding_tracks")
    .insert({
      workspace_id: profile.workspace_id,
      title: requiredText(formData, "title"),
      description: optionalText(formData, "description"),
      duration_days: positiveInt(formData, "duration_days", 30),
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create onboarding track.");
  }

  revalidatePath("/admin/tracks");
  redirect(`/admin/tracks/${data.id}`);
}

export async function updateTrack(trackId: string, formData: FormData) {
  const { profile } = await requireRole("ADMIN");
  await assertTrackWorkspace(trackId, profile.workspace_id);

  const supabase = await createClient();
  const { error } = await supabase
    .from("onboarding_tracks")
    .update({
      title: requiredText(formData, "title"),
      description: optionalText(formData, "description"),
      duration_days: positiveInt(formData, "duration_days", 30),
    })
    .eq("id", trackId)
    .eq("workspace_id", profile.workspace_id);

  if (error) {
    throw new Error(`Failed to update onboarding track: ${error.message}`);
  }

  revalidatePath(`/admin/tracks/${trackId}`);
  revalidatePath("/admin/tracks");
}

export async function createMilestone(trackId: string, formData: FormData) {
  const { profile } = await requireRole("ADMIN");
  await assertTrackWorkspace(trackId, profile.workspace_id);

  const supabase = await createClient();
  const { error } = await supabase.from("milestones").insert({
    track_id: trackId,
    title: requiredText(formData, "title"),
    description: optionalText(formData, "description"),
    position: positiveInt(formData, "position", 1),
  });

  if (error) {
    throw new Error(`Failed to create milestone: ${error.message}`);
  }

  revalidatePath(`/admin/tracks/${trackId}`);
}

export async function createTask(trackId: string, milestoneId: string, formData: FormData) {
  const { profile } = await requireRole("ADMIN");
  await assertTrackWorkspace(trackId, profile.workspace_id);
  await assertMilestoneTrack(milestoneId, trackId);

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    milestone_id: milestoneId,
    title: requiredText(formData, "title"),
    description: optionalText(formData, "description"),
    position: positiveInt(formData, "position", 1),
  });

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  revalidatePath(`/admin/tracks/${trackId}`);
}
