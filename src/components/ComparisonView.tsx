import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { Segment } from '../types';
import { useAppState } from '../context/AppContext';
import segments from '../data/segments';

interface ComparisonViewProps {
  segmentIds: [string, string];
  onClose: () => void;
}

export default function ComparisonView({ segmentIds, onClose }: ComparisonViewProps) {
  const { viewMode } = useAppState();
  const [leftId, rightId] = segmentIds;
  const left = segments.find((s) => s.id === leftId);
  const right = segments.find((s) => s.id === rightId);

  if (!left || !right) return null;

  const similarity = left.similarSegments.find((s) => s.id === rightId);
  const similarityScore = similarity?.similarityScore ?? 0;
  const sharedTraits = similarity?.sharedTraits ?? [];
  const divergentTraits = similarity?.divergentTraits ?? [];

  const compareBlocks = [
    { title: 'Core Attributes', leftItems: left.coreAttributes, rightItems: right.coreAttributes },
    { title: 'Needs', leftItems: left.needs, rightItems: right.needs },
    { title: 'Barriers', leftItems: left.barriers, rightItems: right.barriers },
    { title: 'Motivations', leftItems: left.motivations, rightItems: right.motivations },
    { title: 'Channels', leftItems: left.preferredChannels, rightItems: right.preferredChannels },
  ];

  return (
    <motion.div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 100, backgroundColor: 'var(--color-lumon-offwhite)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-8 py-4 border-b shrink-0"
        style={{ borderColor: 'var(--color-lumon-gray-100)', backgroundColor: 'var(--color-lumon-white)' }}
      >
        <div className="flex items-center gap-3">
          <ArrowLeftRight size={14} style={{ color: 'var(--color-lumon-gray-300)' }} />
          <span
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}
          >
            Segment Comparison Matrix
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 cursor-pointer transition-colors duration-200"
          style={{ color: 'var(--color-lumon-gray-300)' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Similarity header */}
      <div className="px-8 py-6 flex items-center justify-center gap-8" style={{ backgroundColor: 'var(--color-lumon-white)', borderBottom: '1px solid var(--color-lumon-gray-100)' }}>
        <div className="text-right">
          <div className="w-2 h-2 rounded-full ml-auto mb-2" style={{ backgroundColor: left.color }} />
          <div className="text-sm tracking-[0.1em] uppercase font-medium" style={{ color: 'var(--color-lumon-gray-400)' }}>
            {left.name}
          </div>
          <div className="text-[10px] mt-1" style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}>
            {left.populationSize.toLocaleString()} — {left.populationPercent}%
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="text-2xl font-light mb-1"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-lumon-blue)' }}
          >
            {Math.round(similarityScore * 100)}%
          </div>
          <div className="text-[9px] tracking-[0.15em] uppercase" style={{ color: 'var(--color-lumon-gray-200)' }}>
            Similarity
          </div>
          <div
            className="h-1 rounded-full mt-2"
            style={{ width: '120px', backgroundColor: 'var(--color-lumon-gray-100)' }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${similarityScore * 100}%`, backgroundColor: 'var(--color-lumon-blue)' }}
            />
          </div>
        </div>

        <div>
          <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: right.color }} />
          <div className="text-sm tracking-[0.1em] uppercase font-medium" style={{ color: 'var(--color-lumon-gray-400)' }}>
            {right.name}
          </div>
          <div className="text-[10px] mt-1" style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}>
            {right.populationSize.toLocaleString()} — {right.populationPercent}%
          </div>
        </div>
      </div>

      {/* Shared and Divergent traits */}
      {(sharedTraits.length > 0 || divergentTraits.length > 0) && (
        <div
          className="px-8 py-4 flex items-center justify-center gap-12"
          style={{ backgroundColor: 'var(--color-lumon-white)', borderBottom: '1px solid var(--color-lumon-gray-100)' }}
        >
          {sharedTraits.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}>
                Shared:
              </span>
              {sharedTraits.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 border"
                  style={{ borderColor: 'var(--color-lumon-gray-100)', color: 'var(--color-lumon-gray-400)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {divergentTraits.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}>
                Diverge:
              </span>
              {divergentTraits.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 border"
                  style={{ borderColor: 'var(--color-lumon-red)', color: 'var(--color-lumon-gray-400)', opacity: 0.7 }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Side-by-side */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="space-y-px" style={{ backgroundColor: 'var(--color-lumon-gray-100)' }}>
          {compareBlocks.map((block) => (
            <div
              key={block.title}
              className="grid grid-cols-[1fr_auto_1fr]"
              style={{ backgroundColor: 'var(--color-lumon-gray-100)' }}
            >
              {/* Left */}
              <div className="p-5" style={{ backgroundColor: 'var(--color-lumon-white)' }}>
                <ul className="space-y-1.5">
                  {block.leftItems.map((item, i) => (
                    <li
                      key={i}
                      className="text-[11px] font-light flex items-start gap-2"
                      style={{ color: 'var(--color-lumon-gray-400)' }}
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: left.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Center label */}
              <div
                className="flex items-center justify-center px-4 min-w-[120px]"
                style={{ backgroundColor: 'var(--color-lumon-offwhite)' }}
              >
                <span
                  className="text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}
                >
                  {block.title}
                </span>
              </div>

              {/* Right */}
              <div className="p-5" style={{ backgroundColor: 'var(--color-lumon-white)' }}>
                <ul className="space-y-1.5">
                  {block.rightItems.map((item, i) => (
                    <li
                      key={i}
                      className="text-[11px] font-light flex items-start gap-2"
                      style={{ color: 'var(--color-lumon-gray-400)' }}
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: right.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Metrics comparison */}
          <div className="grid grid-cols-[1fr_auto_1fr]" style={{ backgroundColor: 'var(--color-lumon-gray-100)' }}>
            <div className="p-5" style={{ backgroundColor: 'var(--color-lumon-white)' }}>
              {left.metrics
                .filter((m) => viewMode === 'analyst' || !m.isAnalystOnly)
                .map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-1.5">
                    <span className="text-[10px]" style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}>{m.label}</span>
                    <span className="text-[12px] font-light" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-lumon-gray-400)' }}>{m.value}{m.unit || ''}</span>
                  </div>
                ))}
            </div>
            <div
              className="flex items-center justify-center px-4 min-w-[120px]"
              style={{ backgroundColor: 'var(--color-lumon-offwhite)' }}
            >
              <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}>
                Metrics
              </span>
            </div>
            <div className="p-5" style={{ backgroundColor: 'var(--color-lumon-white)' }}>
              {right.metrics
                .filter((m) => viewMode === 'analyst' || !m.isAnalystOnly)
                .map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-1.5">
                    <span className="text-[10px]" style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}>{m.label}</span>
                    <span className="text-[12px] font-light" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-lumon-gray-400)' }}>{m.value}{m.unit || ''}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
