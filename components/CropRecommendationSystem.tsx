
import React, { useState } from 'react';
import { getCropRecommendation } from '../services/geminiService';
import { CropRecommendation } from '../types';

const CropRecommendationSystem: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [soilInfo, setSoilInfo] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!soilInfo || !region) return;
    setLoading(true);
    try {
      const data = await getCropRecommendation(soilInfo, region);
      setResult(data);
    } catch (err) {
      alert("Error getting recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 max-w-5xl mx-auto">
      <button onClick={onBack} className="mb-6 text-emerald-700 font-bold flex items-center gap-2">← Back to Dashboard</button>
      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-emerald-50 mb-12">
        <h2 className="text-3xl font-black text-emerald-950 mb-4">Crop Recommendation System</h2>
        <p className="text-gray-500 mb-10">AI-powered suggestions based on soil health and regional data.</p>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-sm font-black uppercase text-gray-400">Soil Condition/Type</label>
            <textarea 
              className="w-full p-5 bg-emerald-50/30 border-2 border-emerald-100 rounded-3xl outline-none focus:border-emerald-500 h-32 transition-all"
              placeholder="Describe soil (e.g. Red loamy soil, high drainage, pH 6.5)"
              value={soilInfo}
              onChange={e => setSoilInfo(e.target.value)}
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase text-gray-400">Geographical Region</label>
              <input 
                type="text"
                className="w-full p-5 bg-emerald-50/30 border-2 border-emerald-100 rounded-3xl outline-none focus:border-emerald-500 transition-all"
                placeholder="e.g. Maharashtra, India / California, USA"
                value={region}
                onChange={e => setRegion(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-emerald-800 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-950 transition-all disabled:opacity-50"
            >
              {loading ? 'Analyzing Earth...' : 'Get Best Crops'}
            </button>
          </div>
        </form>

        {result && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {result.suitableCrops.map((crop, i) => (
                <div key={i} className="bg-white border-2 border-emerald-50 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-2">{crop.suitability} Match</span>
                  <h4 className="text-2xl font-black mb-4 text-emerald-950">{crop.name}</h4>
                  <div className="text-sm text-gray-500 mb-6">
                    <p>🌱 Period: <span className="font-bold text-gray-800">{crop.growingPeriod}</span></p>
                    <p>📈 Yield: <span className="font-bold text-gray-800">{crop.expectedYield}</span></p>
                  </div>
                  <ul className="space-y-2">
                    {crop.requirements.map((req, j) => (
                      <li key={j} className="text-xs text-emerald-800 font-medium bg-emerald-50 py-1.5 px-3 rounded-lg flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> {req}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] shadow-xl">
                 <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                   <span className="text-2xl">✨</span> Soil Improvement
                 </h4>
                 <p className="text-emerald-100 leading-relaxed font-medium">{result.soilImprovementTips}</p>
              </div>
              <div className="bg-orange-50 p-10 rounded-[2.5rem] border border-orange-100">
                 <h4 className="text-xl font-bold mb-4 text-orange-900 flex items-center gap-3">
                   <span className="text-2xl">📊</span> Market Potential
                 </h4>
                 <p className="text-orange-800 leading-relaxed font-medium">{result.marketPotential}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendationSystem;
