
export type Role = 'user' | 'admin' | null;

export interface User {
  id: string;
  username: string;
  role: Role;
  email?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  category: string;
  imageUrl?: string;
}

export interface Machinery {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface AgricultureVideo {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  category: string;
}

export type UserPage = 
  | 'home' 
  | 'plant-prediction' 
  | 'symptoms' 
  | 'marketplace' 
  | 'machinery' 
  | 'videos' 
  | 'bill'
  | 'video-player'
  | 'machinery-details'
  | 'iot-dashboard'
  | 'crop-recommendation'
  | 'yield-prediction';

export type AdminPage = 
  | 'dashboard' 
  | 'manage-products' 
  | 'manage-machinery' 
  | 'manage-videos' 
  | 'view-reports';

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

export interface DiseaseAnalysis {
  status: 'Healthy' | 'Diseased';
  diseaseName?: string;
  confidence: number;
  symptoms: string[];
  recommendation: string;
  pesticideLink: string;
  urgency: 'Low' | 'Medium' | 'High';
}

export interface CropRecommendation {
  suitableCrops: {
    name: string;
    suitability: string;
    growingPeriod: string;
    expectedYield: string;
    requirements: string[];
  }[];
  soilImprovementTips: string;
  marketPotential: string;
}

export interface YieldPrediction {
  estimatedYield: string;
  unit: string;
  confidenceInterval: string;
  limitingFactors: string[];
  optimizationStrategies: string[];
}

export interface BillReport {
  id: string;
  date: string;
  customer: string;
  total: number;
  items: string[];
}

/**
 * SensorData interface used for IoT real-time monitoring dashboard
 */
export interface SensorData {
  temp: number;
  humidity: number;
  moisture: number;
  timestamp: string;
}
