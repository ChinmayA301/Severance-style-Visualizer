import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ViewMode } from '../types';

interface AppState {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  selectedSegmentId: string | null;
  setSelectedSegmentId: (id: string | null) => void;
  comparisonIds: [string, string] | null;
  setComparisonIds: (ids: [string, string] | null) => void;
  isComparing: boolean;
  setIsComparing: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('executive');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [comparisonIds, setComparisonIds] = useState<[string, string] | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'executive' ? 'analyst' : 'executive'));
  }, []);

  return (
    <AppContext.Provider
      value={{
        viewMode,
        toggleViewMode,
        selectedSegmentId,
        setSelectedSegmentId,
        comparisonIds,
        setComparisonIds,
        isComparing,
        setIsComparing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
