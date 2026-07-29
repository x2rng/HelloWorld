import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DNeck({ palette, pose, ids }: Avatar2DLayerProps) {
  return (
    <g aria-label="Neck">
      <path
        d={
          pose === "side"
            ? "M171 225C171 242 169 253 163 260C173 271 197 273 209 260C202 250 199 239 200 222Z"
            : "M160 220C163 240 161 251 153 260C166 275 205 276 218 260C208 251 207 239 210 217Z"
        }
        fill={`url(#${ids.skinShade})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          pose === "side"
            ? "M174 226C175 242 174 253 168 260C176 265 184 267 191 266C185 251 185 237 188 224Z"
            : "M166 224C169 242 167 254 161 260C169 268 180 270 189 269C181 254 181 237 184 221Z"
        }
        fill={palette.skinLight}
        opacity="0.34"
      />
    </g>
  );
}
