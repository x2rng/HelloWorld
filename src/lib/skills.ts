import type { JourneyMilestone } from "@/lib/employee-journey";
import { normalizeSkillContributions, normalizeSkillFocus } from "@/lib/skill-attribution";

export const roleTemplateOptions = [
  { value: "GENERAL_EMPLOYEE", label: "General Employee" },
  { value: "SOCIAL_MEDIA_MARKETING", label: "Social Media Marketing" },
  { value: "MARKETING", label: "Marketing" },
  { value: "UI_UX_DESIGNER", label: "UI/UX Designer" },
  { value: "FRONTEND_DEVELOPER", label: "Frontend Developer" },
  { value: "BACKEND_DEVELOPER", label: "Backend Developer" },
  { value: "FULL_STACK_DEVELOPER", label: "Full-Stack Developer" },
  { value: "SALES", label: "Sales" },
  { value: "PROJECT_MANAGER", label: "Project Manager" },
  { value: "CUSTOMER_SUCCESS", label: "Customer Success" },
  { value: "OPERATIONS", label: "Operations" },
] as const;

export type RoleFocus = (typeof roleTemplateOptions)[number]["value"];
export type SkillGroupName = "Core Skills" | "Role Skills" | "Personal Growth";
export type SkillIcon = "people" | "target" | "book" | "tool" | "spark";

type SkillDefinition = {
  name: string;
  keywords: string[];
  icon: SkillIcon;
};

export type DerivedSkill = {
  name: string;
  icon: SkillIcon;
  xp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  nextLevel: number;
  totalXpForNextLevel: number;
  progress: number;
};

export type DerivedSkillGroup = {
  name: SkillGroupName;
  skills: DerivedSkill[];
};

const coreSkills: SkillDefinition[] = [
  { name: "Consistency", keywords: ["routine", "repeat", "regular", "consistent"], icon: "target" },
  { name: "Communication", keywords: ["communicat", "manager", "meeting", "present", "feedback"], icon: "people" },
  { name: "Collaboration", keywords: ["team", "collaborat", "partner", "stakeholder", "together"], icon: "people" },
  { name: "Task Completion", keywords: ["complete", "finish", "submit", "deliver"], icon: "target" },
  { name: "Timeliness", keywords: ["deadline", "due", "on time", "schedule", "timely"], icon: "target" },
  { name: "Learning Agility", keywords: ["learn", "training", "understand", "explore", "practice"], icon: "book" },
  { name: "Company Knowledge", keywords: ["company", "overview", "values", "mission", "organization"], icon: "book" },
  { name: "Tools & Systems", keywords: ["tool", "system", "account", "software", "platform", "setup"], icon: "tool" },
  { name: "Culture & Ways of Working", keywords: ["culture", "ways of working", "values", "policy", "process"], icon: "people" },
];

const personalSkills: SkillDefinition[] = [
  { name: "Focus", keywords: ["focus", "priority", "concentrat"], icon: "target" },
  { name: "Discipline", keywords: ["discipline", "routine", "deadline", "follow-through"], icon: "target" },
  { name: "Adaptability", keywords: ["adapt", "change", "new", "flexib"], icon: "spark" },
  { name: "Confidence", keywords: ["present", "share", "feedback", "lead", "own"], icon: "spark" },
  { name: "Energy", keywords: ["engage", "participat", "connect", "contribute"], icon: "spark" },
];

