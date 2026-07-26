import type { Metadata } from "next";
import { AvatarV5WardrobeLab } from "@/components/avatar-v5-wardrobe-lab/avatar-v5-wardrobe-lab";

export const metadata: Metadata = {
  title: "Avatar V5 wardrobe laboratory | EXP",
  description:
    "Isolated CC0 hair and wardrobe compatibility review for Avatar V5.",
};

export default function AvatarV5WardrobeDevPage() {
  return <AvatarV5WardrobeLab />;
}
