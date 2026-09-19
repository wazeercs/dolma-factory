import { useEffect, useRef, useState } from 'react';

export default function useAudioAlarm(active) {
  const ctxRef = useRef(null);
  const oscRef = useRef(null);
  const intervalRef = useRef(null);
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('dolma_alarm_enabled') === 'true'; }
    catch { return false; }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (enabled && !ready) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new AudioCtx();
        setReady(true);
      } catch (e) { console.warn('Audio init failed:', e); }
    }
  }, [enabled, ready]);

  const initAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!ctxRef.current) ctxRef.current = new AudioCtx();
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      const o = ctxRef.current.createOscillator();
      const g = ctxRef.current.createGain();
      g.gain.value = 0.001;
      o.connect(g); g.connect(ctxRef.current.destination);
      o.start(); o.stop(ctxRef.current.currentTime + 0.05);
      setEnabled(true); setReady(true);
      localStorage.setItem('dolma_alarm_enabled', 'true');
      return true;
    } catch (e) { console.error('Audio init error:', e); return false; }
  };

  const disableAudio = () => {
    setEnabled(false); setReady(false);
    localStorage.setItem('dolma_alarm_enabled', 'false');
  };

  useEffect(() => {
    if (!active || !ready || !enabled || !ctxRef.current) return;
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {
        setReady(false); setEnabled(false);
        localStorage.setItem('dolma_alarm_enabled', 'false');
      });
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 900;
    gain.gain.value = 0.15;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); oscRef.current = osc;
    intervalRef.current = setInterval(() => {
      if (!oscRef.current) return;
      oscRef.current.frequency.setValueAtTime(900, ctx.currentTime);
      setTimeout(() => {
        if (oscRef.current) oscRef.current.frequency.setValueAtTime(500, ctx.currentTime);
      }, 200);
    }, 400);
    return () => {
      clearInterval(intervalRef.current);
      try { osc.stop(); osc.disconnect(); } catch (e) {}
      oscRef.current = null;
    };
  }, [active, ready, enabled]);

  return { initAudio, disableAudio, enabled, ready };
}
