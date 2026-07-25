import { getColorScale, getSkinScale } from "@/components/avatar-v3/avatar-color";
import {
  getAvatarGeometry,
  type AvatarGeometry,
} from "@/components/avatar-v3/avatar-geometry";
import type { AvatarConfig } from "@/lib/avatar-config";

function bottomShape(
  style: AvatarConfig["bottomStyle"],
  geometry: AvatarGeometry,
) {
  const { hipLeft, hipRight, legWidth } = geometry;

  if (style === "skirt") {
    return `M${hipLeft} 344 Q150 354 ${hipRight} 344 L214 432 Q150 447 86 432Z`;
  }
  if (style === "relaxed") {
    return `M${hipLeft - 4} 344 Q150 354 ${hipRight + 4} 344 L${
      194 + legWidth / 2
    } 474 H154 L150 384 L146 474 H${106 - legWidth / 2}Z`;
  }
  if (style === "sport") {
    return `M${hipLeft} 344 Q150 352 ${hipRight} 344 L${
      185 + legWidth / 2
    } 468 H154 L150 387 L146 468 H${115 - legWidth / 2}Z`;
  }

  const taper = style === "tailored" ? 5 : style === "chino" ? 2 : 0;
  return `M${hipLeft} 344 Q150 352 ${hipRight} 344 L${
    180 + legWidth / 2 - taper
  } 474 H154 L150 385 L146 474 H${120 - legWidth / 2 + taper}Z`;
}

