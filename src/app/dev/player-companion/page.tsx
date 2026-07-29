import type { Metadata } from "next";
import { PlayerCompanionLab } from "@/components/player-companion/player-companion-lab";

export const metadata: Metadata = {
  title: "Player Companion review | EXP",
  description:
    "Review lab for the integrated EXP stylized 3D Player Companion.",
};

export default function PlayerCompanionDevPage() {
  return <PlayerCompanionLab />;
}
