import type { AvatarConfig } from "@/lib/avatar-config";

function facePath(shape: AvatarConfig["faceShape"]) {
  if (shape === "round") {
    return "M94 91 Q94 48 150 48 Q206 48 206 91 V133 Q204 190 150 202 Q96 190 94 133Z";
  }
  if (shape === "square") {
    return "M96 82 Q103 48 150 48 Q197 48 204 82 V149 Q194 196 150 202 Q106 196 96 149Z";
  }
  if (shape === "heart") {
    return "M92 87 Q100 47 150 48 Q200 47 208 87 Q205 162 150 202 Q95 162 92 87Z";
  }
  if (shape === "long") {
    return "M101 78 Q108 47 150 47 Q192 47 199 78 V145 Q193 207 150 218 Q107 207 101 145Z";
  }
  return "M96 83 Q104 47 150 47 Q196 47 204 83 V137 Q199 196 150 205 Q101 196 96 137Z";
}

function earMetrics(style: AvatarConfig["earStyle"]) {
  if (style === "small") return { rx: 8, ry: 14, offset: 2 };
  if (style === "rounded") return { rx: 13, ry: 17, offset: -2 };
  if (style === "close") return { rx: 8, ry: 19, offset: 4 };
  return { rx: 11, ry: 19, offset: 0 };
}

export function FaceBaseLayer({ config }: { config: AvatarConfig }) {
  const ears = earMetrics(config.earStyle);
  return (
    <g>
      <ellipse
        cx={94 + ears.offset}
        cy="126"
        rx={ears.rx}
        ry={ears.ry}
        fill={config.skinTone}
      />
      <ellipse
        cx={206 - ears.offset}
        cy="126"
        rx={ears.rx}
        ry={ears.ry}
        fill={config.skinTone}
      />
      <path d={facePath(config.faceShape)} fill={config.skinTone} />
      <path
        d="M113 176 Q150 194 187 176"
        fill="none"
        stroke="rgba(88,48,34,0.08)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

function Eye({
  x,
  shape,
  color,
}: {
  x: number;
  shape: AvatarConfig["eyeShape"];
  color: string;
}) {
  const eyePath =
    shape === "round"
      ? `M${x - 14} 116 Q${x} 101 ${x + 14} 116 Q${x} 132 ${x - 14} 116Z`
      : shape === "narrow"
        ? `M${x - 16} 117 Q${x} 109 ${x + 16} 116 Q${x} 124 ${x - 16} 117Z`
        : shape === "lifted"
          ? `M${x - 15} 120 Q${x} 104 ${x + 16} 111 Q${x} 128 ${x - 15} 120Z`
          : shape === "relaxed"
            ? `M${x - 15} 113 Q${x} 106 ${x + 15} 116 Q${x} 128 ${x - 15} 113Z`
            : shape === "soft"
              ? `M${x - 14} 115 Q${x} 104 ${x + 14} 115 Q${x} 127 ${x - 14} 115Z`
              : `M${x - 15} 116 Q${x} 103 ${x + 15} 116 Q${x} 128 ${x - 15} 116Z`;

  return (
    <g>
      <path d={eyePath} fill="#f7f5f0" />
      <circle cx={x} cy="116" r={shape === "narrow" ? 5 : 7} fill={color} />
      <circle cx={x} cy="116" r="2.8" fill="#171717" />
      <circle cx={x - 2} cy="113.5" r="1.3" fill="#fff" opacity="0.9" />
    </g>
  );
}

function eyebrowPath(
  style: AvatarConfig["eyebrowStyle"],
  x: number,
  mirror = false,
) {
  const direction = mirror ? -1 : 1;
  if (style === "straight")
    return `M${x - 14} 95 Q${x} 92 ${x + 14} 95`;
  if (style === "arched")
    return `M${x - 15} 98 Q${x} 84 ${x + 15} 96`;
  if (style === "soft")
    return `M${x - 14} 97 Q${x} 89 ${x + 14} 96`;
  if (style === "bold")
    return `M${x - 16} ${96 + direction} Q${x} 86 ${x + 16} 95`;
  return `M${x - 15} 97 Q${x} 88 ${x + 15} 96`;
}

function Nose({ style }: { style: AvatarConfig["noseStyle"] }) {
  if (style === "straight")
    return <path d="M150 121 V150 L158 154" {...noseStroke} />;
  if (style === "rounded")
    return <path d="M149 123 Q143 149 151 155 Q158 157 163 151" {...noseStroke} />;
  if (style === "defined")
    return <path d="M152 120 L143 151 Q150 160 162 153" {...noseStroke} />;
  if (style === "small")
    return <path d="M148 142 Q150 151 158 151" {...noseStroke} />;
  return <path d="M150 126 Q144 148 153 153 Q158 154 161 151" {...noseStroke} />;
}

const noseStroke = {
  fill: "none",
  stroke: "rgba(70,43,35,0.3)",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Mouth({ style }: { style: AvatarConfig["mouthStyle"] }) {
  const paths: Record<AvatarConfig["mouthStyle"], string> = {
    calm: "M137 171 Q150 174 163 171",
    warm: "M136 169 Q150 181 164 169",
    smile: "M134 167 Q150 185 166 167",
    focused: "M138 172 H162",
    soft: "M138 169 Q150 177 162 169 Q150 181 138 169Z",
    confident: "M136 170 Q149 176 164 168",
  };
  return (
    <path
      d={paths[style]}
      fill={style === "soft" ? "rgba(145,70,72,0.36)" : "none"}
      stroke="rgba(100,49,52,0.58)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function FaceFeatureLayer({ config }: { config: AvatarConfig }) {
  const eyebrowWidth = config.eyebrowStyle === "bold" ? 5 : 3.2;
  return (
    <g>
      <path
        d={eyebrowPath(config.eyebrowStyle, 122)}
        fill="none"
        stroke={config.eyebrowColor}
        strokeWidth={eyebrowWidth}
        strokeLinecap="round"
      />
      <path
        d={eyebrowPath(config.eyebrowStyle, 178, true)}
        fill="none"
        stroke={config.eyebrowColor}
        strokeWidth={eyebrowWidth}
        strokeLinecap="round"
      />
      <Eye x={122} shape={config.eyeShape} color={config.eyeColor} />
      <Eye x={178} shape={config.eyeShape} color={config.eyeColor} />
      <Nose style={config.noseStyle} />
      <Mouth style={config.mouthStyle} />
      <circle cx="112" cy="151" r="8" fill="#d97b74" opacity="0.08" />
      <circle cx="188" cy="151" r="8" fill="#d97b74" opacity="0.08" />
    </g>
  );
}
