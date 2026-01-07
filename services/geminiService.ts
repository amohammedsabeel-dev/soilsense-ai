
import { GoogleGenAI, Type } from "@google/genai";
import { SoilAnalysis, DiseaseAnalysis, CropRecommendation, YieldPrediction } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeSoilImage = async (base64Image: string): Promise<SoilAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this image of soil for agricultural purposes. Identify type, composition, pH, and plants. Return a valid JSON object.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          soilType: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          characteristics: { type: Type.ARRAY, items: { type: Type.STRING } },
          estimatedPH: { type: Type.STRING },
          drainageQuality: { type: Type.STRING },
          composition: {
            type: Type.OBJECT,
            properties: {
              sand: { type: Type.STRING },
              silt: { type: Type.STRING },
              clay: { type: Type.STRING },
              organicMatter: { type: Type.STRING },
            },
            required: ['sand', 'silt', 'clay', 'organicMatter']
          },
          recommendedPlants: { type: Type.ARRAY, items: { type: Type.STRING } },
          careInstructions: { type: Type.STRING },
        },
        required: ['soilType', 'confidence', 'characteristics', 'estimatedPH', 'drainageQuality', 'composition', 'recommendedPlants', 'careInstructions'],
      },
    },
  });

  return JSON.parse(response.text) as SoilAnalysis;
};

export const analyzePlantDisease = async (base64Image: string): Promise<DiseaseAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a professional plant pathologist. Analyze this plant image. Identify if it is healthy or diseased. If diseased:
1. Provide the most likely disease name.
2. List visible symptoms.
3. Provide a detailed organic or chemical treatment recommendation.
4. Suggest a specific pesticide, fungicide, or treatment product name (chemical or common brand) that is widely available.
Return the result as a JSON object.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ['Healthy', 'Diseased'] },
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
          pesticideLink: { type: Type.STRING, description: 'A specific product name or search term for treatment' },
          urgency: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
        },
        required: ['status', 'confidence', 'symptoms', 'recommendation', 'pesticideLink', 'urgency'],
      },
    },
  });

  return JSON.parse(response.text) as DiseaseAnalysis;
};

export const getCropRecommendation = async (soilData: string, region: string): Promise<CropRecommendation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on the soil data: "${soilData}" and geographical region: "${region}", recommend the top 3-5 most suitable crops. Provide detailed requirements and market potential. Return a JSON object.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suitableCrops: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                suitability: { type: Type.STRING },
                growingPeriod: { type: Type.STRING },
                expectedYield: { type: Type.STRING },
                requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
              }
            }
          },
          soilImprovementTips: { type: Type.STRING },
          marketPotential: { type: Type.STRING },
        },
        required: ['suitableCrops', 'soilImprovementTips', 'marketPotential'],
      },
    },
  });

  return JSON.parse(response.text) as CropRecommendation;
};

export const predictYield = async (crop: string, area: number, soilType: string, climate: string): Promise<YieldPrediction> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Predict the agricultural yield for "${crop}" grown on "${area}" hectares of "${soilType}" soil in a "${climate}" climate. Return a valid JSON object with detailed optimization strategies.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedYield: { type: Type.STRING },
          unit: { type: Type.STRING },
          confidenceInterval: { type: Type.STRING },
          limitingFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
          optimizationStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['estimatedYield', 'unit', 'confidenceInterval', 'limitingFactors', 'optimizationStrategies'],
      },
    },
  });

  return JSON.parse(response.text) as YieldPrediction;
};
