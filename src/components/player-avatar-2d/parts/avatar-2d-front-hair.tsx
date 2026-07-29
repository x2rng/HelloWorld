import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DFrontHair({
  palette,
  pose,
  ids,
}: Avatar2DLayerProps) {
  if (pose === "side") {
    return (
      <g aria-label="Front hair">
        <path
          d="M142 114C151 79 183 66 213 78C229 84 239 94 245 107C222 96 200 101 186 116C173 129 162 137 145 139Z"
          fill={`url(#${ids.hair})`}
          stroke={palette.outline}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M180 82C195 74 218 82 231 94C207 93 192 103 181 120C175 112 174 98 180 82Z"
          fill={palette.hairLight}
          opacity="0.55"
        />
        <path
          d="M143 114C149 97 159 86 174 79C162 97 161 116 168 134C159 139 151 141 144 139Z"
          fill={palette.hairShadow}
          opacity="0.64"
        />
      </g>
    );
  }

  return (
    <g aria-label="Front hair">
      <path
        d={
          pose === "front"
            ? "M121 124C125 82 155 61 189 62C224 62 251 84 254 122C236 104 220 96 202 94C181 91 164 98 151 113C140 125 131 132 121 136Z"
            : "M120 123C126 82 157 61 192 63C227 65 251 89 253 125C235 105 216 97 197 96C176 94 160 103 148 117C139 128 129 134 120 137Z"
        }
        fill={`url(#${ids.hair})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          pose === "front"
            ? "M154 76C169 65 190 62 207 67C184 74 170 91 168 112C159 103 153 91 154 76Z"
            : "M157 76C173 65 194 64 211 70C186 76 173 93 170 114C161 104 155 91 157 76Z"
        }
        fill={palette.hairLight}
        opacity="0.62"
      />
      <path
        d={
          pose === "front"
            ? "M205 69C228 76 244 95 251 119C232 103 215 97 198 95C204 87 207 78 205 69Z"
            : "M210 71C233 80 247 99 252 123C235 107 217 99 197 96C205 88 211 79 210 71Z"
        }
        fill={palette.hairShadow}
        opacity="0.58"
      />
      <path
        d={
          pose === "front"
            ? "M123 122C130 98 142 83 159 74C146 94 144 115 151 135C139 137 129 138 121 136Z"
            : "M122 121C130 97 143 82 160 74C147 95 145 116 150 136C138 139 128 139 120 137Z"
        }
        fill={palette.hairShadow}
        opacity="0.72"
      />
      <path
        d="M171 68C183 61 197 62 207 67"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.14"
      />
    </g>
  );
}
