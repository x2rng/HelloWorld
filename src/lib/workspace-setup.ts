import { roleSkillTemplates } from "@/lib/skills";

export const industryOptions = [
  "Technology", "Marketing / Agency", "Retail", "Healthcare", "Finance",
  "Education", "Manufacturing", "Hospitality", "Sports / Entertainment",
  "Professional Services", "Other",
] as const;

export const companySizeOptions = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1000+"] as const;

export const defaultDepartments = [
  "Marketing", "Sales", "Product", "Design", "Engineering", "Operations",
  "Customer Success", "HR / People", "Finance", "Management",
] as const;

export const rolesByDepartment: Record<string, string[]> = {
  Marketing: ["Social Media Marketing", "Content Marketing", "Performance Marketing", "Marketing Manager"],
  Sales: ["Sales Representative", "Account Executive", "Sales Manager"],
  Product: ["Product Manager", "Product Analyst"],
  Design: ["UI/UX Designer", "Product Designer", "Graphic Designer"],
  Engineering: ["Frontend Developer", "Backend Developer", "Full-Stack Developer", "QA Engineer"],
  Operations: ["Operations Coordinator", "Operations Manager", "Process Specialist"],
  "Customer Success": ["Customer Success Manager", "Onboarding Specialist", "Support Specialist"],
  "HR / People": ["People Operations", "Recruiter", "HR Manager"],
  Finance: ["Finance Specialist", "Financial Analyst"],
  Management: ["Team Lead", "Department Manager"],
};

const skillsByRole: Record<string, readonly string[]> = {
  "Social Media Marketing": roleSkillTemplates.SOCIAL_MEDIA_MARKETING,
  "Content Marketing": roleSkillTemplates.MARKETING,
  "Performance Marketing": roleSkillTemplates.MARKETING,
  "Marketing Manager": roleSkillTemplates.MARKETING,
  "UI/UX Designer": roleSkillTemplates.UI_UX_DESIGNER,
  "Product Designer": roleSkillTemplates.UI_UX_DESIGNER,
  "Frontend Developer": roleSkillTemplates.FRONTEND_DEVELOPER,
  "Backend Developer": roleSkillTemplates.BACKEND_DEVELOPER,
  "Full-Stack Developer": roleSkillTemplates.FULL_STACK_DEVELOPER,
  "Sales Representative": roleSkillTemplates.SALES,
  "Account Executive": roleSkillTemplates.SALES,
  "Sales Manager": roleSkillTemplates.SALES,
  "Customer Success Manager": roleSkillTemplates.CUSTOMER_SUCCESS,
  "Onboarding Specialist": roleSkillTemplates.CUSTOMER_SUCCESS,
  "Operations Coordinator": roleSkillTemplates.OPERATIONS,
  "Operations Manager": roleSkillTemplates.OPERATIONS,
  "Process Specialist": roleSkillTemplates.OPERATIONS,
};

export type WorkspaceSetupProfile = {
  departments: string[];
  roles: string[];
  skills: string[];
};

function normalizeList(value: unknown, limit: number) {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, string>();
  for (const item of value) {
    if (typeof item !== "string") continue;
    const normalized = item.trim().replace(/\s+/g, " ").slice(0, 60);
    if (normalized) unique.set(normalized.toLowerCase(), normalized);
  }
  return [...unique.values()].slice(0, limit);
}

export function normalizeWorkspaceSetupProfile(value: unknown): WorkspaceSetupProfile {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    departments: normalizeList(record.departments, 30),
    roles: normalizeList(record.roles, 40),
    skills: normalizeList(record.skills, 80),
  };
}

export function getSuggestedRoles(departments: string[]) {
  return normalizeList(departments.flatMap((department) => rolesByDepartment[department] ?? []), 40);
}

export function getSuggestedSkills(roles: string[]) {
  return normalizeList(roles.flatMap((role) => skillsByRole[role] ?? []), 80);
}
