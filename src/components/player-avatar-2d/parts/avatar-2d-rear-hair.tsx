import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DRearHair({
  palette,
  pose,
  ids,
}: Avatar2DLayerProps) {
  if (pose === "side") {
    return (
      <g aria-label="Rear hair">
        <path
          d="M137 92C154 66 194 57 225 72C253 86 268 119 261 154C257 180 244 202 224 217C215 196 206 177 185 160C164 143 145 123 137 92Z"
          fill={`url(#${ids.hair})`}
          stroke={palette.outline}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M226 91C251 105 263 134 255 164C250 182 241 199 224 212C226 181 215 141 194 112Z"
          fill={palette.hairShadow}
          opacity="0.68"
        />
      </g>
    );
  }

  return (
    <g aria-label="Rear hair">
      <path
        d={
          pose === "front"
            ? "M116 112C124 74 155 55 190 57C229 59 257 84 263 123C267 151 260 186 245 211C228 197 211 191 190 191C168 191 147 199 128 213C117 185 109 145 116 112Z"
            : "M117 111C126 74 157 55 194 58C233 61 258 88 260 126C262 156 253 190 238 214C222 199 204 191 183 191C160 191 140 200 125 215C115 183 109 142 117 111Z"
        }
        fill={`url(#${ids.hair})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          pose === "front"
            ? "M231 78C258 102 264 142 251 187C243 171 236 151 223 127C213 108 210 91 214 72Z"
            : "M225 76C255 98 264 139 248 190C241 169 231 144 216 122C207 106 205 89 209 69Z"
        }
        fill={palette.hairShadow}
        opacity="0.72"
      />
      <path
        d="M130 94C142 75 159 65 181 62C160 78 150 96 148 120C142 112 136 104 130 94Z"
        fill={palette.hairLight}
        opacity="0.45"
      />
    </g>
  );
}
