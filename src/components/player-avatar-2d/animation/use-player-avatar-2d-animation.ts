"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayerAvatar2DState } from "../config/player-avatar-2d-types";

export function usePlayerAvatar2DAnimation(
  requestedState: PlayerAvatar2DState,
) {
  const [blinking, setBlinking] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    const scheduleBlink = () => {
      timeoutRef.current = setTimeout(
        () => {
          if (!active || document.visibilityState !== "visible") {
            scheduleBlink();
            return;
          }

          setBlinking(true);
          timeoutRef.current = setTimeout(() => {
            if (!active) return;
            setBlinking(false);
            scheduleBlink();
          }, 140);
        },
        2600 + Math.random() * 2300,
      );
    };

    scheduleBlink();

    return () => {
      active = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    blinking,
    state: requestedState,
  };
}
