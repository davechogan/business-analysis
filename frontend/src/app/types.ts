export type AnalysisStep = 
  | 'strategy' 
  | 'competitors' 
  | 'revenue' 
  | 'cost' 
  | 'roi' 
  | 'justification' 
  | 'deck';

export interface Results {
  [key: string]: any;
  strategy?: any;
  competitors?: any;
  revenue?: any;
  cost?: any;
  roi?: any;
  justification?: any;
  deck?: any;
}

// ... other type definitions ... 