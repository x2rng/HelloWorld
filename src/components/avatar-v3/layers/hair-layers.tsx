import { getColorScale } from "@/components/avatar-v3/avatar-color";
import type { AvatarConfig } from "@/lib/avatar-config";

function HairlineShadow({ color }: { color: string }) {
  return (
    <path
      d="M98 87 Q119 69 150 72 Q181 69 202 87 Q187 80 174 82 Q150 88 126 81 Q112 79 98 87Z"
      fill={color}
      opacity="0.3"
    />
  );
}

export function HairBackLayer({ config }: { config: AvatarConfig }) {
  const hair = getColorScale(config.hairColor);

  if (config.hairStyle === "long") {
    return (
      <g>
        <path
          d="M88 100 Q86 39 150 32 L145 70 Q111 72 105 108 L111 238 Q93 229 86 203Z"
          fill={hair.base}
        />
        <path
          d="M212 100 Q214 39 150 32 L155 70 Q189 72 195 108 L189 238 Q207 229 214 203Z"
          fill={hair.shadow}
        />
        <path
          d="M97 82 Q91 137 102 214"
          fill="none"
          stroke={hair.highlight}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.38"
        />
        <path
          d="M203 83 Q212 144 198 218"
          fill="none"
          stroke={hair.deepShadow}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.42"
        />
      </g>
    );
  }

  if (config.hairStyle === "bob") {
    return (
      <g>
        <path
          d="M89 98 Q89 39 150 36 L145 69 Q111 73 105 106 L108 190 Q95 186 89 170Z"
          fill={hair.base}
        />
        <path
          d="M211 98 Q211 39 150 36 L155 69 Q189 73 195 106 L192 190 Q205 186 211 170Z"
          fill={hair.shadow}
        />
        <path
          d="M98 78 Q94 126 103 170"
          fill="none"
          stroke={hair.highlight}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.42"
        />
      </g>
    );
  }

  if (config.hairStyle === "braids") {
    return (
      <g fill="none" strokeLinecap="round">
        <g stroke={hair.deepShadow} strokeWidth="12">
          <path d="M101 68 Q81 145 96 230" />
          <path d="M199 68 Q219 145 204 230" />
          <path d="M114 57 Q96 131 108 205" />
          <path d="M186 57 Q204 131 192 205" />
        </g>
        <g stroke={hair.base} strokeWidth="8">
          <path d="M99 67 Q83 144 98 228" />
          <path d="M197 67 Q215 144 202 228" />
          <path d="M112 56 Q99 130 110 203" />
          <path d="M184 56 Q201 130 190 203" />
        </g>
        <g stroke={hair.highlight} strokeWidth="2" opacity="0.56">
          <path d="M96 83 L105 94 M92 112 L102 124 M92 145 L103 157 M96 181 L106 191" />
          <path d="M204 83 L195 94 M208 112 L198 124 M208 145 L197 157 M204 181 L194 191" />
        </g>
      </g>
    );
  }

  return null;
}

