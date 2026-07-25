import { getColorScale, getSkinScale } from "@/components/avatar-v3/avatar-color";
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
  const skin = getSkinScale(config.skinTone);

  return (
    <g>
      <ellipse
        cx={94 + ears.offset}
        cy="126"
        rx={ears.rx}
        ry={ears.ry}
        fill={skin.base}
      />
      <ellipse
        cx={206 - ears.offset}
        cy="127"
        rx={ears.rx}
        ry={ears.ry}
        fill={skin.shadow}
      />
      <path
        d={`M${91 + ears.offset} 124 Q${97 + ears.offset} 119 ${
          99 + ears.offset
        } 132`}
        fill="none"
        stroke={skin.deepShadow}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.34"
      />
      <path
        d={`M${209 - ears.offset} 124 Q${203 - ears.offset} 119 ${
          201 - ears.offset
        } 133`}
        fill="none"
        stroke={skin.deepShadow}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />

      <path d={facePath(config.faceShape)} fill={skin.base} />
      <path
        d="M174 52 Q206 65 204 106 V139 Q199 180 164 198 Q183 168 181 130 Q185 84 174 52Z"
        fill={skin.shadow}
        opacity="0.46"
      />
      <path
        d="M111 70 Q126 54 146 54 Q122 72 113 109 Q106 132 111 153 Q98 129 101 100 Q102 80 111 70Z"
        fill={skin.highlight}
        opacity="0.38"
      />
      <path
        d="M115 168 Q128 195 151 201 Q174 197 187 175 Q178 204 150 209 Q120 202 108 176Z"
        fill={skin.deepShadow}
        opacity="0.17"
      />
      <ellipse cx="118" cy="151" rx="13" ry="8" fill={skin.blush} opacity="0.2" />
      <ellipse cx="181" cy="152" rx="12" ry="7" fill={skin.blush} opacity="0.13" />
    </g>
  );
}

function eyePath(
  x: number,
  y: number,
  shape: AvatarConfig["eyeShape"],
) {
  if (shape === "round")
    return `M${x - 13} ${y} Q${x} ${y - 12} ${x + 13} ${y} Q${x} ${
      y + 12
    } ${x - 13} ${y}Z`;
  if (shape === "narrow")
    return `M${x - 15} ${y + 1} Q${x} ${y - 6} ${x + 15} ${y} Q${x} ${
      y + 7
    } ${x - 15} ${y + 1}Z`;
  if (shape === "lifted")
    return `M${x - 14} ${y + 4} Q${x} ${y - 10} ${x + 15} ${
      y - 3
    } Q${x} ${y + 10} ${x - 14} ${y + 4}Z`;
  if (shape === "relaxed")
    return `M${x - 14} ${y - 3} Q${x} ${y - 8} ${x + 14} ${y + 1} Q${x} ${
      y + 10
    } ${x - 14} ${y - 3}Z`;
  if (shape === "soft")
    return `M${x - 13} ${y} Q${x} ${y - 9} ${x + 13} ${y} Q${x} ${
      y + 10
    } ${x - 13} ${y}Z`;
  return `M${x - 14} ${y} Q${x} ${y - 10} ${x + 14} ${y} Q${x} ${
    y + 10
  } ${x - 14} ${y}Z`;
}

function Eye({
  x,
  y,
  shape,
  color,
  mirror = false,
}: {
  x: number;
  y: number;
  shape: AvatarConfig["eyeShape"];
  color: string;
  mirror?: boolean;
}) {
  const iris = getColorScale(color);
  const path = eyePath(x, y, shape);
  const irisRadius = shape === "narrow" ? 5 : 7;

  return (
    <g>
      <path d={path} fill="#f8f4ed" />
      <path
        d={`M${x - 14} ${y} Q${x} ${y - 10} ${x + 14} ${y}`}
        fill="none"
        stroke="#3f302d"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.62"
      />
      <circle cx={x} cy={y + 0.5} r={irisRadius} fill={iris.base} />
      <path
        d={`M${x - 5} ${y - 2} Q${x} ${y - 7} ${x + 4} ${y - 2}`}
        fill={iris.highlight}
        opacity="0.68"
      />
      <circle cx={x} cy={y + 0.5} r="3.1" fill={iris.deepShadow} />
      <circle
        cx={x + (mirror ? 2 : -2)}
        cy={y - 2.5}
        r="1.5"
        fill="#fff"
        opacity="0.9"
      />
      <path
        d={`M${x - 10} ${y + 7} Q${x} ${y + 10} ${x + 9} ${y + 6}`}
        fill="none"
        stroke="#6e514b"
        strokeWidth="1.2"
        opacity="0.22"
      />
    </g>
  );
}

