"use client";

import { useEffect, useMemo, useState } from "react";
import type { StoredAvatarConfig } from "@/components/avatar-3d/config/avatar-v4-parser";
import { FloatingPlayerCompanion } from "@/components/player-companion/floating-player-companion";
import { PlayerCompanionDrawer } from "@/components/player-companion/player-companion-drawer";
import { createPlayerCompanionFromStored } from "@/components/player-companion/config/player-companion-parser";
import type {
  CompanionPlayerSummary,
  CompanionSkillGroup,
} from "@/components/player-companion/player-companion-progress";
import type { AvatarStage } from "@/lib/avatar-stage";
import type { DerivedSkillGroup, RoleFocus } from "@/lib/skills";
import { getRoleFocusLabel } from "@/lib/skills";

type OverallProgress = {
  level: number;
  totalXp: number;
  nextLevel: number | null;
  xpToNextLevel: number;
  progress: number;
};

export type EmployeeCompanionData = {
  employeeName: string;
  roleFocus: RoleFocus;
  avatarConfig: StoredAvatarConfig;
  stage: AvatarStage;
  overall: OverallProgress;
  groups: DerivedSkillGroup[];
};

function companionGroupName(
  name: DerivedSkillGroup["name"],
): CompanionSkillGroup["name"] {
  if (name === "Core Skills") return "Core skills";
  if (name === "Role Skills") return "Role skills";
  return "Personal growth skills";
}

export function EmployeePlayerCompanion({
  data,
}: {
  data: EmployeeCompanionData;
}) {
  const [open, setOpen] = useState(false);
  const config = useMemo(
    () => createPlayerCompanionFromStored(data.avatarConfig),
    [data.avatarConfig],
  );
  const player = useMemo<CompanionPlayerSummary>(
    () => ({
      employeeName: data.employeeName,
      role: getRoleFocusLabel(data.roleFocus),
      level: data.overall.level,
      totalXp: data.overall.totalXp,
      xpToNextLevel: data.overall.nextLevel
        ? data.overall.xpToNextLevel
        : null,
      levelProgress: data.overall.progress,
      stage: data.stage.name,
    }),
    [data],
  );
  const groups = useMemo<CompanionSkillGroup[]>(
    () =>
      data.groups.map((group) => ({
        name: companionGroupName(group.name),
        skills: group.skills.map((skill) => ({
          name: skill.name,
          icon: skill.icon,
          level: skill.level,
          progress: skill.progress,
          source:
            skill.xp > 0
              ? `${skill.xp} XP from completed EXP steps`
              : undefined,
        })),
      })),
    [data.groups],
  );

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <FloatingPlayerCompanion
        config={config}
        level={data.overall.level}
        open={open}
        onClick={() => setOpen(true)}
      />
      <PlayerCompanionDrawer
        open={open}
        onClose={() => setOpen(false)}
        config={config}
        player={player}
        groups={groups}
      />
    </>
  );
}
