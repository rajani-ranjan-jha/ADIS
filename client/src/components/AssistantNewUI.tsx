import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { X, Mic, MicOff, MessageSquare } from 'lucide-react';

// ─── constants ───────────────────────────────────────────────────────────────
const COUNT  = 3800;
const RADIUS = 2.6;

// ─── 3D particle sphere ───────────────────────────────────────────────────────
const ParticleSphere = ({ amplitudeRef }) => {
  const ref = useRef(null);

  // Build geometry buffers once
  const { orig, pos, phases } = useMemo(() => {
    const orig   = new Float32Array(COUNT * 3);
    const pos    = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = Math.cbrt(Math.random()) * RADIUS;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      orig[i*3]   = pos[i*3]   = x;
      orig[i*3+1] = pos[i*3+1] = y;
      orig[i*3+2] = pos[i*3+2] = z;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { orig, pos, phases };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t   = clock.getElapsedTime();
    const amp = amplitudeRef.current;

    // Slow rotation
    ref.current.rotation.y = t * 0.14;
    ref.current.rotation.x = t * 0.07;

    // Displace particles outward based on voice amplitude + per-particle wave
    const attr = ref.current.geometry.attributes.position;
    const arr  = attr.array;
    for (let i = 0; i < COUNT; i++) {
      const ox = orig[i*3], oy = orig[i*3+1], oz = orig[i*3+2];
      // Each particle has its own oscillation phase so the sphere "breathes" unevenly
      const wave = 0.5 + 0.5 * Math.sin(t * 5.5 + phases[i]);
      const push = 1 + amp * 2.4 * wave;
      arr[i*3]   = ox * push;
      arr[i*3+1] = oy * push;
      arr[i*3+2] = oz * push;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={pos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.043}
        color="#5b9eff"
        transparent
        opacity={0.78}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// ─── corner bracket helper ────────────────────────────────────────────────────
const Corner = ({ t, b, l, r, color }) => (
  <div style={{
    position: 'absolute',
    width: 26, height: 26,
    zIndex: 20,
    ...(t !== undefined ? { top: t } : {}),
    ...(b !== undefined ? { bottom: b } : {}),
    ...(l !== undefined ? { left: l } : {}),
    ...(r !== undefined ? { right: r } : {}),
    borderTop:    t !== undefined ? `3.5px solid ${color}` : 'none',
    borderBottom: b !== undefined ? `3.5px solid ${color}` : 'none',
    borderLeft:   l !== undefined ? `3.5px solid ${color}` : 'none',
    borderRight:  r !== undefined ? `3.5px solid ${color}` : 'none',
    transition: 'border-color 0.4s',
  }} />
);

// ─── main component ────────────────────────────────────────────────────────────
export default function VoiceAssistantNewUI() {
  const [listening,   setListening]   = useState(false);
  const [showCC,      setShowCC]      = useState(true);
  const [transcript,  setTranscript]  = useState('');
  const [interim,     setInterim]     = useState('');

  const amplitudeRef = useRef(0);
  const analyserRef  = useRef(null);
  const dataRef      = useRef(null);
  const streamRef    = useRef(null);
  const recRef       = useRef(null);

  // ── Always-running RAF loop: reads analyser or slowly decays amplitude ──────
  useEffect(() => {
    let id;
    const loop = () => {
      if (analyserRef.current && dataRef.current) {
        analyserRef.current.getByteFrequencyData(dataRef.current);
        const sum = dataRef.current.reduce((a, b) => a + b, 0);
        const raw = sum / (dataRef.current.length * 255);
        // Exponential smoothing
        amplitudeRef.current = amplitudeRef.current * 0.80 + raw * 0.20;
      } else {
        amplitudeRef.current *= 0.88;  // decay when not listening
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      streamRef.current?.getTracks().forEach(t => t.stop());
      try { recRef.current?.stop(); } catch (_) {}
    };
  }, []);

  // ── Start mic + speech recognition ─────────────────────────────────────────
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Web Audio API for amplitude
      const ctx      = new AudioContext();
      const src      = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;
      dataRef.current     = new Uint8Array(analyser.frequencyBinCount);

      // Web Speech API for transcription
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const r = new SR();
        r.continuous      = true;
        r.interimResults  = true;
        r.lang            = 'en-US';
        r.onresult = (e) => {
          let fin = '', tmp = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) fin += e.results[i][0].transcript + ' ';
            else                       tmp += e.results[i][0].transcript;
          }
          if (fin) setTranscript(p => (p + fin).slice(-400));
          setInterim(tmp);
        };
        r.onerror = () => {};
        r.start();
        recRef.current = r;
      }

      setListening(true);
    } catch (e) {
      console.warn('Microphone access denied:', e);
    }
  };

  // ── Stop mic + recognition ──────────────────────────────────────────────────
  const stopListening = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current  = null;
    analyserRef.current = null;
    dataRef.current    = null;
    try { recRef.current?.stop(); } catch (_) {}
    recRef.current = null;
    setListening(false);
    setInterim('');
  };

  const handleMicToggle = () => listening ? stopListening() : startListening();

  const handleStop = () => {
    stopListening();
    setTranscript('');
    setInterim('');
  };

  // ── derived UI values ───────────────────────────────────────────────────────
  const accentBlue  = `rgba(96, 165, 250, 0.85)`;
  const dimBlue     = `rgba(30, 58, 138, 0.55)`;
  const cornerColor = listening ? accentBlue : dimBlue;
  const displayText = interim || transcript || (listening ? 'Listening...' : 'Say something...');

  return (
    <>
      {/* Pulse ring keyframe */}
      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(96,165,250,0.45), 0 0 24px rgba(59,130,246,0.35); }
          65%  { box-shadow: 0 0 0 14px rgba(96,165,250,0),   0 0 24px rgba(59,130,246,0.35); }
          100% { box-shadow: 0 0 0 0   rgba(96,165,250,0),   0 0 24px rgba(59,130,246,0.35); }
        }
        @keyframes blink-dot {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
      `}</style>

      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        width: '100%',
        minHeight: '100vh',
        background: '#06091a',
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        overflow: 'hidden',
      }}>

        {/* Soft radial background glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 45% at 50% 48%, rgba(20,42,110,0.28) 0%, transparent 72%)',
        }} />

        {/* ── Top-right Caption Toggle ── */}
        <button
          onClick={() => setShowCC(v => !v)}
          title={showCC ? 'Hide captions' : 'Show captions'}
          style={{
            position: 'absolute', top: 22, right: 22, zIndex: 30,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            background: showCC ? 'rgba(59,130,246,0.13)' : 'transparent',
            border: `1px solid ${showCC ? 'rgba(96,165,250,0.38)' : 'rgba(55,65,81,0.55)'}`,
            borderRadius: 8,
            color: showCC ? '#93c5fd' : '#4b5563',
            fontSize: 12, letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'all 0.25s',
          }}
        >
          <MessageSquare size={14} strokeWidth={1.6} />
          CC
        </button>

        {/* ── 3D Canvas with styled frame ── */}
        <div style={{
          position: 'relative',
          width: 300, height: 300,
          zIndex: 10,
          transition: 'box-shadow 0.5s',
          boxShadow: listening
            ? '0 0 70px rgba(59,130,246,0.18), inset 0 0 50px rgba(59,130,246,0.06)'
            : '0 0 20px rgba(10,20,50,0.5)',
        }}>

          

          

          <Canvas
            camera={{ position: [0, 0, 5.8], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            <ParticleSphere amplitudeRef={amplitudeRef} />
          </Canvas>
        </div>

        {/* ── Live status / caption text ── */}
        <div style={{
          zIndex: 10,
          minHeight: 30,
          maxWidth: 480,
          textAlign: 'center',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          {listening && (
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#60a5fa',
              display: 'inline-block', flexShrink: 0,
              animation: 'blink-dot 1s ease-in-out infinite',
            }} />
          )}
          {showCC ? (
            <p style={{
              color: interim ? '#a5c8fd' : '#3a5a9e',
              fontSize: 15, fontWeight: 400,
              letterSpacing: '0.05em', margin: 0,
              transition: 'color 0.25s',
            }}>
              {displayText}
            </p>
          ) : (
            <p style={{ color: '#252525', fontSize: 12, margin: 0 }}>
              Captions off
            </p>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 22,
          zIndex: 10, marginBottom: 40,
        }}>

          {/* Stop & clear button */}
          <button
            onClick={handleStop}
            aria-label="Stop and clear"
            style={{
              width: 54, height: 54, borderRadius: '50%',
              background: '#0c111e',
              border: '1px solid rgba(31,41,55,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#12192f'}
            onMouseLeave={e => e.currentTarget.style.background = '#0c111e'}
          >
            <X size={22} strokeWidth={1.5} style={{ color: '#4b5563' }} />
          </button>

          {/* Mic toggle — pulses when listening */}
          <button
            onClick={handleMicToggle}
            aria-label={listening ? 'Stop listening' : 'Start listening'}
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: listening ? 'rgba(59,130,246,0.18)' : '#0c111e',
              border: listening
                ? '2px solid rgba(96,165,250,0.6)'
                : '1px solid rgba(31,41,55,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.25s, border 0.25s',
              animation: listening ? 'pulse-ring 1.6s ease-out infinite' : 'none',
            }}
          >
            {listening
              ? <MicOff size={26} strokeWidth={1.5} style={{ color: '#60a5fa' }} />
              : <Mic    size={26} strokeWidth={1.5} style={{ color: '#4b5563' }} />
            }
          </button>
        </div>

      </div>
    </>
  );
}