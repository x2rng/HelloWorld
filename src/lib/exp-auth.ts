import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { AppRole, ProfileRecord } from "@/lib/exp-types";
import { createClient } from "@/lib/supabase/server";

type AuthenticatedAppContext = {
  user: User;
  profile: ProfileRecord;
};

function isMissingAuthSessionError(error: { message?: string; name?: string }) {
  return (
    error.name === "AuthSessionMissingError" ||
    error.message?.toLowerCase().includes("auth session missing")
  );
}

function normalizeRole(value: unknown): AppRole {
  if (value === "ADMIN" || value === "EMPLOYEE") {
    return value;
  }

  throw new Error(
    "Account bootstrap requires explicit ADMIN or EMPLOYEE role metadata.",
  );
}

async function fetchProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, workspace_id, role, full_name, email, created_at, updated_at, workspace:workspaces(id, name)")
    .eq("id", userId)
    .maybeSingle<ProfileRecord>();

  if (error) {
    throw new Error(`Failed to load profile: ${error.message}`);
  }

  return data;
}

async function createAdminWorkspaceAndProfile(user: User) {
  const supabase = await createClient();
  const workspaceId = crypto.randomUUID();
  const fullName =
    typeof user.user_metadata.full_name === "string" &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : user.email?.split("@")[0] ?? "Workspace admin";
  const workspaceName =
    typeof user.user_metadata.workspace_name === "string" &&
    user.user_metadata.workspace_name.trim()
      ? user.user_metadata.workspace_name.trim()
      : `${fullName}'s Workspace`;

  const { error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      id: workspaceId,
      name: workspaceName,
      created_by: user.id,
    });

  if (workspaceError) {
    throw new Error(
      workspaceError.message ?? "Failed to create workspace for admin bootstrap.",
    );
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    workspace_id: workspaceId,
    role: "ADMIN",
    full_name: fullName,
    email: user.email ?? "",
  });

  if (profileError) {
    throw new Error(
      profileError.message ?? "Failed to create profile for admin bootstrap.",
    );
  }
}

async function createEmployeeProfile(user: User) {
  const supabase = await createClient();
  const workspaceId =
    typeof user.user_metadata.workspace_id === "string"
      ? user.user_metadata.workspace_id
      : null;

  if (!workspaceId) {
    throw new Error(
      "Employee bootstrap requires workspace metadata or an invite acceptance flow.",
    );
  }

  const fullName =
    typeof user.user_metadata.full_name === "string" &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : user.email?.split("@")[0] ?? "Employee";

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    workspace_id: workspaceId,
    role: "EMPLOYEE",
    full_name: fullName,
    email: user.email ?? "",
  });

  if (error) {
    throw new Error(error.message ?? "Failed to create employee profile.");
  }
}

export async function getAuthenticatedAppContext(): Promise<AuthenticatedAppContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (isMissingAuthSessionError(error)) {
      return null;
    }

    throw new Error(`Failed to load auth user: ${error.message}`);
  }

  if (!user) {
    return null;
  }

  let profile = await fetchProfile(user.id);

  if (!profile) {
    const role = normalizeRole(user.user_metadata.role);

    if (role === "ADMIN") {
      await createAdminWorkspaceAndProfile(user);
    } else {
      await createEmployeeProfile(user);
    }

    profile = await fetchProfile(user.id);
  }

  if (!profile) {
    throw new Error("Authenticated user has no bootstrap profile.");
  }

  return {
    user,
    profile,
  };
}

export async function redirectIfAuthenticated() {
  const context = await getAuthenticatedAppContext();

  if (!context) return;

  redirect(context.profile.role === "ADMIN" ? "/admin" : "/employee");
}

export async function requireRole(role: AppRole) {
  const context = await getAuthenticatedAppContext();

  if (!context) {
    redirect("/login");
  }

  if (context.profile.role !== role) {
    redirect(context.profile.role === "ADMIN" ? "/admin" : "/employee");
  }

  return context;
}
