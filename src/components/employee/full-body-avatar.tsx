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
        <path d="M76 93 C74 63 91 42 116 42 C143 42 158 63 154 95 C144 83 126 78 108 80 C95 81 84 85 76 93Z" />
        {[82, 96, 110, 124, 138, 150].map((cxValue, index) => (
          <circle key={cxValue} cx={cxValue} cy={index % 2 === 0 ? 70 : 58} r="10" />
        ))}
      </g>
    );
  }

  if (config.hairStyle === "coily") {
    return (
      <g fill={config.hairColor}>
        <path d="M74 96 C72 62 91 40 117 40 C145 40 160 62 156 98 C143 86 94 86 74 96Z" />
        {[78, 91, 104, 117, 130, 143, 156].map((cxValue, index) => (
          <circle key={cxValue} cx={cxValue} cy={index % 2 === 0 ? 80 : 63} r="9" />
        ))}
      </g>
    );
  }

  if (config.hairStyle === "bob") {
    return (
      <path
        d="M72 108 C68 66 89 43 116 43 C145 43 160 67 157 109 C147 101 139 93 139 83 C127 89 103 89 91 83 C91 94 82 102 72 108Z"
        fill={config.hairColor}
      />
    );
  }

  if (config.hairStyle === "side") {
    return (
      <path
        d="M74 94 C79 61 101 43 129 49 C147 53 157 69 155 95 C134 79 105 73 74 94Z"
        fill={config.hairColor}
      />
    );
  }

  return (
    <path
      d="M76 91 C83 62 103 47 128 52 C145 55 154 69 154 91 C132 80 104 78 76 91Z"
      fill={config.hairColor}
    />
  );
}

export function FullBodyAvatar({
  config = defaultAvatarConfig,
  className,
  compact = false,
}: FullBodyAvatarProps) {
  const avatarConfig = config ?? defaultAvatarConfig;

  return (
    <svg
      viewBox="0 0 240 380"
      className={cx(compact ? "h-60 w-44" : "h-80 w-56 sm:h-[22rem] sm:w-64", className)}
      role="img"
      aria-label="Employee avatar"
    >
      <ellipse cx="120" cy="351" rx="68" ry="13" fill="#111827" opacity="0.08" />

      <path d="M95 154 C102 168 138 168 145 154 V181 C138 195 102 195 95 181Z" fill={avatarConfig.skinTone} />
      <path
        d="M78 181 C86 161 101 153 120 153 C139 153 154 161 162 181 L174 272 C159 286 139 293 120 293 C101 293 81 286 66 272Z"
        fill={avatarConfig.topColor}
      />
      <path d="M94 178 L120 211 L146 178 L137 274 H103Z" fill="#ffffff" opacity="0.9" />
      <path d="M97 181 L86 247" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.28" />
      <path d="M143 181 L154 247" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.28" />

      <path d="M82 192 C65 213 56 236 52 267" stroke={avatarConfig.skinTone} strokeWidth="17" strokeLinecap="round" />
      <path d="M158 192 C175 213 184 236 188 267" stroke={avatarConfig.skinTone} strokeWidth="17" strokeLinecap="round" />
      <circle cx="51" cy="271" r="10" fill={avatarConfig.skinTone} />
      <circle cx="189" cy="271" r="10" fill={avatarConfig.skinTone} />

      <path
        d="M87 270 C98 277 110 280 120 280 C130 280 142 277 153 270 L164 340 H130 L120 292 L110 340 H76Z"
        fill={avatarConfig.bottomColor}
      />
      <path d="M120 292 V336" stroke="rgba(255,255,255,0.18)" strokeWidth="4" strokeLinecap="round" />
      <path d="M76 342 H111" stroke="#111827" strokeWidth="12" strokeLinecap="round" />
      <path d="M130 342 H166" stroke="#111827" strokeWidth="12" strokeLinecap="round" />

      <path
        d="M76 95 C76 61 94 42 120 42 C146 42 164 61 164 95 C164 130 147 154 120 154 C93 154 76 130 76 95Z"
        fill={avatarConfig.skinTone}
      />
      <Hair config={avatarConfig} />
      <path d="M96 103 C101 100 106 100 110 103" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" opacity="0.72" />
      <path d="M130 103 C134 100 139 100 144 103" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" opacity="0.72" />
      <path d="M120 110 L116 122 H124" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.36" />
      <path d="M111 132 C116 137 124 137 129 132" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" opacity="0.58" />
      <circle cx="98" cy="112" r="5" fill="#f3b391" opacity="0.2" />
      <circle cx="142" cy="112" r="5" fill="#f3b391" opacity="0.2" />

      {avatarConfig.glasses ? (
        <g fill="none" stroke="#111827" strokeLinecap="round" strokeWidth="2.6" opacity="0.82">
          <rect x="91" y="96" width="28" height="19" rx="8" />
          <rect x="121" y="96" width="28" height="19" rx="8" />
          <path d="M119 105 H121" />
        </g>
      ) : null}
    </svg>
  );
}