export function HairFrontLayer({ config }: { config: AvatarConfig }) {
  const hair = getColorScale(config.hairColor);
  if (config.hairStyle === "none") return null;

  if (config.hairStyle === "fade") {
    return (
      <g>
        <path
          d="M97 88 Q105 43 151 42 Q195 43 203 88 Q186 70 150 71 Q114 70 97 88Z"
          fill={hair.shadow}
        />
        <path
          d="M105 75 Q116 47 151 47 Q176 47 190 63 Q159 53 127 65Z"
          fill={hair.highlight}
          opacity="0.34"
        />
        <HairlineShadow color={hair.deepShadow} />
      </g>
    );
  }

  if (config.hairStyle === "textured") {
    const clumps = [
      "M94 77 Q94 46 112 42 Q123 44 123 62 Q112 55 105 77Z",
      "M111 62 Q116 34 137 36 Q148 43 141 65 Q129 52 111 62Z",
      "M135 58 Q145 27 168 36 Q179 48 165 68 Q155 49 135 58Z",
      "M163 62 Q177 34 195 49 Q207 63 198 82 Q185 62 163 62Z",
    ];
    return (
      <g>
        <path
          d="M93 92 Q91 42 150 34 Q209 41 207 92 Q183 69 150 74 Q117 69 93 92Z"
          fill={hair.shadow}
        />
        {clumps.map((path, index) => (
          <path
            key={path}
            d={path}
            fill={index < 2 ? hair.highlight : hair.base}
            opacity={index === 0 ? 0.72 : 1}
          />
        ))}
        <HairlineShadow color={hair.deepShadow} />
      </g>
    );
  }

  if (config.hairStyle === "curly" || config.hairStyle === "coily") {
    const coily = config.hairStyle === "coily";
    const clumps = [
      { x: 97, y: 62, r: coily ? 13 : 16 },
      { x: 116, y: 48, r: coily ? 15 : 18 },
      { x: 138, y: 43, r: coily ? 16 : 19 },
      { x: 160, y: 42, r: coily ? 16 : 19 },
      { x: 182, y: 49, r: coily ? 15 : 18 },
      { x: 201, y: 65, r: coily ? 13 : 16 },
    ];
    return (
      <g>
        <path
          d="M91 94 Q90 39 150 34 Q210 39 209 94 Q187 70 150 74 Q113 70 91 94Z"
          fill={hair.shadow}
        />
        {clumps.map((clump, index) => (
          <g key={clump.x}>
            <circle
              cx={clump.x}
              cy={clump.y}
              r={clump.r}
              fill={index < 3 ? hair.base : hair.shadow}
            />
            <path
              d={`M${clump.x - clump.r / 2} ${clump.y - 3} Q${clump.x} ${
                clump.y - clump.r
              } ${clump.x + clump.r / 2} ${clump.y - 4}`}
              fill="none"
              stroke={hair.highlight}
              strokeWidth="3"
              strokeLinecap="round"
              opacity={index < 4 ? 0.48 : 0.22}
            />
          </g>
        ))}
        <HairlineShadow color={hair.deepShadow} />
      </g>
    );
  }

  if (config.hairStyle === "bun") {
    return (
      <g>
        <circle cx="154" cy="28" r="29" fill={hair.deepShadow} />
        <circle cx="149" cy="24" r="25" fill={hair.base} />
        <path
          d="M134 15 Q150 3 167 18"
          fill="none"
          stroke={hair.highlight}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M91 93 Q94 38 150 39 Q206 38 209 93 Q183 68 150 72 Q117 68 91 93Z"
          fill={hair.shadow}
        />
        <path
          d="M101 77 Q112 46 150 44 Q170 43 188 55 Q149 48 117 68Z"
          fill={hair.highlight}
          opacity="0.38"
        />
        <HairlineShadow color={hair.deepShadow} />
      </g>
    );
  }

  if (config.hairStyle === "side") {
    return (
      <g>
        <path
          d="M92 91 Q102 39 159 42 Q199 44 207 87 Q173 59 118 72 Q105 76 92 91Z"
          fill={hair.shadow}
        />
        <path
          d="M103 75 Q126 39 170 48 Q150 49 119 72Z"
          fill={hair.highlight}
          opacity="0.52"
        />
        <path
          d="M132 49 Q163 52 192 70"
          fill="none"
          stroke={hair.base}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <HairlineShadow color={hair.deepShadow} />
      </g>
    );
  }

  if (config.hairStyle === "bob" || config.hairStyle === "long") {
    return (
      <g>
        <path
          d="M90 91 Q94 37 150 36 Q206 37 210 91 Q187 64 151 71 Q121 65 90 91Z"
          fill={hair.shadow}
        />
        <path
          d="M101 75 Q116 41 151 41 Q168 41 183 49 Q150 43 119 69Z"
          fill={hair.highlight}
          opacity="0.43"
        />
        <path
          d="M147 39 Q153 57 151 71"
          fill="none"
          stroke={hair.deepShadow}
          strokeWidth="3"
          opacity="0.46"
        />
        <HairlineShadow color={hair.deepShadow} />
      </g>
    );
  }

  if (config.hairStyle === "braids") {
    return (
      <g>
        <path
          d="M91 92 Q94 36 150 35 Q206 36 209 92 Q184 66 150 70 Q116 66 91 92Z"
          fill={hair.shadow}
        />
        <path
          d="M99 77 Q113 41 148 40 Q169 39 187 51 Q150 43 116 69Z"
          fill={hair.highlight}
          opacity="0.34"
        />
        <path
          d="M107 46 Q106 82 119 97 M132 38 Q130 77 138 94 M158 37 Q161 75 157 94 M183 45 Q188 80 178 98"
          fill="none"
          stroke={hair.deepShadow}
          strokeWidth="3"
          opacity="0.62"
        />
        <HairlineShadow color={hair.deepShadow} />
      </g>
    );
  }

  return (
    <g>
      <path
        d="M94 91 Q102 42 150 42 Q198 42 206 91 Q181 70 150 73 Q119 70 94 91Z"
        fill={hair.shadow}
      />
      <path
        d="M103 75 Q120 45 151 47 Q174 45 192 63 Q158 50 123 67Z"
        fill={hair.highlight}
        opacity="0.48"
      />
      <path
        d="M120 52 Q143 44 165 51"
        fill="none"
        stroke={hair.base}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <HairlineShadow color={hair.deepShadow} />
    </g>
  );
}