export function BodyBaseLayer({ config }: { config: AvatarConfig }) {
  const geometry = getAvatarGeometry(config.bodyPreset);
  const { shoulderLeft, shoulderRight, armWidth } = geometry;
  const skin = getSkinScale(config.skinTone);
  const leftArm = `M${shoulderLeft + 8} 240 Q${
    shoulderLeft - 19
  } 270 ${shoulderLeft - 21} 313 Q${shoulderLeft - 8} 346 ${
    shoulderLeft - 17
  } 390`;
  const rightArm = `M${shoulderRight - 8} 240 Q${
    shoulderRight + 19
  } 270 ${shoulderRight + 21} 313 Q${shoulderRight + 8} 346 ${
    shoulderRight + 17
  } 390`;

  return (
    <g>
      <path
        d="M127 197 Q150 211 173 197 L171 238 Q151 252 129 238Z"
        fill={skin.base}
      />
      <path
        d="M151 211 Q166 209 173 198 L171 238 Q160 246 151 248Z"
        fill={skin.shadow}
        opacity="0.52"
      />
      <path
        d="M134 225 Q150 237 166 225"
        fill="none"
        stroke={skin.deepShadow}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.22"
      />

      <path
        d={leftArm}
        fill="none"
        stroke={skin.base}
        strokeWidth={armWidth}
        strokeLinecap="round"
      />
      <path
        d={rightArm}
        fill="none"
        stroke={skin.shadow}
        strokeWidth={armWidth}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderLeft + 2} 252 Q${shoulderLeft - 12} 279 ${
          shoulderLeft - 12
        } 311`}
        fill="none"
        stroke={skin.highlight}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.42"
      />
      <path
        d={`M${shoulderRight + 12} 253 Q${shoulderRight + 27} 286 ${
          shoulderRight + 23
        } 315`}
        fill="none"
        stroke={skin.deepShadow}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.2"
      />
      <circle
        cx={shoulderLeft - 19}
        cy="315"
        r={armWidth / 2 - 1}
        fill={skin.shadow}
        opacity="0.2"
      />
      <circle
        cx={shoulderRight + 19}
        cy="315"
        r={armWidth / 2 - 1}
        fill={skin.deepShadow}
        opacity="0.2"
      />

      <path
        d={`M${shoulderLeft - 22} 383 Q${shoulderLeft - 29} 401 ${
          shoulderLeft - 17
        } 416 Q${shoulderLeft - 3} 420 ${shoulderLeft + 1} 404 Q${
          shoulderLeft + 1
        } 390 ${shoulderLeft - 9} 381Z`}
        fill={skin.base}
      />
      <path
        d={`M${shoulderRight + 22} 383 Q${shoulderRight + 29} 401 ${
          shoulderRight + 17
        } 416 Q${shoulderRight + 3} 420 ${shoulderRight - 1} 404 Q${
          shoulderRight - 1
        } 390 ${shoulderRight + 9} 381Z`}
        fill={skin.shadow}
      />
      <g
        fill="none"
        stroke={skin.deepShadow}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.32"
      >
        <path
          d={`M${shoulderLeft - 22} 405 Q${shoulderLeft - 15} 411 ${
            shoulderLeft - 8
          } 406`}
        />
        <path
          d={`M${shoulderRight + 22} 405 Q${shoulderRight + 15} 411 ${
            shoulderRight + 8
          } 406`}
        />
      </g>
    </g>
  );
}

export function BottomLayer({ config }: { config: AvatarConfig }) {
  const geometry = getAvatarGeometry(config.bodyPreset);
  const color = getColorScale(config.bottomColor);
  const { hipLeft, hipRight } = geometry;

  return (
    <g>
      <path d={bottomShape(config.bottomStyle, geometry)} fill={color.base} />
      <path
        d={`M150 350 Q180 350 ${hipRight} 344 L210 432 Q183 439 154 438 L150 385Z`}
        fill={color.shadow}
        opacity={config.bottomStyle === "skirt" ? 0.54 : 0.42}
      />
      <path
        d={`M${hipLeft + 4} 350 Q150 359 ${hipRight - 4} 350`}
        fill="none"
        stroke={color.deepShadow}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
      {config.bottomStyle !== "skirt" ? (
        <>
          <path
            d="M150 385 Q148 425 146 470"
            fill="none"
            stroke={color.deepShadow}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.46"
          />
          <path
            d="M112 394 Q124 402 137 397 M164 397 Q178 402 190 394"
            fill="none"
            stroke={color.highlight}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.28"
          />
          <path
            d="M104 448 Q122 456 140 450 M160 450 Q178 456 196 448"
            fill="none"
            stroke={color.deepShadow}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
          {config.bottomStyle === "chino" ||
          config.bottomStyle === "tailored" ? (
            <g
              fill="none"
              stroke={color.deepShadow}
              strokeWidth="2"
              opacity="0.45"
            >
              <path d="M112 360 Q125 371 139 361" />
              <path d="M161 361 Q176 371 188 360" />
            </g>
          ) : null}
          {config.bottomStyle === "sport" ? (
            <path
              d="M111 361 Q150 368 189 361"
              stroke={color.highlight}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.5"
            />
          ) : null}
        </>
      ) : (
        <>
          <path
            d="M101 421 Q150 435 202 421"
            fill="none"
            stroke={color.highlight}
            strokeWidth="2.5"
            opacity="0.28"
          />
          <path
            d="M129 359 Q123 395 118 428 M172 358 Q178 396 183 428"
            fill="none"
            stroke={color.deepShadow}
            strokeWidth="2"
            opacity="0.22"
          />
        </>
      )}
    </g>
  );
}

export function ShoeLayer({ config }: { config: AvatarConfig }) {
  const height =
    config.shoeStyle === "boots"
      ? 29
      : config.shoeStyle === "runners"
        ? 17
        : 13;
  const color = getColorScale(config.shoeColor);
  const top = 478 - height;

  return (
    <g>
      <path
        d={`M91 ${top} H145 V484 Q133 496 88 491 Q80 486 91 ${top}Z`}
        fill={color.base}
        stroke={color.deepShadow}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={`M155 ${top + 1} H209 Q220 486 212 491 Q168 496 155 484Z`}
        fill={color.shadow}
        stroke={color.deepShadow}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M87 487 Q116 492 145 485 M155 485 Q184 493 214 487"
        fill="none"
        stroke={config.shoeStyle === "runners" ? "#e5e3dc" : color.highlight}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.72"
      />
      {config.shoeStyle === "sneakers" ||
      config.shoeStyle === "runners" ? (
        <g
          fill="none"
          stroke={color.highlight}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.78"
        >
          <path d={`M102 ${top + 9} L135 ${top + 13}`} />
          <path d={`M165 ${top + 13} L198 ${top + 9}`} />
          <path d={`M108 ${top + 5} L128 ${top + 16}`} />
          <path d={`M192 ${top + 5} L172 ${top + 16}`} />
        </g>
      ) : null}
      {config.shoeStyle === "loafers" ? (
        <path
          d={`M101 ${top + 8} H136 M164 ${top + 9} H199`}
          stroke={color.highlight}
          strokeWidth="3"
          opacity="0.52"
        />
      ) : null}
    </g>
  );
}
