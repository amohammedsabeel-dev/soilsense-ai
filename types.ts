
export interface SoilAnalysis {
  soilType: string;
  confidence: number;
  characteristics: string[];
  estimatedPH: string;
  drainageQuality: string;
  composition: {
    sand: string;
    silt: string;
    clay: string;
    organicMatter: string;
  };
  recommendedPlants: string[];
  careInstructions: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: SoilAnalysis | null;
  imagePreview: string | null;
}
