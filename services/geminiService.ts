
import { GoogleGenAI, Type } from "@google/genai";
import { SoilAnalysis } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeSoilImage = async (base64Image: string): Promise<SoilAnalysis> => {
  // Use process.env.API_KEY directly as it is provided by the environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Analyze this image of soil and provide a detailed identification and analysis. 
  Determine the primary soil type (e.g., Loamy, Sandy, Clay, Silty, Peaty, Chalky), its composition percentages (estimates), 
  pH level estimate, drainage characteristics, and 5 specific plants that thrive in this environment. 
  Include professional care instructions for this soil type.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1],
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          soilType: { type: Type.STRING, description: 'The identified soil category.' },
          confidence: { type: Type.NUMBER, description: 'Percentage confidence from 0 to 100.' },
          characteristics: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: 'List of physical properties observed.'
          },
          estimatedPH: { type: Type.STRING, description: 'Estimated pH range.' },
          drainageQuality: { type: Type.STRING, description: 'How well water flows through this soil.' },
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
          recommendedPlants: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: '5 specific plants that grow best here.'
          },
          careInstructions: { type: Type.STRING, description: 'Expert advice for soil management.' },
        },
        required: [
          'soilType', 'confidence', 'characteristics', 'estimatedPH', 
          'drainageQuality', 'composition', 'recommendedPlants', 'careInstructions'
        ],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response from AI model');
  }

  return JSON.parse(text) as SoilAnalysis;
};
