export interface AnalysisData {
  strategy: string;
  revenue: string;
  cost: string;
  roi: string;
  justification?: string;
  deck?: string;
}

export interface AnalysisResponse {
  output: string;
  error?: string;
} 