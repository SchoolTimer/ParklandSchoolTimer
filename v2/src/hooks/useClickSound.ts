import { useEffect, useRef } from "react";

export function useClickSound() {
  const bufferRef = useRef<AudioBuffer | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    fetch("/click.mp3")
      .then((r) => r.arrayBuffer())
      .then((ab) => ctx.decodeAudioData(ab))
      .then((buf) => { bufferRef.current = buf; })
      .catch(() => {});

    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("button, a, select, input[type='color']")) return;
      const buf = bufferRef.current;
      const ctx = ctxRef.current;
      if (!buf || !ctx) return;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    }

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
      ctx.close();
    };
  }, []);
}
