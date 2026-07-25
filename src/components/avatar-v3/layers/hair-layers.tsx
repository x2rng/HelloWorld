import type { AvatarConfig } from "@/lib/avatar-config";

export function HairBackLayer({ config }: { config: AvatarConfig }) {
  if (config.hairStyle === "long") {
    return (
      <g fill={config.hairColor}>
        <path d="M88 100 Q86 39 150 32 L145 70 Q111 72 105 108 L111 238 Q93 229 86 203Z" />
        <path d="M212 100 Q214 39 150 32 L155 70 Q189 72 195 108 L189 238 Q207 229 214 203Z" />
      </g>
    );
  }
  if (config.hairStyle === "bob") {
    return (
      <g fill={config.hairColor}>
        <path d="M89 98 Q89 39 150 36 L145 69 Q111 73 105 106 L108 190 Q95 186 89 170Z" />
        <path d="M211 98 Q211 39 150 36 L155 69 Q189 73 195 106 L192 190 Q205 186 211 170Z" />
      </g>
    );
  }
  if (config.hairStyle === "braids") {
    return (
      <g
        fill="none"
        stroke={config.hairColor}
        strokeWidth="10"
        strokeLinecap="round"
      >
        <path d="M102 67 Q82 144 96 230" />
        <path d="M198 67 Q218 144 204 230" />
        <path d="M114 56 Q96 130 108 205" />
        <path d="M186 56 Q204 130 192 205" />
      </g>
    );
  }
  return null;
}

export function HairFrontLayer({ config }: { config: AvatarConfig }) {
  const color = config.hairColor;
  if (config.hairStyle === "none") return null;
  if (config.hairStyle === "fade") {
    return (
      <path
        d="M97 88 Q105 43 151 42 Q195 43 203 88 Q186 70 150 71 Q114 70 97 88Z"
        fill={color}
      />
    );
  }
  if (config.hairStyle === "textured") {
    return (
      <g fill={color}>
        <path d="M94 91 Q94 39 150 37 Q206 39 206 91 Q184 68 150 72 Q116 68 94 91Z" />
        {[101, 118, 136, 154, 172, 190].map((x, index) => (
          <circle key={x} cx={x} cy={index % 2 ? 51 : 59} r="12" />
        ))}
      </g>
    );
  }
  if (config.hairStyle === "curly" || config.hairStyle === "coily") {
    const radius = config.hairStyle === "coily" ? 12 : 14;
    return (
      <g fill={color}>
        <path d="M91 94 Q90 39 150 34 Q210 39 209 94 Q187 70 150 74 Q113 70 91 94Z" />
        {[94, 111, 129, 148, 167, 186, 204].map((x, index) => (
          <circle
            key={x}
            cx={x}
            cy={index % 2 ? 48 : 58}
            r={radius}
          />
        ))}
      </g>
    );
  }
  if (config.hairStyle === "bun") {
    return (
      <g fill={color}>
        <circle cx="150" cy="29" r="27" />
        <path d="M91 93 Q94 38 150 39 Q206 38 209 93 Q183 68 150 72 Q117 68 91 93Z" />
      </g>
    );
  }
  if (config.hairStyle === "side") {
    return (
      <path
        d="M92 91 Q102 39 159 42 Q199 44 207 87 Q173 59 118 72 Q105 76 92 91Z"
        fill={color}
      />
    );
  }
  if (config.hairStyle === "bob" || config.hairStyle === "long") {
    return (
      <path
        d="M90 91 Q94 37 150 36 Q206 37 210 91 Q187 64 151 71 Q121 65 90 91Z"
        fill={color}
      />
    );
  }
  if (config.hairStyle === "braids") {
    return (
      <g fill={color}>
        <path d="M91 92 Q94 36 150 35 Q206 36 209 92 Q184 66 150 70 Q116 66 91 92Z" />
        <path
          d="M107 46 Q106 82 119 97 M132 38 Q130 77 138 94 M158 37 Q161 75 157 94 M183 45 Q188 80 178 98"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="3"
        />
      </g>
    );
  }
  return (
    <g fill={color}>
      <path d="M94 91 Q102 42 150 42 Q198 42 206 91 Q181 70 150 73 Q119 70 94 91Z" />
      <path
        d="M112 58 Q134 48 157 51"
        fill="none"
        stroke="rgba(255,255,255,0.11)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

export function FacialHairLayer({ config }: { config: AvatarConfig }) {
  const color = config.facialHairColor;
  if (config.facialHairStyle === "none") return null;
  if (config.facialHairStyle === "stubble") {
    return (
      <path
        d="M119 157 Q150 179 181 157 Q176 199 150 205 Q124 199 119 157Z"
        fill={color}
        opacity="0.16"
      />
    );
  }
  if (config.facialHairStyle === "moustache") {
    return (
      <path
        d="M132 162 Q143 155 150 164 Q157 155 168 162 Q159 174 150 167 Q141 174 132 162Z"
        fill={color}
        opacity="0.82"
      />
    );
  }
  if (config.facialHairStyle === "goatee") {
    return (
      <g fill={color} opacity="0.78">
        <path d="M134 162 Q143 156 150 164 Q157 156 166 162 Q158 171 150 167 Q142 171 134 162Z" />
        <path d="M140 179 Q150 185 160 179 L157 201 Q150 208 143 201Z" />
      </g>
    );
  }
  return (
    <path
      d="M112 148 Q117 199 150 211 Q183 199 188 148 Q180 184 150 190 Q120 184 112 148Z"
      fill={color}
      opacity="0.76"
    />
  );
}
