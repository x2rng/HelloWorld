import styles from "@/components/avatar/pixel-companion.module.css";
import {
  getCompanionGlow,
  getCompanionPalette,
} from "@/components/avatar/companion-palettes";
import type {
  CompanionFamily,
  CompanionPattern,
  CompanionStage,
  CompanionState,
  PixelCompanionConfig,
} from "@/lib/avatar/companion-types";
import { cx } from "@/lib/utils";

type PixelCompanionProps = {
  config: PixelCompanionConfig;
  state?: CompanionState;
  stage?: CompanionStage;
  size?: number;
  className?: string;
  reducedMotion?: boolean;
  label?: string;
};

type ArtworkProps = {
  state: CompanionState;
  glow: string;
  palette: ReturnType<typeof getCompanionPalette>;
};

function PixelEyes({
  leftX,
  rightX,
  y,
  state,
  glow,
  face,
  detail,
}: {
  leftX: number;
  rightX: number;
  y: number;
  state: CompanionState;
  glow: string;
  face: string;
  detail: string;
}) {
  return (
    <>
      {state === "working" ? (
        <g fill={detail} opacity="0.92">
          <rect x={leftX} y={y - 2} width="2" height="1" />
          <rect x={leftX + 2} y={y - 1} width="2" height="1" />
          <rect x={rightX} y={y - 1} width="2" height="1" />
          <rect x={rightX + 2} y={y - 2} width="2" height="1" />
        </g>
      ) : null}
      <g className={styles.blink}>
        <rect x={leftX} y={y} width="4" height="5" fill={face} />
        <rect x={rightX} y={y} width="4" height="5" fill={face} />
        <rect
          x={leftX + 1}
          y={state === "working" ? y + 2 : y + 1}
          width="2"
          height={state === "completed" ? 3 : 2}
          fill={glow}
        />
        <rect
          x={rightX + 1}
          y={state === "working" ? y + 2 : y + 1}
          width="2"
          height={state === "completed" ? 3 : 2}
          fill={glow}
        />
        <rect x={leftX + 1} y={y + 1} width="1" height="1" fill={face} />
        <rect x={rightX + 1} y={y + 1} width="1" height="1" fill={face} />
      </g>
    </>
  );
}

function PixelMouth({
  centerX,
  y,
  state,
  color,
}: {
  centerX: number;
  y: number;
  state: CompanionState;
  color: string;
}) {
  if (state === "working") {
    return <rect x={centerX - 2} y={y + 1} width="4" height="1" fill={color} />;
  }

  if (state === "completed") {
    return (
      <g fill={color}>
        <rect x={centerX - 4} y={y} width="2" height="1" />
        <rect x={centerX - 2} y={y + 1} width="4" height="1" />
        <rect x={centerX + 2} y={y} width="2" height="1" />
      </g>
    );
  }

  return (
    <g fill={color}>
      <rect x={centerX - 3} y={y} width="2" height="1" />
      <rect x={centerX - 1} y={y + 1} width="2" height="1" />
      <rect x={centerX + 1} y={y} width="2" height="1" />
    </g>
  );
}

function StateIndicator({
  state,
  glow,
  x,
  y,
}: {
  state: CompanionState;
  glow: string;
  x: number;
  y: number;
}) {
  return (
    <g className={styles.indicator} fill={glow}>
      {state === "working" ? (
        <>
          <rect x={x} y={y + 4} width="2" height="2" />
          <rect x={x + 3} y={y + 2} width="2" height="4" />
          <rect x={x + 6} y={y} width="2" height="6" />
        </>
      ) : state === "completed" ? (
        <>
          <rect x={x} y={y + 2} width="2" height="2" />
          <rect x={x + 2} y={y + 4} width="2" height="2" />
          <rect x={x + 4} y={y} width="2" height="4" />
        </>
      ) : (
        <rect x={x + 2} y={y + 2} width="3" height="3" />
      )}
    </g>
  );
}

