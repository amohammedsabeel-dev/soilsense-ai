
import React, { useState, useRef } from 'react';
import { analyzeSoilImage } from '../services/geminiService';
import { SoilAnalysis } from '../types';
import AnalysisResult from './AnalysisResult';

const SoilAnalyzer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoilAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base = reader.result as string;
        setImage(base);
        process(base);
      };
      reader.readAsDataURL(file);
    }
  };

  const process = async (base: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await analyzeSoilImage(base);
      setResult(res);
    } catch (err) {
      setError("Failed to analyze soil. Please ensure the lighting is natural and focus is sharp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
      <button onClick={onBack} className="mb-6 text-emerald-700 font-bold">← Dashboard</button>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-emerald-950 mb-2">Soil Type Prediction</h2>
        <p className="text-gray-500">Predict soil type and suitable crops using Advanced CNN Models</p>
      </div>

      {!image ? (
        <label className="border-4 border-dashed border-emerald-200 rounded-3xl p-20 block text-center cursor-pointer hover:bg-emerald-50 transition-all">
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          <span className="text-6xl mb-4 block">🌍</span>
          <p className="text-2xl font-bold text-emerald-950">Upload Soil Sample</p>
          <p className="text-gray-500 mt-2">Works with Black, Red, Sandy, and Clay soils</p>
        </label>
      ) : (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-8 border-white">
            <img src={image} className="w-full h-96 object-cover" alt="Soil" />
            {loading && (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-bold text-white text-xl">Analyzing Soil Layers...</p>
              </div>
            )}
            {!loading && <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-white/90 p-3 rounded-full text-emerald-950 font-bold hover:bg-white">Change Image</button>}
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl font-bold">{error}</div>}
          {result && <AnalysisResult result={result} />}
        </div>
      )}
    </div>
  );
};

export default SoilAnalyzer;
