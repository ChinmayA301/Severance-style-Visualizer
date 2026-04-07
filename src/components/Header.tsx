import React from 'react';
import ModeToggle from './ModeToggle';

export default function Header() {
  return (
    <header
      className="flex items-center justify-between px-8 py-5 border-b"
      style={{
        borderColor: 'var(--color-lumon-gray-100)',
        backgroundColor: 'var(--color-lumon-white)',
      }}
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-lumon-green)', boxShadow: '0 0 8px var(--color-lumon-green)' }}
        />
        <h1
          className="text-sm tracking-[0.3em] uppercase font-light"
          style={{ color: 'var(--color-lumon-gray-400)', fontFamily: 'var(--font-lumon)' }}
        >
          Lumon Industries
        </h1>
        <span
          className="text-xs tracking-[0.15em] uppercase"
          style={{ color: 'var(--color-lumon-gray-200)' }}
        >
          — Segment Architecture
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <ModeToggle />
      </div>
    </header>
  );
}
