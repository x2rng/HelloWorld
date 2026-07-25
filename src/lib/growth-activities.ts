export const activityCategoryOptions = [
  { value: "ROLE_SKILL_PRACTICE", label: "Role Skill Practice" },
  { value: "LEARNING", label: "Learning" },
  { value: "COLLABORATION", label: "Collaboration" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "FOCUS", label: "Focus" },
  { value: "ENERGY", label: "Energy" },
  { value: "WELLBEING", label: "Wellbeing" },
  { value: "DISCIPLINE", label: "Discipline" },
  { value: "COMPANY_CONTRIBUTION", label: "Company Contribution" },
] as const;

export const activityProofTypeOptions = [
  { value: "TEXT_NOTE", label: "Text note" },
  { value: "IMAGE_LINK_REFERENCE", label: "Image/link reference" },
  { value: "EXTERNAL_APP_SCREENSHOT", label: "External app screenshot" },
  { value: "COMPLETED_EXP_STEP", label: "Completed EXP step" },
  { value: "OTHER", label: "Other" },
] as const;

export const activityVisibilityOptions = [
  { value: "PRIVATE", label: "Private" },
  { value: "DEPARTMENT", label: "Department" },
  { value: "COMPANY", label: "Company" },
] as const;

export type ActivityCategory = (typeof activityCategoryOptions)[number]["value"];
export type ActivityProofType = (typeof activityProofTypeOptions)[number]["value"];
export type ActivityVisibility = (typeof activityVisibilityOptions)[number]["value"];
export type GrowthActivityStatus = "pending" | "approved" | "rejected";

export function optionLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function safeProofUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
