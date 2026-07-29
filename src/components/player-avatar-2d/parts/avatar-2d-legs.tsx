import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DLegs({ palette, pose, ids }: Avatar2DLayerProps) {
  const side = pose === "side";

  return (
    <g aria-label="Legs">
      <path
        d={
          side
            ? "M162 367C155 388 154 420 156 454L189 454C194 421 194 391 188 368Z"
            : "M133 365C128 391 130 423 137 456L174 456C178 425 178 394 173 368Z"
        }
        fill={`url(#${ids.trousers})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M181 368C181 394 186 425 194 455L225 452C225 421 218 389 207 365Z"
            : "M191 368C186 394 188 426 194 456L231 454C235 421 234 389 226 365Z"
        }
        fill={`url(#${ids.trousers})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M159 378C175 384 194 381 211 372"
            : "M137 379C165 388 203 388 228 377"
        }
        fill="none"
        stroke={palette.trousersShadow}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.68"
      />
      <path
        d={
          side
            ? "M184 385C183 409 187 431 194 451"
            : "M183 382C181 406 182 432 184 454"
        }
        fill="none"
        stroke={palette.trousersShadow}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.76"
      />
      <path
        d={
          side
            ? "M165 415C172 418 180 418 187 415"
            : "M140 419C150 423 160 423 170 419M197 419C207 423 219 422 228 417"
        }
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.1"
      />
    </g>
  );
}
