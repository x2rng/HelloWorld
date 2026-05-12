import type { AvatarConfig } from "@/lib/avatar-config";
import { defaultAvatarConfig } from "@/lib/avatar-config";
import { cx } from "@/lib/utils";

type FullBodyAvatarProps = {
  config?: AvatarConfig | null;
  className?: string;
  compact?: boolean;
};

function Hair({ config }: { config: AvatarConfig }) {
  if (config.hairStyle === "none") return null;

  if (config.hairStyle === "curly") {
    return (
      <g fill={config.hairColor}>
        {[83, 97, 111, 125, 139].map((cxValue) => (
          <circle key={cxValue} cx={cxValue} cy="70" r="15" />
        ))}
        <circle cx="90" cy="88" r="14" />
        <circle cx="132" cy="88" r="14" />
      </g>
    );
  }

  if (config.hairStyle === "coily") {
    return (
      <g fill={config.hairColor}>
        {[78, 92, 106, 120, 134, 148].map((cxValue, index) => (
          <circle key={cxValue} cx={cxValue} cy={index % 2 === 0 ? 76 : 64} r="12" />
        ))}
        <circle cx="84" cy="92" r="11" />
        <circle cx="140" cy="92" r="11" />
      </g>
    );
  }

  if (config.hairStyle === "bob") {
    return <path d="M75 103 C73 62 91 42 113 42 C142 42 155 63 152 105 C139 93 94 93 75 103Z" fill={config.hairColor} />;
  }

  if (config.hairStyle === "side") {
    return <path d="M76 93 C79 57 101 44 127 49 C145 53 154 69 151 96 C133 76 105 73 76 93Z" fill={config.hairColor} />;
  }

  return <path d="M78 88 C84 58 103 46 127 51 C144 55 151 68 151 90 C126 77 101 77 78 88Z" fill={config.hairColor} />;
}

export function FullBodyAvatar({
  config = defaultAvatarConfig,
  className,
  compact = false,
}: FullBodyAvatarProps) {
  const avatarConfig = config ?? defaultAvatarConfig;

  return (
    <svg
      viewBox="0 0 230 360"
      className={cx(compact ? "h-56 w-40" : "h-72 w-52 sm:h-80 sm:w-60", className)}
      role="img"
      aria-label="Employee avatar"
    >
      <ellipse cx="115" cy="334" rx="68" ry="12" fill="currentColor" opacity="0.08" />
      <path d="M78 178 C87 153 143 153 152 178 L164 263 H66Z" fill={avatarConfig.topColor} />
      <path d="M89 180 L115 215 L141 180 L132 286 H98Z" fill="#ffffff" opacity="0.88" />
      <path d="M83 188 L52 252" stroke={avatarConfig.skinTone} strokeWidth="18" strokeLinecap="round" />
      <path d="M147 188 L178 252" stroke={avatarConfig.skinTone} strokeWidth="18" strokeLinecap="round" />
      <circle cx="49" cy="258" r="11" fill={avatarConfig.skinTone} />
      <circle cx="181" cy="258" r="11" fill={avatarConfig.skinTone} />
      <path d="M89 263 H113 L107 332 H76Z" fill={avatarConfig.bottomColor} />
      <path d="M117 263 H141 L154 332 H123Z" fill={avatarConfig.bottomColor} />
      <path d="M75 333 H110" stroke="#111827" strokeWidth="12" strokeLinecap="round" />
      <path d="M120 333 H157" stroke="#111827" strokeWidth="12" strokeLinecap="round" />
      <path d="M96 145 C101 159 129 159 134 145 V169 C128 181 102 181 96 169Z" fill={avatarConfig.skinTone} />
      <path d="M76 92 C76 59 92 39 115 39 C140 39 154 59 154 93 C154 126 139 149 115 149 C91 149 76 126 76 92Z" fill={avatarConfig.skinTone} />
      <Hair config={avatarConfig} />
      <path d="M96 101 C100 98 104 98 108 101 M124 101 C128 98 132 98 136 101" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" opacity="0.72" />
      <path d="M107 124 C112 129 120 129 125 124" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <path d="M116 107 L112 118 H120" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
      {avatarConfig.glasses ? (
        <g fill="none" stroke="#111827" strokeLinecap="round" strokeWidth="3" opacity="0.82">
          <circle cx="102" cy="105" r="12" />
          <circle cx="130" cy="105" r="12" />
          <path d="M114 105 H118" />
        </g>
      ) : null}
      <path d="M78 178 C91 199 139 199 152 178" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.42" />
    </svg>
  );
}
