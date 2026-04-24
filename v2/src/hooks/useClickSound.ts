import { useEffect, useRef } from "react";

export function useClickSound() {
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audio.current = new Audio("/click.mp3");
    audio.current.volume = 0.4;

    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, select, input[type='color']")) {
        const a = audio.current;
        if (!a) return;
        a.currentTime = 0;
        a.play().catch(() => {});
      }
    }

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}
