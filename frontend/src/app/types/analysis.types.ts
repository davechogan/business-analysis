export type AnalysisStep = 
  | 'strategy' 
  | 'competitors' 
  | 'revenue' 
  | 'cost' 
  | 'roi' 
  | 'justification' 
  | 'deck';

export interface Section {
  title: string;
  content: string[];
  metrics?: Array<{
    label: string;
    value: string;
    unit?: string;
  }>;
  key_points?: string[];  // Add this for sections that have key points
}

export interface FormattedAnalysis {
  sections: Section[];
}

export interface Results {
  [key: string]: FormattedAnalysis | null;
  strategy: FormattedAnalysis | null;
  competitors: FormattedAnalysis | null;
  revenue: FormattedAnalysis | null;
  cost: FormattedAnalysis | null;
  roi: FormattedAnalysis | null;
  justification: FormattedAnalysis | null;
  deck: FormattedAnalysis | null;
}

export type TabStatus = 'complete' | 'processing' | 'pending'; 