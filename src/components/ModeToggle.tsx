import React from 'react';
import { useAppState } from '../context/AppContext';
import { Eye, BarChart3 } from 'lucide-react';

export default function ModeToggle() {
  const { viewMode, toggleViewMode } = useAppState();

  return (
    <button
      onClick={toggleViewMode}
      className="group flex items-center gap-2 px-4 py-2 border transition-all duration-300 cursor-pointer select-none"
      style={{
        borderColor: viewMode === 'analyst' ? 'var(--color-lumon-green)' : 'var(--color-lumon-gray-100)',
        backgroundColor: viewMode === 'analyst' ? 'rgba(51,255,0,0.04)' : 'transparent',
        color: viewMode === 'analyst' ? 'var(--color-lumon-green-dim)' : 'var(--color-lumon-gray-300)',
      }}
    >
      {viewMode === 'executive' ? (
        <Eye size={14} strokeWidth={1.5} />
      ) : (
        <BarChart3 size={14} strokeWidth={1.5} />
      )}
      <span
        className="text-xs tracking-[0.2em] uppercase font-medium"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {viewMode === 'executive' ? 'Executive' : 'Analyst'}
      </span>
    </button>
  );
}
