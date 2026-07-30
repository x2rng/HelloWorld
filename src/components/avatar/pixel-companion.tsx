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
  focused = false,
}: {
  leftX: number;
  rightX: number;
  y: number;
  state: CompanionState;
  glow: string;
  face: string;
  focused?: boolean;
}) {
  if (state === "completed") {
    return (
      <g className={styles.blink} fill={glow}>
        <rect x={leftX} y={y + 1} width="2" height="2" />
        <rect x={leftX + 2} y={y} width="2" height="2" />
        <rect x={rightX} y={y} width="2" height="2" />
        <rect x={rightX + 2} y={y + 1} width="2" height="2" />
      </g>
    );
  }

  if (state === "working" || focused) {
    return (
      <g className={styles.blink} fill={glow}>
        <rect x={leftX} y={y + 1} width="4" height="2" />
        <rect x={rightX} y={y + 1} width="4" height="2" />
        <rect x={leftX + 1} y={y + 3} width="2" height="1" fill={face} />
        <rect x={rightX + 1} y={y + 3} width="2" height="1" fill={face} />
      </g>
    );
  }

  return (
    <g className={styles.blink}>
      <rect x={leftX} y={y} width="4" height="4" fill={face} />
      <rect x={rightX} y={y} width="4" height="4" fill={face} />
      <rect x={leftX + 1} y={y + 1} width="2" height="2" fill={glow} />
      <rect x={rightX + 1} y={y + 1} width="2" height="2" fill={glow} />
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
          <rect x={x + 2} y={y} width="3" height="3" />
          <rect x={x} y={y + 2} width="7" height="3" />
          <rect x={x + 2} y={y + 4} width="3" height="3" />
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
}: {
  pattern: CompanionPattern;
  color: string;
}) {
  if (pattern === "none") return null;

  if (pattern === "corner-pixels") {
    return (
      <g fill={color} opacity="0.75">
        <rect x="18" y="39" width="3" height="3" />
        <rect x="21" y="42" width="2" height="2" />
        <rect x="43" y="39" width="3" height="3" />
      </g>
    );
  }

  if (pattern === "soft-dots") {
    return (
      <g fill={color} opacity="0.58">
        <rect x="23" y="39" width="2" height="2" />
        <rect x="29" y="42" width="2" height="2" />
        <rect x="35" y="39" width="2" height="2" />
        <rect x="41" y="42" width="2" height="2" />
      </g>
    );
  }

  if (pattern === "tiny-stripe") {
    return (
      <g fill={color} opacity="0.62">
        <rect x="20" y="40" width="24" height="2" />
        <rect x="24" y="44" width="16" height="1" />
      </g>
    );
  }

  return (
    <g fill={color} opacity="0.72">
      <rect x="27" y="43" width="2" height="2" />
      <rect x="30" y="40" width="2" height="5" />
      <rect x="33" y="37" width="2" height="8" />
      <rect x="36" y="40" width="2" height="5" />
    </g>
  );
}

function StageMarks({
  stage,
  glow,
}: {
  stage: CompanionStage;
  glow: string;
}) {
  if (stage === "starter") {
    return <rect x="30" y="51" width="4" height="2" fill={glow} opacity="0.72" />;
  }

  if (stage === "explorer") {
    return (
      <g fill={glow} opacity="0.82">
        <rect x="27" y="51" width="4" height="2" />
        <rect x="33" y="51" width="4" height="2" />
      </g>
    );
  }

  return (
    <g fill={glow}>
      <rect x="25" y="51" width="4" height="2" />
      <rect x="30" y="49" width="4" height="4" />
      <rect x="35" y="51" width="4" height="2" />
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
        focused
      />
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
      <rect x="30" y="10" width="4" height="12" fill={palette.shadow} />
      <rect x="23" y="11" width="8" height="4" fill={palette.secondary} />
      <rect x="20" y="14" width="11" height="5" fill={palette.primary} />
      <rect x="34" y="8" width="8" height="4" fill={palette.highlight} />
      <rect x="34" y="11" width="11" height="5" fill={palette.secondary} />
      <rect x="18" y="22" width="28" height="32" fill={palette.shadow} />
      <rect x="14" y="28" width="36" height="20" fill={palette.shadow} />
      <rect x="18" y="24" width="28" height="26" fill={palette.primary} />
      <rect x="14" y="31" width="36" height="13" fill={palette.primary} />
      <rect x="21" y="25" width="22" height="4" fill={palette.secondary} />
      <rect x="18" y="29" width="4" height="15" fill={palette.secondary} />
      <rect x="42" y="29" width="4" height="15" fill={palette.shadow} />
      <PixelEyes
        leftX={22}
        rightX={36}
        y={33}
        state={state}
        glow={glow}
        face={palette.face}
      />
      <rect x="29" y="41" width="6" height="2" fill={palette.detail} />
      <rect x="24" y="50" width="6" height="6" fill={palette.deepShadow} />
      <rect x="34" y="50" width="6" height="6" fill={palette.deepShadow} />
      <StateIndicator state={state} glow={glow} x={27} y={47} />
    </>
  );
}

