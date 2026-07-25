import type { AvatarConfig } from "@/lib/avatar-config";
import {
  getAvatarGeometry,
  type AvatarGeometry,
} from "@/components/avatar-v3/avatar-geometry";

function bottomShape(
  style: AvatarConfig["bottomStyle"],
  geometry: AvatarGeometry,
) {
  const { hipLeft, hipRight, legWidth } = geometry;

  if (style === "skirt") {
    return `M${hipLeft} 344 Q150 354 ${hipRight} 344 L218 432 Q150 449 82 432Z`;
  }
  if (style === "relaxed") {
    return `M${hipLeft - 4} 344 Q150 354 ${hipRight + 4} 344 L${194 + legWidth / 2} 474 H154 L150 384 L146 474 H${106 - legWidth / 2}Z`;
  }
  if (style === "sport") {
    return `M${hipLeft} 344 Q150 352 ${hipRight} 344 L${185 + legWidth / 2} 468 H154 L150 387 L146 468 H${115 - legWidth / 2}Z`;
  }

  const taper = style === "tailored" ? 5 : style === "chino" ? 2 : 0;
  return `M${hipLeft} 344 Q150 352 ${hipRight} 344 L${180 + legWidth / 2 - taper} 474 H154 L150 385 L146 474 H${120 - legWidth / 2 + taper}Z`;
}

export function BodyBaseLayer({ config }: { config: AvatarConfig }) {
  const geometry = getAvatarGeometry(config.bodyPreset);
  const { shoulderLeft, shoulderRight, armWidth } = geometry;

  return (
    <g>
      <path
        d="M127 198 Q150 213 173 198 L171 238 Q150 255 129 238Z"
        fill={config.skinTone}
      />
      <path
        d={`M${shoulderLeft + 8} 240 Q${shoulderLeft - 19} 270 ${
          shoulderLeft - 21
        } 313 Q${shoulderLeft - 8} 346 ${shoulderLeft - 17} 390`}
        fill="none"
        stroke={config.skinTone}
        strokeWidth={armWidth}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderRight - 8} 240 Q${shoulderRight + 19} 270 ${
          shoulderRight + 21
        } 313 Q${shoulderRight + 8} 346 ${shoulderRight + 17} 390`}
        fill="none"
        stroke={config.skinTone}
        strokeWidth={armWidth}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderLeft - 21} 386 q-4 18 7 28 q11 4 17-9 q2-13-8-23Z`}
        fill={config.skinTone}
      />
      <path
        d={`M${shoulderRight + 21} 386 q4 18-7 28 q-11 4-17-9 q-2-13 8-23Z`}
        fill={config.skinTone}
      />
    </g>
  );
}

export function BottomLayer({ config }: { config: AvatarConfig }) {
  const geometry = getAvatarGeometry(config.bodyPreset);
  return (
    <g>
      <path
        d={bottomShape(config.bottomStyle, geometry)}
        fill={config.bottomColor}
      />
      {config.bottomStyle !== "skirt" ? (
        <>
          <path
            d="M150 385 V470"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {config.bottomStyle === "sport" ? (
            <path
              d="M111 360 H189"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : null}
        </>
      ) : null}
    </g>
  );
}

export function ShoeLayer({ config }: { config: AvatarConfig }) {
  const height =
    config.shoeStyle === "boots" ? 27 : config.shoeStyle === "runners" ? 15 : 12;
  const round = config.shoeStyle === "loafers" ? 5 : 10;
  const sole = config.shoeStyle === "runners" ? "#d9d8d3" : "#101216";

  return (
    <g>
      <path
        d={`M91 ${478 - height} H145 V484 Q132 496 88 491 Q80 486 91 ${
          478 - height
        }Z`}
        fill={config.shoeColor}
        stroke={sole}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={`M155 ${478 - height} H209 Q220 486 212 491 Q168 496 155 484Z`}
        fill={config.shoeColor}
        stroke={sole}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {config.shoeStyle === "sneakers" ||
      config.shoeStyle === "runners" ? (
        <g
          stroke="rgba(255,255,255,0.62)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d={`M104 ${478 - height + round} H133`} />
          <path d={`M167 ${478 - height + round} H196`} />
        </g>
      ) : null}
    </g>
  );
}
