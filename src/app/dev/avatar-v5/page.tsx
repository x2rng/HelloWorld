import type { Metadata } from "next";
import { AvatarV5Proof } from "@/components/avatar-v5/avatar-v5-proof";

export const metadata: Metadata = {
  title: "Avatar V5 visual proof | EXP",
  description:
    "Isolated comparison of the current procedural avatar and an imported CC0 asset candidate.",
};

export default function AvatarV5DevPage() {
  return <AvatarV5Proof />;
}

