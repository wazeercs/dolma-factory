import { useEffect, useRef } from 'react';

export default function useAudioAlarm(active) {
  const ctxRef = useRef(null);
  const oscRef = useRef(null);
  const intervalRef = useRef(null);

  const initAudio = () => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    const o = ctxRef.current.createOscillator();
    const g = ctxRef.current.createGain();
    g.gain.value = 0.001;
    o.connect(g);
    g.connect(ctxRef.current.destination);
    o.start();
    o.stop(ctxRef.current.currentTime + 0.05);
  };

  useEffect(() => {
    if (!active || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 900;
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    oscRef.current = osc;

    intervalRef.current = setInterval(() => {
      if (!oscRef.current) return;
      oscRef.current.frequency.setValueAtTime(900, ctx.currentTime);
      setTimeout(() => {
        if (oscRef.current) {
          oscRef.current.frequency.setValueAtTime(500, ctx.currentTime);
        }
      }, 200);
    }, 400);

    return () => {
      clearInterval(intervalRef.current);
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
      oscRef.current = null;
    };
  }, [active]);

  return { initAudio };
}
