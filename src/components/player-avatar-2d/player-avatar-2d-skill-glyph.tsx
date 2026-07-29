import type { SkillIcon } from "@/lib/skills";

export function PlayerAvatar2DSkillGlyph({ icon }: { icon: SkillIcon }) {
  if (icon === "people") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.5-3.5 2.3-5.3 5.5-5.3s5 1.8 5.5 5.3M15 6.3a3 3 0 0 1 0 5.7M16 14c2.7.3 4.2 2 4.5 5" />
      </svg>
    );
  }

  if (icon === "book") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" />
      </svg>
    );
  }

  if (icon === "tool") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M14.5 6.5a4.5 4.5 0 0 0-6 5.9L3 18l3 3 5.6-5.5a4.5 4.5 0 0 0 5.9-6l-3 3-3-3 3-3Z" />
      </svg>
    );
  }

  if (icon === "spark") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="m12 2 1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M22 12h-3M12 22v-3M2 12h3" />
    </svg>
  );
}
