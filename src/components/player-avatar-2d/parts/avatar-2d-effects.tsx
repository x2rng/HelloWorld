import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DEffects({ state }: Avatar2DLayerProps) {
  if (state !== "achievement") return null;

  return (
    <g aria-label="Achievement celebration">
      <path
        d="M83 128L87 140L99 144L87 148L83 160L79 148L67 144L79 140Z"
        fill="#FFD98A"
      />
      <path
        d="M278 186L282 197L293 201L282 205L278 216L274 205L263 201L274 197Z"
        fill="#8FE0D2"
      />
      <path
        d="M279 87L282 95L290 98L282 101L279 109L276 101L268 98L276 95Z"
        fill="#AFA4FF"
      />
      <circle cx="89" cy="201" r="5" fill="#AFA4FF" />
      <circle cx="270" cy="133" r="4" fill="#FFD98A" />
    </g>
  );
}
