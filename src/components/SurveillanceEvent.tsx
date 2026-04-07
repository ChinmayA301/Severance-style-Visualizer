import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

export const SURVEILLANCE_SUBJECTS = [
  'milchick',
  'harmony',
  'mark',
  'dylan',
  'irving',
  'helly',
  'casey'
];

export const LUMON_QUOTES = [
  "A handshake is available upon request.",
  "Please try to enjoy each equally.",
  "The work is mysterious and important.",
  "Render not my creation in miniature.",
  "Remember, you are entirely your own fault.",
  "Let not weakness live in your veins.",
  "Bullies are nothing but bull and lies.",
  "Praise Kier.",
  "Tame in me the tempers four.",
  "Illuminated above all others."
];

interface SurveillanceEventProps {
  subject: string;
  onComplete: () => void;
}

export default function SurveillanceEvent({ subject, onComplete }: SurveillanceEventProps) {
  const [stage, setStage] = useState<'intro' | 'active' | 'outro'>('intro');
  const [glitchActive, setGlitchActive] = useState(false);
  const [facePosition, setFacePosition] = useState<'left' | 'right'>('left');
  const [quote] = useState(() => LUMON_QUOTES[Math.floor(Math.random() * LUMON_QUOTES.length)]);

  useEffect(() => {
    // Sequence timing
    // 0 -> 300ms: intro fade in
    // 300 -> 2300ms: active display (expression changes in the middle)
    // 2300 -> 2800ms: signal loss fade out
    
    const activeTimer = setTimeout(() => {
      setStage('active');
    }, 300);

    const outroTimer = setTimeout(() => {
      setStage('outro');
    }, 2300);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    // Hard switch to distorted expression via signal cut at ~1400ms
    const expressionShiftTimer = setTimeout(() => {
      setFacePosition('right');
    }, 1400);

    // Micro-glitch randomizer
    const glitchInterval = setInterval(() => {
      // More aggressive glitching around the transition time (1300 - 1500ms)
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 30 + Math.random() * 80);
      }
    }, 180);

    // Extra targeted glitch right at the shift for maximum eeriness
    const targetedGlitchTimer = setTimeout(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 1350);

    return () => {
      clearTimeout(activeTimer);
      clearTimeout(outroTimer);
      clearTimeout(completeTimer);
      clearTimeout(expressionShiftTimer);
      clearTimeout(targetedGlitchTimer);
      clearInterval(glitchInterval);
    };
  }, [onComplete]);

  const isOutro = stage === 'outro';

  // Flashing between left and right during a glitch right at the transition point adds to the VHS instability
  const currentFacePosition = (glitchActive && stage === 'active' && Math.random() > 0.5) 
    ? (facePosition === 'left' ? 'right' : 'left') 
    : facePosition;

  return createPortal((
    <div 
      className={`fixed inset-0 z-[999999] bg-black flex items-center justify-center pointer-events-none overflow-hidden transition-opacity ${isOutro ? 'duration-500 opacity-0' : 'duration-300 opacity-100'}`}
      style={{
        // Cold, low-saturation corporate tones globally applied to the container
        filter: 'sepia(0.2) hue-rotate(170deg) saturate(0.4) contrast(1.2)'
      }}
    >
      <style>{`
        @keyframes flicker {
          0% { opacity: 0.9; }
          5% { opacity: 0.8; }
          10% { opacity: 0.95; }
          15% { opacity: 0.85; }
          20% { opacity: 0.9; }
          25% { opacity: 0.8; }
          30% { opacity: 1; }
          35% { opacity: 0.7; }
          40% { opacity: 0.9; }
          45% { opacity: 0.85; }
          50% { opacity: 0.95; }
          55% { opacity: 0.8; }
          60% { opacity: 0.9; }
          65% { opacity: 0.85; }
          70% { opacity: 0.95; }
          75% { opacity: 0.8; }
          80% { opacity: 0.9; }
          85% { opacity: 0.85; }
          90% { opacity: 0.95; }
          95% { opacity: 0.8; }
          100% { opacity: 0.9; }
        }
        .analog-flicker {
          animation: flicker 0.15s infinite alternate;
        }
        .crt-scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
        }
        .noise-overlay {
          background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.1"/%3E%3C/svg%3E');
        }
      `}</style>

      {/* Noise and Scanlines Overlay */}
      <div className="absolute inset-0 noise-overlay mix-blend-overlay opacity-40 z-10" />
      <div className="absolute inset-0 crt-scanlines z-10 pointer-events-none opacity-50" />

      {/* Main Face Container */}
      <div 
        className="relative w-full h-full md:w-[80vw] md:h-[100vh] lg:w-[60vw]"
        style={{
          margin: '0 auto',
        }}
      >
        {/* Single Image Face to avoid overlapping opacity distortion */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/surveillance/surveillance_${subject}.png)`,
            backgroundSize: '200% 100%',
            backgroundPosition: `${currentFacePosition} center`,
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'lighten', // Perfectly erases hallucinated backgrounds
            opacity: stage !== 'outro' ? 1 : 0,
            transition: 'opacity 0.2s', // slight transition for intro, but hard cut for face pos
            transform: glitchActive ? 'translate(-2px, 1px) scale(1.02)' : 'translate(0, 0) scale(1)', // Jitter
            filter: glitchActive ? 'brightness(1.5) contrast(1.8)' : 'brightness(1) contrast(1)',
          }}
        />

        {/* Chromatic Aberration Layers (only active during glitches) */}
        <div 
          className={`absolute inset-0 mix-blend-screen transition-opacity duration-100 ${glitchActive ? 'opacity-70 analog-flicker' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(/surveillance/surveillance_${subject}.png)`,
            backgroundSize: '200% 100%',
            backgroundPosition: `${currentFacePosition} center`,
            backgroundRepeat: 'no-repeat',
            transform: 'translate(-8px, 0)',
            filter: 'hue-rotate(-50deg) saturate(2)', // Red shift
          }}
        />
        <div 
          className={`absolute inset-0 mix-blend-screen transition-opacity duration-100 ${glitchActive ? 'opacity-70 analog-flicker' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(/surveillance/surveillance_${subject}.png)`,
            backgroundSize: '200% 100%',
            backgroundPosition: `${currentFacePosition} center`,
            backgroundRepeat: 'no-repeat',
            transform: 'translate(8px, 0)',
            filter: 'hue-rotate(50deg) saturate(2)', // Cyan shift
          }}
        />
      </div>

      {/* Flashing Lumon Handbook Quote */}
      <div className="absolute bottom-8 md:bottom-16 left-0 w-full z-20 flex justify-center pointer-events-none px-8">
        <div 
          className="text-center font-mono uppercase tracking-[0.25em] font-bold text-sm md:text-xl"
          style={{
            color: 'var(--color-lumon-green, #4ade80)',
            textShadow: '0 0 8px rgba(74,222,128,0.8), 0 0 16px rgba(74,222,128,0.5)',
            opacity: stage !== 'outro' && glitchActive ? 0.9 : (stage !== 'outro' ? 0.3 : 0),
            transition: 'opacity 0.1s',
            animation: glitchActive ? 'flicker 0.1s infinite alternate' : 'none'
          }}
        >
          {quote}
        </div>
      </div>

    </div>
  ), document.body);
}
