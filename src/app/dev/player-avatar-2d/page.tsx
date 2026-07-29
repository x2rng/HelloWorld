import type { Metadata } from "next";
import { PlayerAvatar2DLab } from "@/components/player-avatar-2d/player-avatar-2d-lab";

export const metadata: Metadata = {
  title: "2D Player Avatar proof | EXP",
  description:
    "Isolated visual proof for the layered EXP 2D animated Player Avatar.",
};

export default function PlayerAvatar2DDevPage() {
  return <PlayerAvatar2DLab />;
}
