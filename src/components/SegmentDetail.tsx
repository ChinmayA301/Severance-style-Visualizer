import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, TrendingUp, TrendingDown, Minus, Shield, Zap, MessageSquare, Wrench } from 'lucide-react';
import { Segment } from '../types';
import { useAppState } from '../context/AppContext';
import segments from '../data/segments';

interface SegmentDetailProps {
  segmentId: string;
  onClose: () => void;
  onCompare: (id: string) => void;
}

const trendIcon = (trend?: string) => {
  if (trend === 'up') return <TrendingUp size={11} style={{ color: 'var(--color-lumon-green-dim)' }} />;
  if (trend === 'down') return <TrendingDown size={11} style={{ color: 'var(--color-lumon-red)' }} />;
  return <Minus size={11} style={{ color: 'var(--color-lumon-gray-200)' }} />;
};

const typeIcon = (type: string) => {
  switch (type) {
    case 'intervention': return <Zap size={12} />;
    case 'channel_shift': return <ArrowRight size={12} />;
    case 'message_tuning': return <MessageSquare size={12} />;
    case 'service_design': return <Wrench size={12} />;
    default: return <Zap size={12} />;
  }
};

export default function SegmentDetail({ segmentId, onClose, onCompare }: SegmentDetailProps) {
  const { viewMode } = useAppState();
  const segment = segments.find((s) => s.id === segmentId);
  if (!segment) return null;

  const filteredMetrics = segment.metrics.filter(
    (m) => viewMode === 'analyst' || !m.isAnalystOnly
  );

  const similarSegmentData = segment.similarSegments
    .map((sim) => ({
      ...sim,
      segment: segments.find((s) => s.id === sim.id),
    }))
    .filter((s) => s.segment);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex"
        style={{ zIndex: 100 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Panel */}
        <motion.div
          className="relative ml-auto h-full overflow-y-auto retro-ide-panel"
          style={{
            width: '68%',
            maxWidth: '960px',
            color: 'var(--color-lumon-green)',
            fontFamily: 'var(--font-mono)'
          }}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.5, ease: [0.22, 0.68, 0.36, 1] }}
        >
          <div className="retro-ide-scanline" />
          {/* Top bar */}
          <div
            className="sticky top-0 flex items-center justify-between px-8 py-4 border-b border-green-900/50"
            style={{
              backgroundColor: 'var(--color-lumon-black)',
              zIndex: 10,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-3" style={{ backgroundColor: 'var(--color-lumon-green)' }} />
              <span
                className="text-[12px] tracking-[0.2em] font-bold retro-ide-glow"
                style={{ color: 'var(--color-lumon-green)' }}
              >
                MDR // SEGMENT_FILE_ACCESS_{segment.id}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 cursor-pointer transition-colors duration-200 hover:bg-green-900/30"
              style={{ color: 'var(--color-lumon-green)' }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-8 py-10">
            {/* Identity Block */}
            <motion.div
              className="mb-12 relative z-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2
                className="text-3xl tracking-wide font-bold mb-3 retro-ide-glow uppercase"
              >
                {segment.name}
              </h2>
              <p
                className="text-sm tracking-widest opacity-80"
              >
                &gt; {segment.tagline}
              </p>
              <div className="flex items-center gap-8 mt-8 border border-green-900/50 p-6 bg-green-950/20">
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase mb-2 opacity-70">
                    Population
                  </div>
                  <div className="text-2xl font-bold retro-ide-glow">
                    {segment.populationSize.toLocaleString()}
                  </div>
                </div>
                <div className="w-px h-10 bg-green-900/50" />
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase mb-2 opacity-70">
                    Share
                  </div>
                  <div className="text-2xl font-bold retro-ide-glow">
                    {segment.populationPercent}%
                  </div>
                </div>
                <div className="w-px h-10 bg-green-900/50" />
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase mb-2 opacity-70">
                    Trust Level
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield size={16} />
                    <span className="text-sm uppercase tracking-[0.2em] font-bold">
                      [{segment.trustLevel}]
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Attributes Grid */}
            <motion.div
              className="grid grid-cols-2 gap-px mb-12 relative z-10 border border-green-900/50 bg-green-900/30"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {[
                { title: 'Core Attributes', items: segment.coreAttributes },
                { title: 'Needs', items: segment.needs },
                { title: 'Barriers', items: segment.barriers },
                { title: 'Motivations', items: segment.motivations },
                { title: 'Behavior Patterns', items: segment.behaviorPatterns },
                { title: 'Preferred Channels', items: segment.preferredChannels },
              ].map((block) => (
                <div
                  key={block.title}
                  className="p-6 bg-black"
                >
                  <h4 className="text-[12px] tracking-[0.2em] font-bold uppercase mb-4 opacity-80 border-b border-green-900/30 pb-2">
                    // {block.title}
                  </h4>
                  <ul className="space-y-3">
                    {block.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-[13px] font-mono leading-relaxed flex items-start gap-3"
                      >
                        <span className="opacity-50 mt-0.5">&gt;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>

            {/* Metrics */}
            <motion.div
              className="mb-12 relative z-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h4 className="text-[14px] tracking-[0.2em] font-bold uppercase mb-6 retro-ide-glow">
                $ MACRODATA_METRICS {viewMode === 'analyst' && '[-RAW_MODE]'}
              </h4>
              <div className="grid grid-cols-3 gap-px border border-green-900/50 bg-green-900/30">
                {filteredMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-5 flex flex-col justify-between"
                    style={{
                      backgroundColor: metric.isAnalystOnly ? 'rgba(51,255,0,0.1)' : 'black',
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[11px] tracking-[0.15em] uppercase font-bold opacity-80 pr-2">
                        {metric.label}
                      </span>
                      {metric.trend && <span className="opacity-90 mt-0.5">{trendIcon(metric.trend)}</span>}
                    </div>
                    <div>
                      <div className="text-2xl font-bold retro-ide-glow">
                        {metric.value}
                        {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                      </div>
                      {metric.context && (
                        <div className="text-[11px] mt-2 opacity-60">
                          {metric.context}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Interventions */}
            <motion.div
              className="mb-12 relative z-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h4 className="text-[14px] tracking-[0.2em] font-bold uppercase mb-6 retro-ide-glow">
                &gt; SYSTEM_RECOMMENDATIONS
              </h4>
              <div className="space-y-4">
                {segment.interventions.map((intv) => (
                  <div
                    key={intv.id}
                    className="p-5 flex items-start gap-5 border border-green-900/50 bg-black relative"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-900/50" />
                    <div className="mt-0.5 opacity-80 border-r border-green-900/30 pr-5">
                      {typeIcon(intv.type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-[12px] tracking-[0.1em] font-bold mb-2 retro-ide-glow">
                        [{intv.id}] {intv.title}
                      </div>
                      <div className="text-[12px] leading-relaxed opacity-70">
                        {intv.description}
                      </div>
                      <div className="text-[10px] tracking-[0.15em] uppercase mt-3 opacity-50 bg-green-950 inline-block px-2 py-1 rounded-sm border border-green-900/50">
                        TYPE: {intv.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Similar Segments */}
            <motion.div
              className="mb-12 relative z-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h4 className="text-[14px] tracking-[0.2em] font-bold uppercase mb-6 retro-ide-glow">
                ? MATCHING_FILES
              </h4>
              <div className="space-y-3">
                {similarSegmentData.map(({ segment: sim, similarityScore, sharedTraits }) => (
                  sim && (
                    <div
                      key={sim.id}
                      className="flex items-center justify-between p-5 border border-green-900/50 bg-green-950/10 cursor-pointer group hover:bg-green-900/30 transition-all duration-300"
                      onClick={() => onCompare(sim.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-3" style={{ backgroundColor: 'var(--color-lumon-green)' }} />
                        <div>
                          <div className="text-[12px] tracking-[0.1em] font-bold retro-ide-glow uppercase">
                            {sim.name}
                          </div>
                          {viewMode === 'analyst' && sharedTraits && (
                            <div className="text-[10px] mt-1 opacity-60">
                              SHARED_TRAITS: [{sharedTraits.join(', ')}]
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-16 bg-green-900/30 border border-green-900/50">
                            <div
                              className="h-full bg-green-500 shadow-[0_0_5px_#33ff00]"
                              style={{ width: `${similarityScore * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] opacity-80">
                            {Math.round(similarityScore * 100)}%
                          </span>
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 border border-green-900/50 bg-black">
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