export function FacialHairLayer({ config }: { config: AvatarConfig }) {
  const hair = getColorScale(config.facialHairColor);
  if (config.facialHairStyle === "none") return null;

  if (config.facialHairStyle === "stubble") {
    return (
      <g>
        <path
          d="M119 157 Q150 179 181 157 Q176 199 150 205 Q124 199 119 157Z"
          fill={hair.shadow}
          opacity="0.2"
        />
        <path
          d="M129 180 Q150 197 171 180"
          fill="none"
          stroke={hair.deepShadow}
          strokeWidth="2"
          strokeDasharray="2 5"
          opacity="0.35"
        />
      </g>
    );
  }

  if (config.facialHairStyle === "moustache") {
    return (
      <g>
        <path
          d="M132 162 Q143 155 150 164 Q157 155 168 162 Q159 174 150 167 Q141 174 132 162Z"
          fill={hair.base}
        />
        <path
          d="M136 161 Q143 160 149 165"
          fill="none"
          stroke={hair.highlight}
          strokeWidth="2"
          opacity="0.42"
        />
      </g>
    );
  }

  if (config.facialHairStyle === "goatee") {
    return (
      <g>
        <path
          d="M134 162 Q143 156 150 164 Q157 156 166 162 Q158 171 150 167 Q142 171 134 162Z"
          fill={hair.base}
        />
        <path
          d="M140 179 Q150 185 160 179 L157 201 Q150 208 143 201Z"
          fill={hair.shadow}
        />
        <path
          d="M145 183 Q150 190 155 183"
          fill="none"
          stroke={hair.highlight}
          strokeWidth="2"
          opacity="0.38"
        />
      </g>
    );
  }

  return (
    <g>
      <path
        d="M112 148 Q117 199 150 211 Q183 199 188 148 Q180 184 150 190 Q120 184 112 148Z"
        fill={hair.shadow}
        opacity="0.9"
      />
      <path
        d="M119 159 Q124 188 150 199 Q143 206 133 198 Q118 184 119 159Z"
        fill={hair.highlight}
        opacity="0.24"
      />
      <path
        d="M181 161 Q176 190 151 207"
        fill="none"
        stroke={hair.deepShadow}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.38"
      />
    </g>
  );
}
