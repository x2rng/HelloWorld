import { getColorScale } from "@/components/avatar-v3/avatar-color";
import { getAvatarGeometry } from "@/components/avatar-v3/avatar-geometry";
import type { AvatarConfig } from "@/lib/avatar-config";

export function TopLayer({ config }: { config: AvatarConfig }) {
  const geometry = getAvatarGeometry(config.bodyPreset);
  const {
    shoulderLeft,
    shoulderRight,
    waistLeft,
    waistRight,
    armWidth,
  } = geometry;
  const color = getColorScale(config.topColor);
  const torso = `M${shoulderLeft} 238 Q150 208 ${shoulderRight} 238 L${
    waistRight + 7
  } 348 Q150 364 ${waistLeft - 7} 348Z`;
  const structured =
    config.topStyle === "oxford" ||
    config.topStyle === "polo" ||
    config.topStyle === "henley";

  return (
    <g>
      <path
        d={`M${shoulderLeft + 5} 243 Q${shoulderLeft - 7} 258 ${
          shoulderLeft - 10
        } 287`}
        fill="none"
        stroke={color.base}
        strokeWidth={armWidth + 7}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderRight - 5} 243 Q${shoulderRight + 7} 258 ${
          shoulderRight + 10
        } 287`}
        fill="none"
        stroke={color.shadow}
        strokeWidth={armWidth + 7}
        strokeLinecap="round"
      />
      <path d={torso} fill={color.base} />
      <path
        d={`M151 219 Q185 216 ${shoulderRight} 238 L${
          waistRight + 7
        } 348 Q169 358 151 357Z`}
        fill={color.shadow}
        opacity={structured ? 0.5 : 0.36}
      />
      <path
        d={`M${shoulderLeft + 6} 245 Q128 222 149 222`}
        fill="none"
        stroke={color.highlight}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d={`M${shoulderRight + 7} 278 Q${shoulderRight + 13} 286 ${
          shoulderRight + 18
        } 294`}
        fill="none"
        stroke={color.deepShadow}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.42"
      />

      {config.topStyle === "polo" || config.topStyle === "oxford" ? (
        <g>
          <path
            d="M128 227 L149 251 L142 268 L119 233Z"
            fill={color.highlight}
            opacity="0.76"
          />
          <path
            d="M172 227 L151 251 L158 268 L181 233Z"
            fill={color.shadow}
            opacity="0.82"
          />
          <path
            d="M150 251 V346"
            stroke={color.deepShadow}
            strokeWidth="2"
            opacity="0.36"
          />
          {config.topStyle === "oxford" ? (
            <g fill={color.highlight} opacity="0.7">
              <circle cx="151" cy="275" r="2" />
              <circle cx="151" cy="294" r="2" />
              <circle cx="151" cy="313" r="2" />
            </g>
          ) : null}
        </g>
      ) : null}

      {config.topStyle === "mock" ? (
        <g>
          <path
            d="M132 217 Q150 230 168 217 V244 Q150 253 132 244Z"
            fill={color.shadow}
          />
          <path
            d="M135 221 Q150 231 165 220"
            fill="none"
            stroke={color.highlight}
            strokeWidth="3"
            opacity="0.45"
          />
        </g>
      ) : null}

      {config.topStyle === "blouse" ? (
        <g>
          <path
            d="M127 226 Q150 255 173 226 L160 265 H140Z"
            fill={color.highlight}
            opacity="0.72"
          />
          <path
            d="M150 253 Q143 295 146 339 M153 253 Q161 298 157 339"
            fill="none"
            stroke={color.deepShadow}
            strokeWidth="2"
            opacity="0.24"
          />
        </g>
      ) : null}

      {config.topStyle === "henley" ? (
        <g>
          <path
            d="M141 225 H159 V272 H141Z"
            fill={color.shadow}
            opacity="0.64"
          />
          <path
            d="M150 229 V269"
            stroke={color.highlight}
            strokeWidth="2"
            opacity="0.48"
          />
          <circle cx="154" cy="244" r="2" fill={color.highlight} />
          <circle cx="154" cy="256" r="2" fill={color.highlight} />
        </g>
      ) : null}

      {config.topStyle === "knit" ? (
        <g
          fill="none"
          stroke={color.highlight}
          strokeLinecap="round"
          opacity="0.3"
        >
          <path
            d={`M${shoulderLeft + 10} 256 Q150 238 ${
              shoulderRight - 10
            } 256`}
            strokeWidth="4"
          />
          <path d="M115 302 Q150 309 185 302" strokeWidth="2" />
          <path d="M120 324 Q150 330 180 324" strokeWidth="2" />
        </g>
      ) : null}

      {config.topStyle === "sport" ? (
        <g>
          <path
            d={`M${shoulderLeft + 6} 245 L${waistRight} 343`}
            stroke={color.highlight}
            strokeWidth="7"
            opacity="0.28"
          />
          <path
            d={`M${shoulderRight - 3} 248 L${waistLeft + 10} 344`}
            stroke={color.deepShadow}
            strokeWidth="5"
            opacity="0.22"
          />
        </g>
      ) : null}

      <path
        d={`M${waistLeft - 5} 344 Q150 353 ${waistRight + 5} 344`}
        fill="none"
        stroke={color.deepShadow}
        strokeWidth="2"
        opacity="0.26"
      />
      <path
        d="M116 286 Q124 294 131 296 M184 288 Q176 296 168 299"
        fill="none"
        stroke={color.deepShadow}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={structured ? 0.38 : 0.22}
      />
    </g>
  );
}

export function OuterwearLayer({ config }: { config: AvatarConfig }) {
  if (config.outerwearStyle === "none") return null;
  const geometry = getAvatarGeometry(config.bodyPreset);
  const {
    shoulderLeft,
    shoulderRight,
    waistLeft,
    waistRight,
    armWidth,
  } = geometry;
  const color = getColorScale(config.outerwearColor);
  const openCenter =
    config.outerwearStyle === "blazer" ||
    config.outerwearStyle === "cardigan" ||
    config.outerwearStyle === "overshirt";

  return (
    <g>
      <path
        d={`M${shoulderLeft + 2} 244 Q${shoulderLeft - 13} 276 ${
          shoulderLeft - 16
        } 326`}
        fill="none"
        stroke={color.base}
        strokeWidth={armWidth + 10}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderRight - 2} 244 Q${shoulderRight + 13} 276 ${
          shoulderRight + 16
        } 326`}
        fill="none"
        stroke={color.shadow}
        strokeWidth={armWidth + 10}
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderLeft - 2} 239 Q112 219 136 224 L145 347 Q125 357 ${
          waistLeft - 10
        } 346Z`}
        fill={color.base}
      />
      <path
        d={`M${shoulderRight + 2} 239 Q188 219 164 224 L155 347 Q175 357 ${
          waistRight + 10
        } 346Z`}
        fill={color.shadow}
      />
      {!openCenter ? (
        <>
          <path
            d="M136 224 Q150 232 164 224 L171 346 Q150 357 129 346Z"
            fill={color.base}
          />
          <path
            d="M151 229 Q160 231 164 224 L171 346 Q161 353 151 355Z"
            fill={color.shadow}
            opacity="0.56"
          />
        </>
      ) : null}

      <path
        d={`M${shoulderLeft - 18} 315 Q${shoulderLeft - 8} 321 ${
          shoulderLeft + 1
        } 316 M${shoulderRight + 18} 315 Q${shoulderRight + 8} 321 ${
          shoulderRight - 1
        } 316`}
        fill="none"
        stroke={color.deepShadow}
        strokeWidth="4"
        opacity="0.46"
      />

      {config.outerwearStyle === "blazer" ? (
        <g>
          <path
            d="M136 224 L149 257 L140 285 L116 234Z"
            fill={color.highlight}
            opacity="0.62"
          />
          <path
            d="M164 224 L151 257 L160 285 L184 234Z"
            fill={color.deepShadow}
            opacity="0.58"
          />
          <path
            d="M120 303 H140 V319 H120Z M161 303 H181 V319 H161Z"
            fill="none"
            stroke={color.deepShadow}
            strokeWidth="2"
            opacity="0.48"
          />
          <circle cx="157" cy="308" r="3" fill={color.highlight} opacity="0.7" />
        </g>
      ) : null}

      {config.outerwearStyle === "overshirt" ? (
        <g fill="none" stroke={color.deepShadow} strokeWidth="2" opacity="0.48">
          <path d="M150 252 V346" />
          <rect x="114" y="274" width="27" height="28" rx="4" />
          <rect x="159" y="274" width="27" height="28" rx="4" />
          <path d="M115 284 H140 M160 284 H185" />
        </g>
      ) : null}

      {config.outerwearStyle === "cardigan" ? (
        <g>
          <path
            d="M146 230 V348 M154 230 V348"
            stroke={color.deepShadow}
            strokeWidth="3"
            opacity="0.44"
          />
          {[270, 292, 314].map((y) => (
            <circle
              key={y}
              cx="157"
              cy={y}
              r="2.4"
              fill={color.highlight}
              opacity="0.72"
            />
          ))}
        </g>
      ) : null}

      {config.outerwearStyle === "bomber" ? (
        <g>
          <path
            d="M126 342 Q150 352 174 342"
            stroke={color.deepShadow}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M130 341 Q150 347 170 341"
            stroke={color.highlight}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.42"
          />
          <path
            d="M150 229 V344"
            stroke={color.deepShadow}
            strokeWidth="3"
            opacity="0.45"
          />
        </g>
      ) : null}

      {config.outerwearStyle === "utility" ? (
        <g fill="none" stroke={color.deepShadow} strokeWidth="2" opacity="0.55">
          <rect x="110" y="276" width="29" height="28" rx="4" />
          <rect x="161" y="276" width="29" height="28" rx="4" />
          <path d="M111 286 H138 M162 286 H189 M150 232 V346" />
        </g>
      ) : null}

      <path
        d="M118 328 Q129 335 139 330 M181 328 Q171 335 161 330"
        fill="none"
        stroke={color.highlight}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
      />
    </g>
  );
}

export function GlassesLayer({ config }: { config: AvatarConfig }) {
  if (config.glassesStyle === "none") return null;
  const strokeWidth = config.glassesStyle === "bold" ? 5 : 3;
  const color = config.glassesStyle === "architect" ? "#6b7280" : "#20242b";
  const frame = getColorScale(color);

  if (config.glassesStyle === "round") {
    return (
      <g fill="none">
        <g stroke="#30231f" strokeWidth={strokeWidth + 2} opacity="0.14" transform="translate(1 2)">
          <circle cx="122" cy="116" r="17" />
          <circle cx="178" cy="117" r="17" />
        </g>
        <g stroke={frame.base} strokeWidth={strokeWidth}>
          <circle cx="122" cy="116" r="17" />
          <circle cx="178" cy="117" r="17" />
          <path d="M139 116 Q150 112 161 117" />
          <path d="M105 113 L95 110 M195 114 L205 111" />
        </g>
        <path
          d="M110 107 Q120 101 130 106 M166 108 Q177 102 187 107"
          stroke={frame.highlight}
          strokeWidth="2"
          opacity="0.62"
        />
      </g>
    );
  }

  const y = config.glassesStyle === "architect" ? 104 : 102;
  const height = config.glassesStyle === "architect" ? 22 : 27;
  const radius = config.glassesStyle === "classic" ? 10 : 5;
  return (
    <g fill="none">
      <g
        stroke="#30231f"
        strokeWidth={strokeWidth + 2}
        opacity="0.13"
        transform="translate(1 2)"
      >
        <rect x="103" y={y} width="38" height={height} rx={radius} />
        <rect x="159" y={y + 1} width="38" height={height} rx={radius} />
      </g>
      <g stroke={frame.base} strokeWidth={strokeWidth}>
        <rect x="103" y={y} width="38" height={height} rx={radius} />
        <rect x="159" y={y + 1} width="38" height={height} rx={radius} />
        <path d="M141 115 Q150 112 159 116" />
        <path d="M103 111 L95 108 M197 112 L205 109" />
      </g>
      <path
        d={`M108 ${y + 6} H128 M164 ${y + 7} H184`}
        stroke={frame.highlight}
        strokeWidth="2"
        opacity="0.62"
      />
    </g>
  );
}

export function AccessoryLayer({ config }: { config: AvatarConfig }) {
  if (config.accessoryStyle === "none") return null;
  const metal = getColorScale("#d7b56d");

  if (config.accessoryStyle === "studs") {
    return (
      <g>
        <circle cx="96" cy="136" r="4" fill={metal.shadow} />
        <circle cx="204" cy="137" r="4" fill={metal.shadow} />
        <circle cx="94.8" cy="134.8" r="1.5" fill={metal.highlight} />
        <circle cx="202.8" cy="135.8" r="1.5" fill={metal.highlight} />
      </g>
    );
  }
  if (config.accessoryStyle === "hoops") {
    return (
      <g fill="none" strokeWidth="3">
        <circle cx="94" cy="145" r="9" stroke={metal.base} />
        <circle cx="206" cy="146" r="9" stroke={metal.shadow} />
        <path d="M89 139 Q94 134 99 139" stroke={metal.highlight} />
      </g>
    );
  }
  if (config.accessoryStyle === "chain") {
    return (
      <g fill="none" strokeLinecap="round">
        <path
          d="M126 236 Q150 272 174 236"
          stroke={metal.shadow}
          strokeWidth="4"
        />
        <path
          d="M128 235 Q150 266 172 235"
          stroke={metal.highlight}
          strokeWidth="1.5"
          opacity="0.72"
        />
      </g>
    );
  }
  if (config.accessoryStyle === "scarf") {
    const scarf = getColorScale("#8c5b76");
    return (
      <g>
        <path
          d="M121 225 Q150 247 179 225 L170 274 Q150 259 130 274Z"
          fill={scarf.base}
        />
        <path
          d="M151 245 Q166 244 179 226 L170 274 Q160 264 151 260Z"
          fill={scarf.shadow}
        />
        <path
          d="M129 237 Q150 252 171 237"
          fill="none"
          stroke={scarf.highlight}
          strokeWidth="3"
          opacity="0.42"
        />
      </g>
    );
  }
  return (
    <g transform="rotate(-6 218 359)">
      <rect x="208" y="352" width="20" height="14" rx="6" fill="#24272e" />
      <circle cx="218" cy="359" r="6" fill={metal.shadow} />
      <circle cx="216.5" cy="357.5" r="2.5" fill={metal.highlight} />
    </g>
  );
}
