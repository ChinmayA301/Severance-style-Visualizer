import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useAppState } from './context/AppContext';
import Header from './components/Header';
import BullpenGrid from './components/BullpenGrid';
import SegmentDetail from './components/SegmentDetail';
import ComparisonView from './components/ComparisonView';
import ComparisonSelector from './components/ComparisonSelector';
import segments from './data/segments';
import { ArrowLeftRight } from 'lucide-react';
import SurveillanceEvent, { SURVEILLANCE_SUBJECTS } from './components/SurveillanceEvent';

function AppContent() {
  const { selectedSegmentId, setSelectedSegmentId } = useAppState();
  const [showCompareSelector, setShowCompareSelector] = useState(false);
  const [comparePreselect, setComparePreselect] = useState<string | undefined>();
  const [comparisonIds, setComparisonIds] = useState<[string, string] | null>(null);
  const [surveillanceSubject, setSurveillanceSubject] = useState<string | null>(null);

  // Random Surveillance Timer
  useEffect(() => {
    if (surveillanceSubject) return; // Don't schedule while active

    // Infrequent random triggers (between 45s and 180s)
    const nextDelay = Math.floor(Math.random() * 135000) + 45000; 
    
    const timer = setTimeout(() => {
      const randomSubject = SURVEILLANCE_SUBJECTS[Math.floor(Math.random() * SURVEILLANCE_SUBJECTS.length)];
      setSurveillanceSubject(randomSubject);
    }, nextDelay);

    return () => clearTimeout(timer);
  }, [surveillanceSubject]);

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
    <div className="flex flex-col h-full relative" style={{ backgroundColor: 'var(--color-lumon-offwhite)' }}>
      {/* Secret trigger button - aesthetic empty black square */}
      <button 
        onClick={() => {
          console.log("TRIGGER CLICKED!");
          const randomSubject = SURVEILLANCE_SUBJECTS[Math.floor(Math.random() * SURVEILLANCE_SUBJECTS.length)];
          setSurveillanceSubject(randomSubject);
        }}
        className="absolute top-0 right-0 w-4 h-4 bg-transparent z-[9999999] cursor-default"
        title="Override"
      />

      {/* CRT scanline overlay */}
      <div className="crt-overlay pointer-events-none z-50 mix-blend-overlay opacity-30" />

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
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenCompareSelector}
            className="flex items-center gap-2 px-3 py-1.5 border transition-all duration-300 cursor-pointer hover:bg-gray-100"
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

      {/* Surveillance Event */}
      {surveillanceSubject && (
        <SurveillanceEvent 
          subject={surveillanceSubject} 
          onComplete={() => setSurveillanceSubject(null)} 
        />
      )}
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