export const roleSkillTemplates: Record<RoleFocus, readonly string[]> = {
  GENERAL_EMPLOYEE: ["Communication", "Collaboration", "Learning Agility", "Company Knowledge", "Tools & Systems", "Role Readiness", "Task Completion", "Timeliness"],
  SOCIAL_MEDIA_MARKETING: ["Instagram", "TikTok", "LinkedIn", "Facebook", "YouTube", "Content Planning", "Copywriting", "Community Management", "Campaign Analytics", "Scheduling Tools", "Brand Voice"],
  MARKETING: ["Content Strategy", "Campaign Planning", "SEO", "Analytics", "Positioning", "Copywriting", "Lead Generation", "Brand Communication"],
  UI_UX_DESIGNER: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing", "Visual Hierarchy", "Figma Fluency", "UX Writing"],
  FRONTEND_DEVELOPER: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Git", "UI Implementation", "API Integration", "Debugging"],
  BACKEND_DEVELOPER: ["API Design", "Database Design", "PostgreSQL", "Supabase", "Authentication", "Server Logic", "Security Basics", "Debugging", "Performance"],
  FULL_STACK_DEVELOPER: ["Frontend Development", "Backend Development", "TypeScript", "React", "Next.js", "PostgreSQL", "Supabase", "API Integration", "Git Workflow", "Debugging"],
  SALES: ["Prospecting", "Discovery", "Relationship Building", "Objection Handling", "Pipeline Discipline", "Follow-up Quality", "Product Knowledge"],
  PROJECT_MANAGER: ["Planning", "Prioritization", "Stakeholder Communication", "Risk Management", "Delivery Coordination", "Documentation", "Follow-up Quality"],
  CUSTOMER_SUCCESS: ["Customer Understanding", "Product Knowledge", "Relationship Building", "Issue Resolution", "Communication", "Onboarding Support", "Retention Thinking"],
  OPERATIONS: ["Process Thinking", "Documentation", "Coordination", "Tool Fluency", "Problem Solving", "Quality Control", "Follow-through"],
};

export const skillSuggestions = [...new Set([
  ...coreSkills.map((skill) => skill.name),
  ...Object.values(roleSkillTemplates).flat(),
  "Role Readiness",
  "Code Quality",
])].sort((left, right) => left.localeCompare(right));

const extraSkillKeywords: Record<string, string[]> = {
  Instagram: ["instagram", "social", "reel"],
  TikTok: ["tiktok", "short-form", "video"],
  LinkedIn: ["linkedin", "professional network"],
  Facebook: ["facebook", "meta"],
  YouTube: ["youtube", "video", "channel"],
  "Content Planning": ["content", "calendar", "plan"],
  "Community Management": ["community", "comment", "engagement"],
  "Campaign Analytics": ["campaign", "analytics", "metric"],
  "Scheduling Tools": ["schedule", "publishing", "tool"],
  "Brand Voice": ["brand", "voice", "tone"],
  "User Research": ["user", "research", "interview", "insight"],
  Wireframing: ["wireframe", "flow", "layout"],
  Prototyping: ["prototype", "interaction"],
  "Design Systems": ["design system", "component", "token"],
  "Usability Testing": ["usability", "test", "feedback"],
  "Visual Hierarchy": ["visual", "hierarchy", "layout", "typography"],
  "Figma Fluency": ["figma", "design file"],
  "UX Writing": ["ux writing", "microcopy", "copy"],
  "Code Quality": ["code", "review", "quality", "refactor"],
  Debugging: ["debug", "bug", "error", "issue"],
  Architecture: ["architecture", "technical design", "system design"],
  "Git Workflow": ["git", "branch", "commit", "pull request"],
  "Frontend Development": ["frontend", "interface", "react", "css"],
  "Backend Development": ["backend", "api", "database", "server"],
  "Problem Solving": ["problem", "solve", "solution", "investigat"],
  Delivery: ["deliver", "ship", "release", "complete"],
  "Content Strategy": ["content", "editorial", "audience"],
  "Campaign Planning": ["campaign", "channel", "plan"],
  Analytics: ["analytics", "metric", "report", "data"],
  Positioning: ["position", "message", "market"],
  SEO: ["seo", "search", "keyword"],
  Copywriting: ["copy", "headline", "write"],
  "Lead Generation": ["lead", "demand", "conversion"],
  "Brand Communication": ["brand", "voice", "communication"],
  Prospecting: ["prospect", "outreach", "lead"],
  Discovery: ["discovery", "needs", "qualify"],
  "Relationship Building": ["relationship", "rapport", "customer"],
  "Objection Handling": ["objection", "concern", "negotiate"],
  "Pipeline Discipline": ["pipeline", "crm", "forecast"],
  "Follow-up Quality": ["follow-up", "follow up", "next step"],
  "Product Knowledge": ["product", "feature", "solution"],
  Planning: ["plan", "roadmap", "schedule"],
  Prioritization: ["priority", "priorit", "scope"],
  "Stakeholder Communication": ["stakeholder", "status", "communicat"],
  "Risk Management": ["risk", "blocker", "mitigat"],
  "Delivery Coordination": ["coordinate", "delivery", "dependency"],
  Documentation: ["document", "guide", "notes", "process"],
  "Customer Understanding": ["customer", "need", "context"],
  "Issue Resolution": ["issue", "resolve", "support", "problem"],
  Communication: ["communicat", "meeting", "feedback"],
  "Onboarding Support": ["onboarding", "adoption", "enable"],
  "Retention Thinking": ["retention", "renewal", "value", "health"],
  "Process Thinking": ["process", "workflow", "improve"],
  Coordination: ["coordinat", "handoff", "schedule"],
  "Tool Fluency": ["tool", "system", "platform", "software"],
  "Quality Control": ["quality", "check", "audit", "standard"],
  "Follow-through": ["follow-through", "follow through", "complete", "own"],
  Collaboration: ["team", "collaborat", "partner"],
  "Learning Agility": ["learn", "training", "understand"],
  "Company Knowledge": ["company", "values", "mission"],
  "Tools & Systems": ["tool", "system", "account", "process"],
  "Role Readiness": ["role", "responsibil", "expectation", "ready"],
  "Task Completion": ["complete", "finish", "submit", "deliver"],
  Timeliness: ["deadline", "due", "on time", "schedule"],
  "HTML/CSS": ["html", "css", "style", "layout"],
  JavaScript: ["javascript", "script"],
  TypeScript: ["typescript", "type"],
  React: ["react", "component", "hook"],
  "Next.js": ["next.js", "nextjs", "route"],
  Tailwind: ["tailwind", "css", "style"],
  Git: ["git", "branch", "commit"],
  "UI Implementation": ["ui", "interface", "implement"],
  "API Integration": ["api", "integrat", "endpoint"],
  "API Design": ["api", "endpoint", "contract"],
  "Database Design": ["database", "schema", "table"],
  PostgreSQL: ["postgres", "sql", "database"],
  Supabase: ["supabase", "database", "auth"],
  Authentication: ["auth", "login", "session"],
  "Server Logic": ["server", "backend", "function"],
  "Security Basics": ["security", "permission", "policy"],
  Performance: ["performance", "optimiz", "speed"],
};

