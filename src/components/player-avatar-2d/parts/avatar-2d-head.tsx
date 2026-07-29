import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DHead({ palette, pose, ids }: Avatar2DLayerProps) {
  if (pose === "side") {
    return (
      <g aria-label="Head">
        <path
          d="M144 119C154 86 185 72 216 82C244 91 256 115 251 143C248 162 237 170 228 179C217 190 219 211 202 225C185 239 158 232 147 212C136 192 135 148 144 119Z"
          fill={`url(#${ids.skin})`}
          stroke={palette.outline}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M221 102C245 117 245 147 229 165C219 176 211 185 211 204C201 221 185 228 170 222C190 211 196 195 194 177C192 153 204 120 221 102Z"
          fill={palette.skinShadow}
          opacity="0.22"
        />
      </g>
    );
  }

  return (
    <g aria-label="Head">
      <path
        d={
          pose === "front"
            ? "M125 119C135 86 158 71 187 70C217 69 241 84 251 116C259 141 255 184 243 207C232 229 213 241 187 242C161 241 141 229 130 207C118 183 116 144 125 119Z"
            : "M124 119C135 86 159 70 190 70C221 70 244 87 253 119C260 144 253 184 240 208C228 230 209 241 184 240C157 239 138 225 128 202C118 179 116 144 124 119Z"
        }
        fill={`url(#${ids.skin})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          pose === "front"
            ? "M221 87C244 104 251 134 246 166C242 196 227 222 203 235C221 214 226 190 221 166C216 137 216 109 221 87Z"
            : "M221 85C247 104 253 135 247 169C241 201 225 225 201 236C217 216 221 193 217 170C213 141 214 108 221 85Z"
        }
        fill={palette.skinShadow}
        opacity="0.2"
      />
      <path
        d="M142 117C150 96 166 84 188 81C166 95 156 117 155 142C149 136 145 127 142 117Z"
        fill={palette.skinLight}
        opacity="0.36"
      />
    </g>
  );
}
