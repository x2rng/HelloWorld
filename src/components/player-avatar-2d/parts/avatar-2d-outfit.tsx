import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DOutfit({ palette, pose, ids }: Avatar2DLayerProps) {
  const side = pose === "side";

  return (
    <g aria-label="Modern overshirt">
      <path
        d={
          side
            ? "M153 267C163 257 174 254 184 255L180 282L166 297L151 287Z"
            : "M142 266C154 256 167 253 181 255L177 283L159 299L139 286Z"
        }
        fill={`url(#${ids.jacket})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M184 255C195 254 207 258 215 269L216 290L199 298L181 282Z"
            : "M183 255C200 253 215 258 226 267L229 288L207 299L181 283Z"
        }
        fill={`url(#${ids.jacket})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M151 284C146 306 146 345 152 373C160 378 170 381 181 381L181 282L166 295Z"
            : "M138 284C130 309 131 350 141 377C152 382 166 385 182 385L182 282L159 298Z"
        }
        fill={`url(#${ids.jacket})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M181 282L199 296L216 289C221 314 219 349 211 374C202 379 191 381 181 381Z"
            : "M182 282L207 299L228 287C237 313 235 351 225 378C214 382 199 385 182 385Z"
        }
        fill={`url(#${ids.jacket})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M154 270C146 274 141 286 139 304L160 311L171 285Z"
            : "M144 269C129 272 119 283 114 302L141 314L159 288Z"
        }
        fill={palette.overshirt}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M210 271C220 276 225 287 226 304L207 311L195 286Z"
            : "M221 269C237 273 247 284 251 302L224 314L205 288Z"
        }
        fill={palette.overshirtShadow}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M181 283L181 380"
            : "M182 283L182 384"
        }
        fill="none"
        stroke={palette.overshirtShadow}
        strokeWidth="4"
      />
      <path
        d={
          side
            ? "M157 329L176 328L176 350L158 350Z"
            : "M148 328L174 328L174 352L148 350Z"
        }
        fill={palette.overshirtShadow}
        opacity="0.72"
        stroke={palette.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M190 328L211 327L209 349L190 350Z"
            : "M192 328L218 327L217 350L192 352Z"
        }
        fill={palette.overshirtShadow}
        opacity="0.72"
        stroke={palette.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {[306, 329, 353].map((y) => (
        <circle
          key={y}
          cx={side ? 181 : 182}
          cy={y}
          r="3.2"
          fill={palette.undershirt}
          stroke={palette.outline}
          strokeWidth="1.5"
        />
      ))}
      <path
        d={
          side
            ? "M153 368C169 374 198 375 213 368"
            : "M140 371C163 378 204 378 226 371"
        }
        fill="none"
        stroke={palette.outline}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d={
          side
            ? "M157 288L172 299M208 288L196 299"
            : "M145 288L160 300M220 287L206 300"
        }
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.18"
      />
    </g>
  );
}
