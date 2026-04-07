import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useAppState } from './context/AppContext';
import Header from './components/Header';
import BullpenGrid from './components/BullpenGrid';
import SegmentDetail from './components/SegmentDetail';
import ComparisonView from './components/ComparisonView';
import ComparisonSelector from './components/ComparisonSelector';
import segments from './data/segments';
import { ArrowLeftRight } from 'lucide-react';

function AppContent() {
  const { selectedSegmentId, setSelectedSegmentId } = useAppState();
  const [showCompareSelector, setShowCompareSelector] = useState(false);
  const [comparePreselect, setComparePreselect] = useState<string | undefined>();
  const [comparisonIds, setComparisonIds] = useState<[string, string] | null>(null);

  const handleSegmentClick = (id: string) => {
    setSelectedSegmentId(id);
  };

  const handleCloseDetail = () => {
    setSelectedSegmentId(null);
  };

  const handleCompareFromDetail = (relatedId: string) => {
    // Pre-select current + related
    if (selectedSegmentId) {
      setComparePreselect(selectedSegmentId);
      setSelectedSegmentId(null);
      setComparisonIds([selectedSegmentId, relatedId]);
    }
  };

  const handleOpenCompareSelector = () => {
    setComparePreselect(undefined);
    setShowCompareSelector(true);
  };

  const handleCompare = (ids: [string, string]) => {
    setShowCompareSelector(false);
    setComparisonIds(ids);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-lumon-offwhite)' }}>
      {/* CRT scanline overlay */}
      <div className="crt-overlay" />

      <Header />

      {/* Sub-header with compare button */}
      <div
        className="flex items-center justify-between px-8 py-3 border-b"
        style={{ borderColor: 'var(--color-lumon-gray-100)', backgroundColor: 'var(--color-lumon-white)' }}
      >
        <div className="flex items-center gap-6">
          <span
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-lumon-gray-200)', fontFamily: 'var(--font-mono)' }}
          >
            {segments.length} Active Segments — {segments.reduce((a, s) => a + s.populationSize, 0).toLocaleString()} Total Population
          </span>
        </div>
        <button
          onClick={handleOpenCompareSelector}
          className="flex items-center gap-2 px-3 py-1.5 border transition-all duration-300 cursor-pointer"
          style={{
            borderColor: 'var(--color-lumon-gray-100)',
            color: 'var(--color-lumon-gray-300)',
            backgroundColor: 'transparent',
          }}
        >
          <ArrowLeftRight size={12} />
          <span className="text-[10px] tracking-[0.15em] uppercase">Compare</span>
        </button>
      </div>

      {/* Main content: Bullpen Grid */}
      <div className="flex-1 overflow-y-auto p-8 lumon-grid">
        <BullpenGrid segments={segments} onSegmentClick={handleSegmentClick} />
      </div>

      {/* Segment Detail Panel */}
      <AnimatePresence>
        {selectedSegmentId && (
          <SegmentDetail
            segmentId={selectedSegmentId}
            onClose={handleCloseDetail}
            onCompare={handleCompareFromDetail}
          />
        )}
      </AnimatePresence>

      {/* Comparison Selector */}
      <AnimatePresence>
        {showCompareSelector && (
          <ComparisonSelector
            onCompare={handleCompare}
            onClose={() => setShowCompareSelector(false)}
            preselectedId={comparePreselect}
          />
        )}
      </AnimatePresence>

      {/* Comparison View */}
      <AnimatePresence>
        {comparisonIds && (
          <ComparisonView
            segmentIds={comparisonIds}
            onClose={() => setComparisonIds(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