function PatternLayer({
  pattern,
  color,
  family,
}: {
  pattern: CompanionPattern;
  color: string;
  family: CompanionFamily;
}) {
  if (pattern === "none") return null;

  const anchors: Record<
    CompanionFamily,
    { left: number; right: number; y: number; stripeWidth: number }
  > = {
    terminal: { left: 18, right: 44, y: 42, stripeWidth: 16 },
    growth: { left: 21, right: 41, y: 45, stripeWidth: 13 },
    signal: { left: 20, right: 42, y: 43, stripeWidth: 14 },
    stack: { left: 17, right: 45, y: 44, stripeWidth: 18 },
    spirit: { left: 22, right: 40, y: 42, stripeWidth: 11 },
  };
  const anchor = anchors[family];

  if (pattern === "corner-pixels") {
    return (
      <g fill={color} opacity="0.75">
        <rect x={anchor.left} y={anchor.y} width="2" height="2" />
        <rect x={anchor.left + 2} y={anchor.y + 2} width="2" height="2" />
        <rect x={anchor.right - 2} y={anchor.y} width="2" height="2" />
      </g>
    );
  }

  if (pattern === "soft-dots") {
    return (
      <g fill={color} opacity="0.58">
        <rect x={anchor.left + 2} y={anchor.y} width="2" height="2" />
        <rect x={anchor.left + 7} y={anchor.y + 2} width="2" height="2" />
        <rect x={anchor.right - 7} y={anchor.y} width="2" height="2" />
        <rect x={anchor.right - 2} y={anchor.y + 2} width="2" height="2" />
      </g>
    );
  }

  if (pattern === "tiny-stripe") {
    return (
      <g fill={color} opacity="0.62">
        <rect
          x={32 - anchor.stripeWidth / 2}
          y={anchor.y + 1}
          width={anchor.stripeWidth}
          height="2"
        />
      </g>
    );
  }

  if (pattern === "micro-spark") {
    return (
      <g fill={color} opacity="0.78">
        <rect x={anchor.right - 5} y={anchor.y + 2} width="2" height="2" />
        <rect x={anchor.right - 7} y={anchor.y + 2} width="1" height="1" />
        <rect x={anchor.right - 2} y={anchor.y + 2} width="1" height="1" />
        <rect x={anchor.right - 5} y={anchor.y} width="1" height="1" />
        <rect x={anchor.right - 5} y={anchor.y + 5} width="1" height="1" />
      </g>
    );
  }

  return null;
}

function StageMarks({
  stage,
  glow,
  family,
}: {
  stage: CompanionStage;
  glow: string;
  family: CompanionFamily;
}) {
  const y: Record<CompanionFamily, number> = {
    terminal: 48,
    growth: 52,
    signal: 51,
    stack: 53,
    spirit: 49,
  };
  const stageY = y[family];

  if (stage === "starter") {
    return (
      <rect
        x="30"
        y={stageY}
        width="4"
        height="2"
        fill={glow}
        opacity="0.72"
      />
    );
  }

  if (stage === "explorer") {
    return (
      <g fill={glow} opacity="0.82">
        <rect x="27" y={stageY} width="4" height="2" />
        <rect x="33" y={stageY} width="4" height="2" />
      </g>
    );
  }

  return (
    <g fill={glow}>
      <rect x="25" y={stageY} width="4" height="2" />
      <rect x="30" y={stageY - 2} width="4" height="4" />
      <rect x="35" y={stageY} width="4" height="2" />
    </g>
  );
}

function TerminalArtwork({ state, glow, palette }: ArtworkProps) {
  return (
    <>
      <rect x="15" y="17" width="34" height="34" fill={palette.deepShadow} />
      <rect x="11" y="21" width="42" height="26" fill={palette.deepShadow} />
      <rect x="14" y="18" width="36" height="31" fill={palette.primary} />
      <rect x="11" y="24" width="3" height="18" fill={palette.shadow} />
      <rect x="50" y="24" width="3" height="18" fill={palette.shadow} />
      <rect x="17" y="22" width="30" height="17" fill={palette.deepShadow} />
      <rect x="20" y="24" width="24" height="13" fill={palette.detail} />
      <rect x="20" y="24" width="24" height="2" fill={palette.secondary} />
      <PixelEyes
        leftX={24}
        rightX={36}
        y={29}
        state={state}
        glow={glow}
        face={palette.face}
        detail={palette.detail}
      />
      <PixelMouth centerX={32} y={35} state={state} color={palette.face} />
      <rect x="18" y="42" width="20" height="3" fill={palette.secondary} />
      <rect x="40" y="42" width="6" height="3" fill={palette.highlight} />
      <StateIndicator state={state} glow={glow} x={39} y={42} />
      <rect x="22" y="49" width="20" height="3" fill={palette.shadow} />
      <rect x="18" y="52" width="12" height="3" fill={palette.deepShadow} />
      <rect x="34" y="52" width="12" height="3" fill={palette.deepShadow} />
    </>
  );
}

