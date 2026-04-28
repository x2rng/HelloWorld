import type {
  FocusArea,
  HealthFocus,
  IdentityStage,
  MotivationStyle,
  PersonalPriority,
  WeeklyCommitment,
} from "@/lib/types";

export const identityStages: IdentityStage[] = [
  "Student",
  "Professional",
  "Freelancer",
  "Job Seeker",
  "Creator",
  "Entrepreneur",
  "Other",
];

export const focusAreaOptions: FocusArea[] = [
  "Career growth",
  "Learning new skills",
  "Fitness and health",
  "Better habits",
  "Creativity / hobbies",
  "Confidence / discipline",
];

export const skillOptions = [
  "Marketing",
  "Design",
  "Writing",
  "Public Speaking",
  "Project Management",
  "Leadership",
  "Coding",
  "Data Analysis",
  "Sales",
  "Communication",
  "Finance",
  "Operations",
  "Product Thinking",
  "Other",
];

export const personalPriorityOptions: PersonalPriority[] = [
  "Discipline",
  "Consistency",
  "Confidence",
  "Focus",
  "Time Management",
  "Emotional Control",
  "Communication",
  "Resilience",
  "Creativity",
];

export const healthFocusOptions: HealthFocus[] = [
  "Strength",
  "General fitness",
  "Weight management",
  "Mobility",
  "Consistency",
  "Sports performance",
];

export const hobbyOptions = [
  "Fitness",
  "Gaming",
  "Reading",
  "Music",
  "Travel",
  "Photography",
  "Sports",
  "Fashion",
  "Tech",
  "Art",
  "Cooking",
  "Content creation",
  "Other",
];

export const motivationOptions: MotivationStyle[] = [
  "Visible progress",
  "Unlocking rewards",
  "Streaks",
  "Competing with others",
  "Personal goals",
  "Completing milestones",
];

export const weeklyCommitmentOptions: WeeklyCommitment[] = [
  "1-2 hours",
  "3-5 hours",
  "5-8 hours",
  "8+ hours",
];

export const avatarOptions = {
  skinTone: [
    { value: "porcelain", label: "Porcelain" },
    { value: "warm", label: "Warm" },
    { value: "olive", label: "Olive" },
    { value: "bronze", label: "Bronze" },
    { value: "deep", label: "Deep" },
  ],
  hairStyle: [
    { value: "short", label: "Short crop" },
    { value: "wave", label: "Soft wave" },
    { value: "buzz", label: "Buzz" },
    { value: "bun", label: "Bun" },
    { value: "curtain", label: "Curtain" },
  ],
  hairColor: [
    { value: "ink", label: "Ink black" },
    { value: "brown", label: "Walnut" },
    { value: "sand", label: "Sand" },
    { value: "silver", label: "Silver" },
    { value: "blueblack", label: "Blue black" },
  ],
  eyeColor: [
    { value: "graphite", label: "Graphite" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "amber", label: "Amber" },
  ],
  top: [
    { value: "tee", label: "Starter tee" },
    { value: "sweater", label: "Clean sweater" },
    { value: "jacket", label: "Structured jacket" },
    { value: "hoodie", label: "Soft hoodie" },
  ],
  bottom: [
    { value: "relaxed", label: "Relaxed pants" },
    { value: "tailored", label: "Tailored pants" },
    { value: "sport", label: "Sport fit" },
  ],
  accessory: [
    { value: "none", label: "None" },
    { value: "glasses", label: "Frames" },
    { value: "band", label: "Headband" },
    { value: "earring", label: "Stud" },
  ],
};
