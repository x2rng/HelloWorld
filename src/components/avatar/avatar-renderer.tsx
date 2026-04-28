import type { AvatarConfig } from "@/lib/types";
import { cx } from "@/lib/utils";

const skinMap: Record<string, string> = {
  porcelain: "#f8d7c1",
  warm: "#e8b58f",
  olive: "#c9966a",
  bronze: "#9a6648",
  deep: "#6f4833",
};

const hairMap: Record<string, string> = {
  ink: "#171717",
  brown: "#644637",
  sand: "#ad8e62",
  silver: "#9ca3af",
  blueblack: "#1f2a44",
};

const eyeMap: Record<string, string> = {
  graphite: "#2c3138",
  blue: "#557dff",
  green: "#3e9159",
  amber: "#b98121",
};

const topMap: Record<string, string> = {
  tee: "#f6f7f8",
  sweater: "#d9dee4",
  jacket: "#515f8c",
  hoodie: "#5b6777",
};

const bottomMap: Record<string, string> = {
  relaxed: "#424955",
  tailored: "#262d38",
  sport: "#68778d",
};

function hairPixels(style: string, color: string) {
  const shared = [
    <rect key="shared-1" x="4" y="1" width="8" height="1" fill={color} />,
    <rect key="shared-2" x="3" y="2" width="10" height="1" fill={color} />,
  ];

  if (style === "buzz") {
    return [...shared, <rect key="buzz" x="4" y="2" width="8" height="1" fill={color} opacity="0.85" />];
  }
  if (style === "bun") {
    return [
      ...shared,
      <rect key="bun-1" x="6" y="0" width="4" height="1" fill={color} />,
      <rect key="bun-2" x="3" y="3" width="2" height="2" fill={color} />,
      <rect key="bun-3" x="11" y="3" width="2" height="2" fill={color} />,
    ];
  }
  if (style === "curtain") {
    return [
      ...shared,
      <rect key="curtain-1" x="4" y="3" width="2" height="3" fill={color} />,
      <rect key="curtain-2" x="10" y="3" width="2" height="3" fill={color} />,
    ];
  }
  if (style === "wave") {
    return [
      ...shared,
      <rect key="wave-1" x="2" y="3" width="2" height="3" fill={color} />,
      <rect key="wave-2" x="12" y="3" width="2" height="3" fill={color} />,
      <rect key="wave-3" x="5" y="3" width="6" height="1" fill={color} />,
    ];
  }
  return [
    ...shared,
    <rect key="short-1" x="2" y="3" width="2" height="2" fill={color} />,
    <rect key="short-2" x="12" y="3" width="2" height="2" fill={color} />,
    <rect key="short-3" x="5" y="3" width="6" height="2" fill={color} />,
  ];
}

function accessoryPixels(accessory: string, eyeColor: string) {
  if (accessory === "glasses") {
    return (
      <>
        <rect x="4" y="6" width="3" height="2" fill="none" stroke={eyeColor} strokeWidth="0.8" />
        <rect x="9" y="6" width="3" height="2" fill="none" stroke={eyeColor} strokeWidth="0.8" />
        <rect x="7" y="6.6" width="2" height="0.8" fill={eyeColor} />
      </>
    );
  }
  if (accessory === "band") {
    return <rect x="2" y="4" width="12" height="1" fill="#c7932c" />;
  }
  if (accessory === "earring") {
    return <rect x="12" y="9" width="1" height="1" fill="#c7932c" />;
  }
  return null;
}

export function AvatarRenderer({
  avatar,
  size = 132,
  className,
}: {
  avatar: AvatarConfig;
  size?: number;
  className?: string;
}) {
  const skin = skinMap[avatar.skinTone] ?? skinMap.warm;
  const hair = hairMap[avatar.hairColor] ?? hairMap.ink;
  const eyes = eyeMap[avatar.eyeColor] ?? eyeMap.graphite;
  const top = topMap[avatar.top] ?? topMap.tee;
  const bottom = bottomMap[avatar.bottom] ?? bottomMap.relaxed;

  return (
    <div
      className={cx(
        "relative inline-flex items-center justify-center rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(63,108,255,0.18),_transparent_52%),linear-gradient(180deg,_rgba(255,255,255,0.84),_rgba(255,255,255,0.62))] p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        className="drop-shadow-[0_10px_20px_rgba(15,23,42,0.18)]"
        style={{ imageRendering: "pixelated" }}
      >
        <rect x="5" y="3" width="6" height="5" fill={skin} />
        <rect x="6" y="8" width="4" height="1" fill={skin} />
        <rect x="4" y="8" width="1" height="4" fill={skin} />
        <rect x="11" y="8" width="1" height="4" fill={skin} />
        <rect x="5" y="9" width="6" height="3" fill={top} />
        <rect x="6" y="12" width="2" height="3" fill={bottom} />
        <rect x="8" y="12" width="2" height="3" fill={bottom} />
        <rect x="5" y="15" width="2" height="1" fill="#1f2937" />
        <rect x="9" y="15" width="2" height="1" fill="#1f2937" />
        <rect x="6" y="6" width="1" height="1" fill={eyes} />
        <rect x="9" y="6" width="1" height="1" fill={eyes} />
        <rect x="7" y="8" width="2" height="1" fill="#d28c76" opacity="0.8" />
        {hairPixels(avatar.hairStyle, hair)}
        {accessoryPixels(avatar.accessory, eyes)}
      </svg>
    </div>
  );
}
