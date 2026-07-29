import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

type Avatar2DFaceProps = Avatar2DLayerProps & {
  eyeClassName?: string;
};

function EyeDetail({
  cx,
  cy,
  scale = 1,
  palette,
}: {
  cx: number;
  cy: number;
  scale?: number;
  palette: Avatar2DLayerProps["palette"];
}) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path
        d="M-20 1C-14-13 12-15 21-1C13 12-12 14-20 1Z"
        fill="#FFFDF7"
        stroke={palette.outline}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx="2" cy="0" rx="10.5" ry="12.5" fill={palette.eye} />
      <ellipse cx="3" cy="1" rx="5.2" ry="8" fill={palette.eyeDeep} />
      <ellipse cx="3.5" cy="2" rx="2.8" ry="5.2" fill="#11151E" />
      <circle cx="-1" cy="-4" r="3" fill="#FFFFFF" opacity="0.92" />
      <circle cx="7" cy="5" r="1.4" fill="#FFFFFF" opacity="0.58" />
      <path
        d="M-20 1C-11-11 12-13 21-1"
        fill="none"
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M-17 7C-8 13 10 13 18 5"
        fill="none"
        stroke={palette.skinShadow}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.48"
      />
    </g>
  );
}

export function Avatar2DFace({
  palette,
  pose,
  state,
  ids,
  eyeClassName,
}: Avatar2DFaceProps) {
  const happy = state === "happy" || state === "achievement";
  const focused = state === "focused";

  if (pose === "side") {
    return (
      <g aria-label="Face">
        <g className={eyeClassName}>
          <EyeDetail
            cx={211}
            cy={143}
            scale={0.94}
            palette={palette}
          />
        </g>
        <path
          d={focused ? "M189 119Q209 109 228 118" : "M190 118Q210 106 229 118"}
          fill="none"
          stroke={palette.hairShadow}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M236 153C247 160 248 171 235 176L227 175"
          fill="none"
          stroke={palette.skinShadow}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={happy ? "M208 198Q226 211 242 197" : "M210 201Q226 206 239 198"}
          fill="none"
          stroke="#713E48"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {happy ? (
          <path
            d="M214 200Q226 208 237 199Q232 215 222 213Q216 211 214 200Z"
            fill="#D87178"
            opacity="0.9"
          />
        ) : null}
      </g>
    );
  }

  const leftEyeX = pose === "front" ? 157 : 158;
  const rightEyeX = pose === "front" ? 217 : 218;

  return (
    <g aria-label="Face">
      <ellipse
        cx={pose === "front" ? 139 : 140}
        cy="181"
        rx="19"
        ry="10"
        fill={`url(#${ids.blush})`}
        opacity={happy ? 0.7 : 0.36}
      />
      <ellipse
        cx={pose === "front" ? 235 : 229}
        cy="180"
        rx="18"
        ry="9"
        fill={`url(#${ids.blush})`}
        opacity={happy ? 0.62 : 0.3}
      />

      <g className={eyeClassName}>
        <EyeDetail
          cx={leftEyeX}
          cy={145}
          scale={pose === "front" ? 1 : 1.02}
          palette={palette}
        />
        <EyeDetail
          cx={rightEyeX}
          cy={144}
          scale={pose === "front" ? 1 : 0.88}
          palette={palette}
        />
      </g>

      <path
        d={
          focused
            ? pose === "front"
              ? "M136 119Q155 110 175 118M198 118Q217 108 237 118"
              : "M136 118Q156 109 177 118M199 117Q217 108 234 117"
            : pose === "front"
              ? "M136 118Q156 106 176 117M198 117Q218 105 238 118"
              : "M136 117Q157 105 178 117M199 116Q218 104 235 117"
        }
        fill="none"
        stroke={palette.hairShadow}
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d={
          pose === "front"
            ? "M187 153C184 166 181 178 185 183C190 188 199 185 202 180"
            : "M193 151C191 166 188 178 193 184C198 188 207 185 210 179"
        }
        fill="none"
        stroke={palette.skinShadow}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={
          pose === "front"
            ? "M180 185Q189 190 200 185"
            : "M187 186Q198 191 208 185"
        }
        fill="none"
        stroke={palette.skinLight}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.72"
      />

      {happy ? (
        <>
          <path
            d={
              pose === "front"
                ? "M164 202Q188 220 212 201"
                : "M164 202Q190 220 215 200"
            }
            fill="#F5C3B3"
            stroke={palette.outline}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d={
              pose === "front"
                ? "M170 204Q188 213 207 203"
                : "M171 204Q191 213 210 202"
            }
            fill="none"
            stroke="#D46E79"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d={
              pose === "front"
                ? "M167 203Q188 211 210 202"
                : "M167 202Q190 211 213 200"
            }
            fill="none"
            stroke="#713E48"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d={
              pose === "front"
                ? "M176 207Q188 211 200 206"
                : "M177 206Q190 211 203 205"
            }
            fill="none"
            stroke="#D98787"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  );
}
