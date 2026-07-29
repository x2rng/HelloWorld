import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DShoes({ palette, pose, ids }: Avatar2DLayerProps) {
  const side = pose === "side";

  return (
    <g aria-label="Shoes">
      <path
        d={
          side
            ? "M151 448C165 444 181 447 193 456L211 463C214 469 210 474 201 476C186 479 163 477 151 474C142 471 142 458 151 448Z"
            : "M132 448C145 444 162 446 176 454L181 468C174 476 159 480 137 477C124 476 118 470 122 461Z"
        }
        fill={`url(#${ids.shoe})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M188 450C202 445 217 448 228 457L244 465C246 471 241 475 233 477C218 479 198 477 188 474C181 471 181 458 188 450Z"
            : "M191 452C205 444 222 444 234 451L246 464C243 474 228 479 203 477C190 476 184 470 186 461Z"
        }
        fill={`url(#${ids.shoe})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M146 467C164 473 193 473 208 466M185 468C202 473 228 474 242 467"
            : "M125 465C141 472 164 473 178 465M190 465C205 472 229 472 242 465"
        }
        fill="none"
        stroke={palette.shoeAccent}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={
          side
            ? "M158 455L185 462M197 456L226 463"
            : "M138 455L166 462M202 457L231 461"
        }
        fill="none"
        stroke={palette.outline}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.58"
      />
    </g>
  );
}