export function isRoleFocus(value: unknown): value is RoleFocus {
  return roleTemplateOptions.some((option) => option.value === value);
}

export function normalizeRoleFocus(value: unknown): RoleFocus {
  return isRoleFocus(value) ? value : "GENERAL_EMPLOYEE";
}

export function getRoleFocusLabel(roleFocus: RoleFocus) {
  return roleTemplateOptions.find((option) => option.value === roleFocus)?.label ?? "General Employee";
}

export function normalizeAssignedSkills(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, string>();
  for (const item of value) {
    if (typeof item !== "string") continue;
    const name = item.trim().replace(/\s+/g, " ").slice(0, 60);
    if (name) unique.set(name.toLowerCase(), name);
  }
  return [...unique.values()].slice(0, 30);
}

export function hasAssignedRoleSkills(
  roleFocusValue: unknown,
  assignedSkillsValue: unknown,
) {
  return isRoleFocus(roleFocusValue) && normalizeAssignedSkills(assignedSkillsValue).length > 0;
}

export function getRoleTemplateSkills(roleFocusValue: unknown) {
  return [...roleSkillTemplates[normalizeRoleFocus(roleFocusValue)]];
}

function xpNeededForSkillLevel(level: number) {
  return Math.round(42 + 18 * level + 7 * Math.pow(level, 1.32));
}

export function getSkillLevelInfo(skillXp: number) {
  const totalXp = Math.max(0, Math.floor(skillXp));
  let level = 1;
  let currentLevelXp = totalXp;
  let completedLevelXp = 0;
  let nextLevelXp = xpNeededForSkillLevel(level);

  while (currentLevelXp >= nextLevelXp) {
    currentLevelXp -= nextLevelXp;
    completedLevelXp += nextLevelXp;
    level += 1;
    nextLevelXp = xpNeededForSkillLevel(level);
  }

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    nextLevel: level + 1,
    totalXpForNextLevel: completedLevelXp + nextLevelXp,
    progress: Math.round((currentLevelXp / nextLevelXp) * 100),
  };
}

function hasKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function deriveGroup(definitions: SkillDefinition[], xpBySkill: Map<string, number>): DerivedSkill[] {
  return definitions.map((skill) => ({
    ...skill,
    xp: xpBySkill.get(skill.name) ?? 0,
    ...getSkillLevelInfo(xpBySkill.get(skill.name) ?? 0),
  }));
}

