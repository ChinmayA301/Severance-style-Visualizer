import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, X } from 'lucide-react';
import segments from '../data/segments';

interface ComparisonSelectorProps {
  onCompare: (ids: [string, string]) => void;
  onClose: () => void;
  preselectedId?: string;
}

export default function ComparisonSelector({ onCompare, onClose, preselectedId }: ComparisonSelectorProps) {
  const [selections, setSelections] = useState<string[]>(
    preselectedId ? [preselectedId] : []
  );

  const toggle = (id: string) => {
    setSelections((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const canCompare = selections.length === 2;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 110 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />
      <motion.div
        className="relative p-8"
        style={{
          backgroundColor: 'var(--color-lumon-white)',
          border: '1px solid var(--color-lumon-gray-100)',
          width: '520px',
          maxWidth: '90vw',
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ArrowLeftRight size={14} style={{ color: 'var(--color-lumon-gray-300)' }} />
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}
            >
              Select Two Segments
            </span>
          </div>
          <button onClick={onClose} className="cursor-pointer" style={{ color: 'var(--color-lumon-gray-300)' }}>
            <X size={14} />
          </button>
        </div>

        <div className="space-y-1 mb-8">
          {segments.map((seg) => {
            const isSelected = selections.includes(seg.id);
            return (
              <div
                key={seg.id}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? 'var(--color-lumon-offwhite)' : 'transparent',
                  borderLeft: isSelected ? `2px solid ${seg.color}` : '2px solid transparent',
                }}
                onClick={() => toggle(seg.id)}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isSelected ? seg.color : 'var(--color-lumon-gray-200)',
                  }}
                />
                <span
                  className="text-[11px] tracking-[0.08em] uppercase"
                  style={{
                    color: isSelected ? 'var(--color-lumon-gray-400)' : 'var(--color-lumon-gray-300)',
                    fontWeight: isSelected ? 500 : 300,
                  }}
                >
                  {seg.name}
                </span>
                {isSelected && (
                  <span
                    className="ml-auto text-[9px]"
                    style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}
                  >
                    {selections.indexOf(seg.id) === 0 ? 'A' : 'B'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="w-full py-3 text-[11px] tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer"
          style={{
            backgroundColor: canCompare ? 'var(--color-lumon-blue)' : 'var(--color-lumon-gray-100)',
            color: canCompare ? 'var(--color-lumon-white)' : 'var(--color-lumon-gray-200)',
            border: 'none',
          }}
          disabled={!canCompare}
          onClick={() => canCompare && onCompare(selections as [string, string])}
        >
          Compare Segments
        </button>
      </motion.div>
    </motion.div>
  );
}