function eyebrowPath(
  style: AvatarConfig["eyebrowStyle"],
  x: number,
  y: number,
  mirror = false,
) {
  const direction = mirror ? -1 : 1;
  if (style === "straight")
    return `M${x - 14} ${y} Q${x} ${y - 3} ${x + 14} ${y}`;
  if (style === "arched")
    return `M${x - 15} ${y + 3} Q${x} ${y - 11} ${x + 15} ${y + 1}`;
  if (style === "soft")
    return `M${x - 14} ${y + 2} Q${x} ${y - 6} ${x + 14} ${y + 1}`;
  if (style === "bold")
    return `M${x - 16} ${y + direction} Q${x} ${y - 9} ${x + 16} ${y}`;
  return `M${x - 15} ${y + 2} Q${x} ${y - 7} ${x + 15} ${y + 1}`;
}

function Nose({
  style,
  skinTone,
}: {
  style: AvatarConfig["noseStyle"];
  skinTone: string;
}) {
  const skin = getSkinScale(skinTone);
  const paths: Record<AvatarConfig["noseStyle"], string> = {
    straight: "M151 120 Q149 136 148 151 Q153 156 160 153",
    rounded: "M150 122 Q143 147 151 155 Q159 158 164 151",
    defined: "M153 120 L144 151 Q151 160 163 153",
    small: "M149 138 Q149 151 158 152",
    soft: "M151 125 Q145 147 153 154 Q159 155 162 151",
  };

  return (
    <g>
      <path
        d={paths[style]}
        fill="none"
        stroke={skin.deepShadow}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.46"
      />
      <path
        d="M146 127 Q141 142 143 148"
        fill="none"
        stroke={skin.highlight}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.48"
      />
      <ellipse cx="154" cy="155" rx="8" ry="3" fill={skin.shadow} opacity="0.16" />
    </g>
  );
}

function Mouth({
  style,
  skinTone,
}: {
  style: AvatarConfig["mouthStyle"];
  skinTone: string;
}) {
  const skin = getSkinScale(skinTone);
  const curves: Record<AvatarConfig["mouthStyle"], [string, string]> = {
    calm: ["M137 170 Q150 173 163 169", "M138 171 Q150 178 162 170"],
    warm: ["M136 168 Q150 176 164 168", "M138 171 Q150 182 163 170"],
    smile: ["M134 166 Q150 177 166 166", "M136 169 Q150 186 164 169"],
    focused: ["M138 171 Q150 169 162 171", "M139 173 Q150 176 161 172"],
    soft: ["M137 168 Q150 174 163 168", "M138 170 Q150 180 162 170"],
    confident: ["M136 169 Q149 175 164 167", "M138 171 Q150 179 163 169"],
  };

  return (
    <g>
      <path
        d={curves[style][0]}
        fill="none"
        stroke={skin.deepShadow}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.63"
      />
      <path
        d={curves[style][1]}
        fill={skin.blush}
        stroke={skin.blush}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.48"
      />
      {style === "smile" ? (
        <path
          d="M140 171 Q150 177 160 171"
          fill="none"
          stroke="#fff7ee"
          strokeWidth="2"
          opacity="0.72"
        />
      ) : null}
    </g>
  );
}

export function FaceFeatureLayer({ config }: { config: AvatarConfig }) {
  const eyebrows = getColorScale(config.eyebrowColor);
  const eyebrowWidth = config.eyebrowStyle === "bold" ? 5 : 3.2;

  return (
    <g>
      <path
        d={eyebrowPath(config.eyebrowStyle, 122, 96)}
        fill="none"
        stroke={eyebrows.base}
        strokeWidth={eyebrowWidth}
        strokeLinecap="round"
      />
      <path
        d={eyebrowPath(config.eyebrowStyle, 178, 97, true)}
        fill="none"
        stroke={eyebrows.shadow}
        strokeWidth={eyebrowWidth}
        strokeLinecap="round"
      />
      <Eye x={122} y={116} shape={config.eyeShape} color={config.eyeColor} />
      <Eye
        x={178}
        y={117}
        shape={config.eyeShape}
        color={config.eyeColor}
        mirror
      />
      <Nose style={config.noseStyle} skinTone={config.skinTone} />
      <Mouth style={config.mouthStyle} skinTone={config.skinTone} />
    </g>
  );
}
