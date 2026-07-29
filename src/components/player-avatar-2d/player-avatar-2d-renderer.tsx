"use client";

import { useId } from "react";
import { usePlayerAvatar2DAnimation } from "./animation/use-player-avatar-2d-animation";
import { defaultPlayerAvatar2DProof } from "./config/player-avatar-2d-defaults";
import type {
  PlayerAvatar2DProofConfig,
  PlayerAvatar2DState,
} from "./config/player-avatar-2d-types";
import { Avatar2DBody } from "./parts/avatar-2d-body";
import { Avatar2DEars } from "./parts/avatar-2d-ears";
import { Avatar2DEffects } from "./parts/avatar-2d-effects";
import { Avatar2DFace } from "./parts/avatar-2d-face";
import { Avatar2DFrontHair } from "./parts/avatar-2d-front-hair";
import { Avatar2DHead } from "./parts/avatar-2d-head";
import { Avatar2DLegs } from "./parts/avatar-2d-legs";
import { Avatar2DNeck } from "./parts/avatar-2d-neck";
import { Avatar2DOutfit } from "./parts/avatar-2d-outfit";
import { Avatar2DRearHair } from "./parts/avatar-2d-rear-hair";
import { Avatar2DShadow } from "./parts/avatar-2d-shadow";
import { Avatar2DShoes } from "./parts/avatar-2d-shoes";
import styles from "./player-avatar-2d.module.css";
import { cx } from "@/lib/utils";

type PlayerAvatar2DRendererProps = {
  config?: PlayerAvatar2DProofConfig;
  state?: PlayerAvatar2DState;
  className?: string;
  compact?: boolean;
  label?: string;
};

export function PlayerAvatar2DRenderer({
  config = defaultPlayerAvatar2DProof,
  state: requestedState = "idle",
  className,
  compact = false,
  label = "EXP 2D Player Avatar",
}: PlayerAvatar2DRendererProps) {
  const uniqueId = useId().replaceAll(":", "");
  const { blinking, state } =
    usePlayerAvatar2DAnimation(requestedState);
  const ids = {
    skin: `${uniqueId}-skin`,
    skinShade: `${uniqueId}-skin-shade`,
    hair: `${uniqueId}-hair`,
    jacket: `${uniqueId}-jacket`,
    trousers: `${uniqueId}-trousers`,
    shoe: `${uniqueId}-shoe`,
    blush: `${uniqueId}-blush`,
  };
  const layerProps = {
    palette: config.palette,
    pose: config.pose,
    state,
    ids,
  };

  return (
    <svg
      viewBox="0 0 360 520"
      role="img"
      aria-label={label}
      className={cx(styles.svg, compact && styles.compact, className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={ids.skin} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={config.palette.skinLight} />
          <stop offset="0.48" stopColor={config.palette.skin} />
          <stop offset="1" stopColor={config.palette.skinShadow} />
        </linearGradient>
        <linearGradient id={ids.skinShade} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={config.palette.skin} />
          <stop offset="1" stopColor={config.palette.skinShadow} />
        </linearGradient>
        <linearGradient id={ids.hair} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={config.palette.hairLight} />
          <stop offset="0.46" stopColor={config.palette.hair} />
          <stop offset="1" stopColor={config.palette.hairShadow} />
        </linearGradient>
        <linearGradient id={ids.jacket} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={config.palette.overshirt} />
          <stop offset="1" stopColor={config.palette.overshirtShadow} />
        </linearGradient>
        <linearGradient id={ids.trousers} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={config.palette.trousers} />
          <stop offset="1" stopColor={config.palette.trousersShadow} />
        </linearGradient>
        <linearGradient id={ids.shoe} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor={config.palette.shoes} />
        </linearGradient>
        <radialGradient id={ids.blush}>
          <stop offset="0" stopColor="#E9797F" stopOpacity="0.7" />
          <stop offset="1" stopColor="#E9797F" stopOpacity="0" />
        </radialGradient>
      </defs>

      <Avatar2DShadow />
      <g
        className={cx(
          styles.avatarRoot,
          state === "happy" && styles.happy,
          state === "focused" && styles.focused,
          state === "achievement" && styles.achievement,
        )}
      >
        <g className={styles.hairSecondary}>
          <Avatar2DRearHair {...layerProps} />
        </g>
        <g className={styles.bodyBreath}>
          <Avatar2DBody {...layerProps} />
          <Avatar2DLegs {...layerProps} />
          <Avatar2DShoes {...layerProps} />
          <Avatar2DOutfit {...layerProps} />
          <Avatar2DNeck {...layerProps} />
        </g>
        <Avatar2DHead {...layerProps} />
        <Avatar2DEars {...layerProps} />
        <Avatar2DFace
          {...layerProps}
          eyeClassName={cx(styles.eyes, blinking && styles.eyesBlink)}
        />
        <g className={styles.hairSecondary}>
          <Avatar2DFrontHair {...layerProps} />
        </g>
        <Avatar2DEffects {...layerProps} />
      </g>
    </svg>
  );
}
