import { getAvatarGeometry } from "@/components/avatar-v3/avatar-geometry";
import type { AvatarConfig } from "@/lib/avatar-config";

export function TopLayer({ config }: { config: AvatarConfig }) {
  const geometry = getAvatarGeometry(config.bodyPreset);
  const {
    shoulderLeft,
    shoulderRight,
    waistLeft,
    waistRight,
    armWidth,
  } = geometry;
  const collar =
    config.topStyle === "polo" || config.topStyle === "oxford"
      ? "M130 228 L150 250 L170 228 L164 260 H136Z"
      : config.topStyle === "mock"
        ? "M133 219 Q150 230 167 219 V244 Q150 253 133 244Z"
        : config.topStyle === "blouse"
          ? "M128 226 Q150 254 172 226 L159 264 H141Z"
          : config.topStyle === "henley"
            ? "M142 225 H158 V270 H142Z"
            : "";

  return (
    <g>
      <path
        d={`M${shoulderLeft + 5} 243 Q${shoulderLeft - 7} 258 ${
          shoulderLeft - 10
        } 287`}
        fill="none"
        stroke={config.topColor}
        strokeWidth={armWidth + 7}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderRight - 5} 243 Q${shoulderRight + 7} 258 ${
          shoulderRight + 10
        } 287`}
        fill="none"
        stroke={config.topColor}
        strokeWidth={armWidth + 7}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderLeft} 238 Q150 208 ${shoulderRight} 238 L${
          waistRight + 7
        } 348 Q150 364 ${waistLeft - 7} 348Z`}
        fill={config.topColor}
      />
      {collar ? (
        <path
          d={collar}
          fill={
            config.topStyle === "henley"
              ? "rgba(255,255,255,0.12)"
              : "#f3f1eb"
          }
          opacity="0.78"
        />
      ) : null}
      {config.topStyle === "knit" ? (
        <path
          d={`M${shoulderLeft + 10} 256 Q150 238 ${shoulderRight - 10} 256`}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="4"
        />
      ) : null}
      {config.topStyle === "sport" ? (
        <path
          d={`M${shoulderLeft + 6} 245 L${waistRight} 343`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="7"
        />
      ) : null}
    </g>
  );
}

export function OuterwearLayer({ config }: { config: AvatarConfig }) {
  if (config.outerwearStyle === "none") return null;
  const geometry = getAvatarGeometry(config.bodyPreset);
  const {
    shoulderLeft,
    shoulderRight,
    waistLeft,
    waistRight,
    armWidth,
  } = geometry;
  const openCenter =
    config.outerwearStyle === "blazer" ||
    config.outerwearStyle === "cardigan" ||
    config.outerwearStyle === "overshirt";

  return (
    <g>
      <path
        d={`M${shoulderLeft + 2} 244 Q${shoulderLeft - 13} 276 ${
          shoulderLeft - 16
        } 326`}
        fill="none"
        stroke={config.outerwearColor}
        strokeWidth={armWidth + 10}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderRight - 2} 244 Q${shoulderRight + 13} 276 ${
          shoulderRight + 16
        } 326`}
        fill="none"
        stroke={config.outerwearColor}
        strokeWidth={armWidth + 10}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderLeft - 2} 239 Q112 219 136 224 L145 347 Q125 357 ${
          waistLeft - 10
        } 346Z`}
        fill={config.outerwearColor}
      />
      <path
        d={`M${shoulderRight + 2} 239 Q188 219 164 224 L155 347 Q175 357 ${
          waistRight + 10
        } 346Z`}
        fill={config.outerwearColor}
      />
      {!openCenter ? (
        <path
          d="M136 224 Q150 232 164 224 L171 346 Q150 357 129 346Z"
          fill={config.outerwearColor}
        />
      ) : null}
      {config.outerwearStyle === "blazer" ? (
        <g fill="rgba(255,255,255,0.16)">
          <path d="M136 224 L148 257 L140 282 L119 234Z" />
          <path d="M164 224 L152 257 L160 282 L181 234Z" />
        </g>
      ) : null}
      {config.outerwearStyle === "bomber" ? (
        <path
          d="M125 342 Q150 352 175 342"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      ) : null}
      {config.outerwearStyle === "utility" ? (
        <g fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
          <rect x="111" y="278" width="28" height="27" rx="5" />
          <rect x="161" y="278" width="28" height="27" rx="5" />
        </g>
      ) : null}
    </g>
  );
}

export function GlassesLayer({ config }: { config: AvatarConfig }) {
  if (config.glassesStyle === "none") return null;
  const strokeWidth = config.glassesStyle === "bold" ? 5 : 3;
  const color = config.glassesStyle === "architect" ? "#6b7280" : "#20242b";

  if (config.glassesStyle === "round") {
    return (
      <g fill="none" stroke={color} strokeWidth={strokeWidth}>
        <circle cx="122" cy="116" r="17" />
        <circle cx="178" cy="116" r="17" />
        <path d="M139 116 H161" />
      </g>
    );
  }
  return (
    <g fill="none" stroke={color} strokeWidth={strokeWidth}>
      <rect
        x="103"
        y={config.glassesStyle === "architect" ? 104 : 102}
        width="38"
        height={config.glassesStyle === "architect" ? 22 : 27}
        rx={config.glassesStyle === "classic" ? 10 : 5}
      />
      <rect
        x="159"
        y={config.glassesStyle === "architect" ? 104 : 102}
        width="38"
        height={config.glassesStyle === "architect" ? 22 : 27}
        rx={config.glassesStyle === "classic" ? 10 : 5}
      />
      <path d="M141 115 H159" />
    </g>
  );
}

export function AccessoryLayer({ config }: { config: AvatarConfig }) {
  if (config.accessoryStyle === "none") return null;
  if (config.accessoryStyle === "studs") {
    return (
      <g fill="#d7b56d">
        <circle cx="96" cy="135" r="3.5" />
        <circle cx="204" cy="135" r="3.5" />
      </g>
    );
  }
  if (config.accessoryStyle === "hoops") {
    return (
      <g fill="none" stroke="#d7b56d" strokeWidth="3">
        <circle cx="94" cy="144" r="8" />
        <circle cx="206" cy="144" r="8" />
      </g>
    );
  }
  if (config.accessoryStyle === "chain") {
    return (
      <path
        d="M126 236 Q150 272 174 236"
        fill="none"
        stroke="#d7b56d"
        strokeWidth="3"
      />
    );
  }
  if (config.accessoryStyle === "scarf") {
    return (
      <path
        d="M122 226 Q150 246 178 226 L170 272 Q150 260 130 272Z"
        fill="#8c5b76"
        opacity="0.92"
      />
    );
  }
  return (
    <g>
      <rect x="210" y="353" width="17" height="12" rx="5" fill="#24272e" />
      <circle cx="218.5" cy="359" r="5" fill="#d7b56d" />
    </g>
  );
}