function SignalArtwork({ state, glow, palette }: ArtworkProps) {
  return (
    <>
      <rect x="30" y="8" width="4" height="11" fill={palette.shadow} />
      <rect x="28" y="6" width="8" height="5" fill={palette.deepShadow} />
      <rect x="30" y="7" width="4" height="3" fill={glow} />
      <rect x="21" y="18" width="22" height="4" fill={palette.secondary} />
      <rect x="17" y="22" width="30" height="5" fill={palette.primary} />
      <rect x="14" y="27" width="36" height="18" fill={palette.primary} />
      <rect x="18" y="45" width="28" height="7" fill={palette.shadow} />
      <rect x="22" y="52" width="20" height="4" fill={palette.deepShadow} />
      <rect x="14" y="30" width="4" height="11" fill={palette.secondary} />
      <rect x="46" y="30" width="4" height="11" fill={palette.shadow} />
      <rect x="20" y="25" width="24" height="4" fill={palette.highlight} />
      <PixelEyes
        leftX={22}
        rightX={36}
        y={33}
        state={state}
        glow={glow}
        face={palette.face}
      />
      <rect x="29" y="41" width="6" height="2" fill={palette.detail} />
      <StateIndicator state={state} glow={glow} x={28} y={47} />
    </>
  );
}

function StackArtwork({ state, glow, palette }: ArtworkProps) {
  return (
    <>
      <rect x="20" y="15" width="24" height="10" fill={palette.secondary} />
      <rect x="17" y="18" width="30" height="7" fill={palette.secondary} />
      <rect x="14" y="26" width="36" height="11" fill={palette.primary} />
      <rect x="11" y="38" width="42" height="12" fill={palette.shadow} />
      <rect x="15" y="50" width="34" height="5" fill={palette.deepShadow} />
      <rect x="20" y="17" width="4" height="6" fill={palette.highlight} />
      <rect x="40" y="17" width="4" height="6" fill={palette.shadow} />
      <rect x="17" y="29" width="30" height="2" fill={palette.highlight} />
      <rect x="14" y="40" width="36" height="2" fill={palette.primary} />
      <PixelEyes
        leftX={22}
        rightX={36}
        y={31}
        state={state}
        glow={glow}
        face={palette.face}
        focused={state === "working"}
      />
      <rect x="29" y="36" width="6" height="2" fill={palette.detail} />
      <StateIndicator state={state} glow={glow} x={28} y={44} />
      <rect x="19" y="55" width="10" height="3" fill={palette.deepShadow} />
      <rect x="35" y="55" width="10" height="3" fill={palette.deepShadow} />
    </>
  );
}

function SpiritArtwork({ state, glow, palette }: ArtworkProps) {
  return (
    <>
      <rect x="22" y="14" width="20" height="4" fill={palette.secondary} />
      <rect x="18" y="18" width="28" height="6" fill={palette.primary} />
      <rect x="15" y="24" width="34" height="18" fill={palette.primary} />
      <rect x="18" y="42" width="28" height="7" fill={palette.shadow} />
      <rect x="22" y="49" width="20" height="4" fill={palette.shadow} />
      <rect x="26" y="53" width="12" height="3" fill={palette.deepShadow} />
      <rect x="18" y="22" width="4" height="17" fill={palette.secondary} />
      <rect x="42" y="22" width="4" height="17" fill={palette.shadow} />
      <rect x="22" y="17" width="16" height="3" fill={palette.highlight} />
      <PixelEyes
        leftX={22}
        rightX={36}
        y={29}
        state={state}
        glow={glow}
        face={palette.face}
      />
      <rect x="30" y="37" width="4" height="2" fill={palette.detail} />
      <StateIndicator state={state} glow={glow} x={28} y={44} />
      <g fill={glow} opacity="0.55">
        <rect x="17" y="52" width="3" height="3" />
        <rect x="12" y="56" width="2" height="2" />
        <rect x="44" y="55" width="3" height="3" />
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
  const glow = getCompanionGlow(config.glowColor);

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
      <g className={styles.art}>
        <CompanionArtwork
          family={config.family}
          state={state}
          glow={glow}
          palette={palette}
        />
        <PatternLayer pattern={config.pattern} color={palette.highlight} />
        <StageMarks stage={stage} glow={glow} />
      </g>
    </svg>
  );
}
