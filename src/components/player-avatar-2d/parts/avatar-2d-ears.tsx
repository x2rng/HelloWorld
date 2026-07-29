import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DEars({ palette, pose, ids }: Avatar2DLayerProps) {
  if (pose === "side") {
    return (
      <g aria-label="Ear">
        <path
          d="M139 150C126 147 121 158 126 172C130 185 140 190 149 181L153 158C150 153 145 151 139 150Z"
          fill={`url(#${ids.skinShade})`}
          stroke={palette.outline}
          strokeWidth="5"
        />
        <path
          d="M139 160C134 159 133 166 138 173C141 177 145 174 146 168"
          fill="none"
          stroke={palette.skinShadow}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    );
  }

  return (
    <g aria-label="Ears">
      <path
        d="M124 149C112 146 106 156 111 171C115 184 124 189 132 181L136 157C133 152 129 150 124 149Z"
        fill={`url(#${ids.skinShade})`}
        stroke={palette.outline}
        strokeWidth="5"
      />
      <path
        d={
          pose === "front"
            ? "M251 149C263 146 269 156 264 171C260 184 251 189 243 181L239 157C242 152 246 150 251 149Z"
            : "M250 148C261 147 266 156 261 169C258 181 249 186 242 178L239 156C242 152 246 149 250 148Z"
        }
        fill={`url(#${ids.skinShade})`}
        stroke={palette.outline}
        strokeWidth="5"
      />
      <path
        d="M123 159C118 158 117 166 122 173C125 176 129 173 130 167M251 159C256 158 257 166 252 173C249 176 245 173 244 167"
        fill="none"
        stroke={palette.skinShadow}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}