function GrowthArtwork({ state, glow, palette }: ArtworkProps) {
  return (
    <>
      <g className={styles.growthCrown}>
        <rect x="30" y="10" width="4" height="13" fill={palette.shadow} />
        <rect x="21" y="9" width="9" height="3" fill={palette.secondary} />
        <rect x="18" y="12" width="12" height="6" fill={palette.primary} />
        <rect x="21" y="18" width="9" height="3" fill={palette.shadow} />
        <rect x="34" y="6" width="9" height="3" fill={palette.highlight} />
        <rect x="34" y="9" width="13" height="6" fill={palette.secondary} />
        <rect x="34" y="15" width="9" height="4" fill={palette.shadow} />
      </g>
      <rect x="26" y="21" width="12" height="3" fill={palette.secondary} />
      <rect x="22" y="24" width="20" height="4" fill={palette.primary} />
      <rect x="19" y="28" width="26" height="5" fill={palette.primary} />
      <rect x="16" y="33" width="32" height="10" fill={palette.primary} />
      <rect x="18" y="43" width="28" height="7" fill={palette.primary} />
      <rect x="21" y="50" width="22" height="5" fill={palette.shadow} />
      <rect x="26" y="55" width="12" height="3" fill={palette.deepShadow} />
      <rect x="19" y="31" width="4" height="13" fill={palette.secondary} />
      <rect x="42" y="33" width="4" height="10" fill={palette.shadow} />
      <rect x="23" y="25" width="16" height="3" fill={palette.highlight} />
      <PixelEyes
        leftX={22}
        rightX={36}
        y={34}
        state={state}
        glow={glow}
        face={palette.face}
        detail={palette.detail}
      />
      <PixelMouth centerX={32} y={41} state={state} color={palette.detail} />
    </>
  );
}

function SignalArtwork({ state, glow, palette }: ArtworkProps) {
  return (
    <>
      <g className={styles.signalPulse} fill={glow}>
        <rect x="8" y="23" width="3" height="3" opacity="0.3" />
        <rect x="12" y="17" width="3" height="3" opacity="0.68" />
        <rect x="53" y="23" width="3" height="3" opacity="0.3" />
        <rect x="49" y="17" width="3" height="3" opacity="0.68" />
      </g>
      <rect x="30" y="8" width="4" height="9" fill={palette.shadow} />
      <rect x="27" y="4" width="10" height="6" fill={palette.deepShadow} />
      <rect x="29" y="5" width="6" height="4" fill={glow} />
      <rect x="24" y="16" width="16" height="3" fill={palette.secondary} />
      <rect x="20" y="19" width="24" height="4" fill={palette.primary} />
      <rect x="16" y="23" width="32" height="6" fill={palette.primary} />
      <rect x="13" y="29" width="38" height="13" fill={palette.primary} />
      <rect x="16" y="42" width="32" height="6" fill={palette.primary} />
      <rect x="20" y="48" width="24" height="5" fill={palette.shadow} />
      <rect x="25" y="53" width="14" height="4" fill={palette.deepShadow} />
      <rect x="13" y="30" width="4" height="11" fill={palette.secondary} />
      <rect x="47" y="30" width="4" height="11" fill={palette.deepShadow} />
      <rect x="21" y="20" width="22" height="3" fill={palette.highlight} />
      <PixelEyes
        leftX={21}
        rightX={37}
        y={31}
        state={state}
        glow={glow}
        face={palette.face}
        detail={palette.detail}
      />
      <PixelMouth centerX={32} y={38} state={state} color={palette.detail} />
      <StateIndicator state={state} glow={glow} x={38} y={44} />
    </>
  );
}

