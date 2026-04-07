export type SegmentId = string;

export type ViewMode = 'executive' | 'analyst';

export type MetricTrend = 'up' | 'down' | 'neutral';

export type RecommendationType =
  | 'intervention'
  | 'channel_shift'
  | 'message_tuning'
  | 'service_design';

export interface SegmentMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  context?: string;          // e.g. "vs 40% avg"
  trend?: MetricTrend;
  isAnalystOnly?: boolean;   // Hidden in executive mode
}

export interface SegmentRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
}

export interface SimilarSegment {
  id: SegmentId;
  similarityScore: number;   // 0 to 1
  sharedTraits?: string[];
  divergentTraits?: string[];
}

export interface Segment {
  id: SegmentId;
  name: string;
  tagline: string;
  populationSize: number;
  populationPercent: number;  // 0 to 100
  color: string;              // Restrained accent for the segment
  coreAttributes: string[];
  needs: string[];
  barriers: string[];
  motivations: string[];
  behaviorPatterns: string[];
  preferredChannels: string[];
  trustLevel: 'low' | 'medium' | 'high';
  metrics: SegmentMetric[];
  interventions: SegmentRecommendation[];
  similarSegments: SimilarSegment[];
}

/** A data particle that gets sorted into a segment bullpen */
export interface DataParticle {
  id: string;
  targetSegmentId: SegmentId;
  label: string;
  delay: number;              // ms before animation starts
}
