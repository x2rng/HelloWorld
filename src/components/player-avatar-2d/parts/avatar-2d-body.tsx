import type { Avatar2DLayerProps } from "./avatar-2d-layer-types";

export function Avatar2DBody({ palette, pose, ids }: Avatar2DLayerProps) {
  const side = pose === "side";

  return (
    <g aria-label="Body">
      <path
        d={
          side
            ? "M148 284C138 301 133 337 136 375L137 410C138 424 147 432 156 427C163 423 164 415 162 404L164 340L174 297Z"
            : "M127 282C110 303 105 341 109 379L111 416C112 429 121 436 131 431C139 427 140 417 138 406L141 335L151 296Z"
        }
        fill={`url(#${ids.skin})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M213 288C228 308 232 342 226 379L223 410C222 423 214 431 205 426C198 422 197 414 199 402L198 338L188 298Z"
            : "M238 282C255 303 259 341 254 379L250 416C249 429 240 436 230 431C222 427 222 417 224 406L222 335L212 296Z"
        }
        fill={`url(#${ids.skin})`}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M154 263C168 249 193 248 208 265C222 281 225 319 220 351C217 370 208 381 181 382C154 381 145 369 143 349C140 315 142 279 154 263Z"
            : "M140 263C161 248 207 248 227 264C245 281 246 323 239 355C235 376 217 386 183 386C149 386 131 375 127 354C121 322 123 280 140 263Z"
        }
        fill={palette.undershirt}
        stroke={palette.outline}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={
          side
            ? "M150 290C151 269 163 258 180 256C166 272 162 314 165 367C150 360 146 337 150 290Z"
            : "M138 292C140 270 153 258 169 255C153 278 151 332 159 377C142 372 133 350 138 292Z"
        }
        fill={palette.skinLight}
        opacity="0.12"
      />
      <path
        d={
          side
            ? "M161 412C161 424 154 433 145 433C136 433 131 426 132 416C133 405 140 397 149 397C157 398 161 403 161 412Z"
            : "M139 416C139 430 131 439 121 438C111 438 105 430 107 419C109 408 116 399 126 400C135 400 139 406 139 416Z"
        }
        fill={palette.skin}
        stroke={palette.outline}
        strokeWidth="4"
      />
      <path
        d={
          side
            ? "M225 412C224 425 216 433 207 432C198 431 194 424 196 414C198 403 205 397 214 398C222 399 226 404 225 412Z"
            : "M253 416C252 430 244 439 234 438C224 438 218 430 220 419C222 408 229 399 239 400C248 400 253 406 253 416Z"
        }
        fill={palette.skin}
        stroke={palette.outline}
        strokeWidth="4"
      />
    </g>
  );
}