function StackArtwork({ state, glow, palette }: ArtworkProps) {
  return (
    <>
      <rect x="24" y="11" width="16" height="3" fill={palette.deepShadow} />
      <rect x="21" y="14" width="22" height="9" fill={palette.secondary} />
      <rect x="24" y="16" width="15" height="2" fill={palette.highlight} />
      <rect x="39" y="18" width="4" height="3" fill={palette.shadow} />
      <rect x="18" y="26" width="28" height="11" fill={palette.primary} />
      <rect x="21" y="28" width="21" height="2" fill={palette.highlight} />
      <rect x="14" y="40" width="36" height="12" fill={palette.shadow} />
      <rect x="18" y="42" width="28" height="2" fill={palette.primary} />
      <rect x="20" y="52" width="24" height="2" fill={palette.deepShadow} />
      <rect x="17" y="54" width="30" height="4" fill={palette.primary} />
      <PixelEyes
        leftX={22}
        rightX={36}
        y={29}
        state={state}
        glow={glow}
        face={palette.face}
        detail={palette.detail}
      />
      <PixelMouth centerX={32} y={34} state={state} color={palette.detail} />
      <StateIndicator state={state} glow={glow} x={39} y={44} />
      <rect x="20" y="58" width="24" height="2" fill={palette.deepShadow} />
    </>
  );
}

function SpiritArtwork({ state, glow, palette }: ArtworkProps) {
  return (
    <>
      <rect x="26" y="12" width="12" height="3" fill={palette.secondary} />
      <rect x="22" y="15" width="20" height="4" fill={palette.primary} />
      <rect x="18" y="19" width="28" height="5" fill={palette.primary} />
      <rect x="15" y="24" width="34" height="13" fill={palette.primary} />
      <rect x="17" y="37" width="30" height="7" fill={palette.primary} />
      <rect x="20" y="44" width="25" height="5" fill={palette.shadow} />
      <rect x="20" y="49" width="7" height="4" fill={palette.shadow} />
      <rect x="29" y="49" width="7" height="7" fill={palette.shadow} />
      <rect x="38" y="49" width="7" height="3" fill={palette.shadow} />
      <rect x="29" y="56" width="5" height="3" fill={palette.deepShadow} />
      <rect x="18" y="22" width="4" height="15" fill={palette.secondary} />
      <rect x="43" y="24" width="4" height="13" fill={palette.shadow} />
      <rect x="23" y="16" width="15" height="3" fill={palette.highlight} />
      <PixelEyes
        leftX={22}
        rightX={36}
        y={28}
        state={state}
        glow={glow}
        face={palette.face}
        detail={palette.detail}
      />
      <PixelMouth centerX={32} y={35} state={state} color={palette.detail} />
      <g className={styles.spiritTrail} fill={glow}>
        <rect x="16" y="46" width="3" height="3" opacity="0.66" />
        <rect x="12" y="51" width="3" height="3" opacity="0.46" />
        <rect x="9" y="56" width="2" height="2" opacity="0.28" />
        <rect x="46" y="45" width="3" height="3" opacity="0.5" />
      </g>
    </>
  );
}

function CompanionArtwork({
  family,
  ...props
}: ArtworkProps & { family: CompanionFamily }) {
  if (family === "growth") return <GrowthArtwork {...props} />;
  if (family === "signal") return <SignalArtwork {...props} />;
  if (family === "stack") return <StackArtwork {...props} />;
  if (family === "spirit") return <SpiritArtwork {...props} />;
  return <TerminalArtwork {...props} />;
}

export function PixelCompanion({
  config,
  state = "idle",
  stage = "starter",
  size = 192,
  className,
  reducedMotion = false,
  label,
}: PixelCompanionProps) {
  const palette = getCompanionPalette(config.colorTheme);
  const glow = getCompanionGlow(config.glowColor, config.colorTheme);

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={label ?? `${config.family} companion`}
      shapeRendering="crispEdges"
      className={cx(
        styles.root,
        state === "working" && styles.working,
        state === "completed" && styles.completed,
        reducedMotion && styles.reduced,
        className,
      )}
      style={
        {
          "--companion-glow": glow,
        } as React.CSSProperties
      }
    >
      {config.family === "spirit" ? (
        <g className={styles.spiritShadow} fill={palette.deepShadow}>
          <rect x="24" y="60" width="16" height="2" opacity="0.42" />
          <rect x="28" y="59" width="8" height="1" opacity="0.28" />
        </g>
      ) : null}
      <g
        className={cx(
          styles.art,
          config.family === "spirit" && styles.spirit,
        )}
      >
        <CompanionArtwork
          family={config.family}
          state={state}
          glow={glow}
          palette={palette}
        />
        <PatternLayer
          pattern={config.pattern}
          color={palette.highlight}
          family={config.family}
        />
        <StageMarks stage={stage} glow={glow} family={config.family} />
      </g>
    </svg>
  );
}