export function deriveSkillGroups(
  milestones: JourneyMilestone[],
  roleFocusValue: unknown,
  assignedSkillsValue?: unknown,
): DerivedSkillGroup[] {
  const roleFocus = normalizeRoleFocus(roleFocusValue);
  const assignedSkills = normalizeAssignedSkills(assignedSkillsValue);
  const baseRoleSkills = assignedSkills.length > 0 ? assignedSkills : getRoleTemplateSkills(roleFocus);
  const coreNameByKey = new Map(coreSkills.map((skill) => [skill.name.toLowerCase(), skill.name]));
  const personalNameByKey = new Map(personalSkills.map((skill) => [skill.name.toLowerCase(), skill.name]));
  const explicitRoleSkills = milestones.flatMap((item) => item.tasks)
    .filter((task) => task.progress?.status === "COMPLETED")
    .flatMap((task) => normalizeSkillContributions(task.skill_contributions).map((item) => item.skill))
    .filter((name) => !coreNameByKey.has(name.toLowerCase()) && !personalNameByKey.has(name.toLowerCase()));
  const selectedRoleSkills = normalizeSkillFocus([...explicitRoleSkills, ...baseRoleSkills]);
  const roleSkills: SkillDefinition[] = selectedRoleSkills.map((name) => ({
    name,
    keywords: extraSkillKeywords[name] ?? [name.toLowerCase()],
    icon: name.includes("Communication") || name.includes("Relationship") || name === "Collaboration" ? "people" : name.includes("Tool") || name.includes("Code") || name.includes("Figma") || name.includes("Git") ? "tool" : name.includes("Knowledge") || name.includes("Research") || name.includes("Documentation") ? "book" : "spark",
  }));
  const coreXp = new Map<string, number>();
  const roleXp = new Map<string, number>();
  const personalXp = new Map<string, number>();
  const add = (map: Map<string, number>, name: string, xp: number) => map.set(name, (map.get(name) ?? 0) + xp);

  for (const item of milestones) {
    for (const task of item.tasks) {
      if (task.progress?.status !== "COMPLETED") continue;
      const explicitContributions = normalizeSkillContributions(task.skill_contributions);
      if (explicitContributions.length > 0) {
        for (const contribution of explicitContributions) {
          const key = contribution.skill.toLowerCase();
          const coreName = coreNameByKey.get(key);
          const personalName = personalNameByKey.get(key);
          if (coreName) add(coreXp, coreName, contribution.xp);
          else if (personalName) add(personalXp, personalName, contribution.xp);
          else add(roleXp, contribution.skill, contribution.xp);
        }
        continue;
      }
      const text = `${item.milestone.title} ${item.milestone.description ?? ""} ${task.title} ${task.description ?? ""}`.toLowerCase();
      add(coreXp, "Task Completion", 10);
      add(coreXp, "Consistency", 6);
      add(personalXp, "Focus", 4);
      add(personalXp, "Discipline", 5);
      add(personalXp, "Confidence", 3);
      add(personalXp, "Energy", 2);

      let matchedCore = false;
      for (const skill of coreSkills) {
        if (skill.name !== "Task Completion" && skill.name !== "Consistency" && hasKeyword(text, skill.keywords)) {
          add(coreXp, skill.name, 10);
          matchedCore = true;
        }
      }
      for (const skill of personalSkills) {
        if (!["Focus", "Discipline", "Confidence", "Energy"].includes(skill.name) && hasKeyword(text, skill.keywords)) add(personalXp, skill.name, 8);
      }

      let matchedRole = false;
      for (const skill of roleSkills) {
        if (hasKeyword(text, skill.keywords)) {
          add(roleXp, skill.name, 10);
          matchedRole = true;
        }
      }
      if (!matchedCore) add(coreXp, "Learning Agility", 5);
      if (!matchedRole) add(roleXp, roleSkills.find((skill) => skill.name === "Role Readiness")?.name ?? roleSkills[0].name, 5);
    }
  }

  return [
    { name: "Core Skills", skills: deriveGroup(coreSkills, coreXp) },
    { name: "Role Skills", skills: deriveGroup(roleSkills, roleXp) },
    { name: "Personal Growth", skills: deriveGroup(personalSkills, personalXp) },
  ];
}
