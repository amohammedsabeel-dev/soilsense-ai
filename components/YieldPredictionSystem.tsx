
import React, { useState } from 'react';
import { predictYield } from '../services/geminiService';
import { YieldPrediction } from '../types';

const YieldPredictionSystem: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState<number>(0);
  const [soilType, setSoilType] = useState('');
  const [climate, setClimate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YieldPrediction | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || area <= 0 || !soilType) return;
    setLoading(true);
    try {
      const data = await predictYield(crop, area, soilType, climate);
      setResult(data);
    } catch (err) {
      alert("Error predicting yield.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-emerald-700 font-bold flex items-center gap-2">← Back to Dashboard</button>
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-emerald-50 mb-12">
        <h2 className="text-4xl font-black text-emerald-950 mb-2">Yield Prediction System</h2>
        <p className="text-gray-500 mb-12">Precision harvest forecasting using multi-factor analysis.</p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-emerald-600">Crop Variant</label>
            <input 
              required
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all"
              placeholder="e.g. Sona Masuri Rice / BT Cotton"
              value={crop}
              onChange={e => setCrop(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-emerald-600">Farm Area (Hectares)</label>
            <input 
              required
              type="number"
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all"
              placeholder="e.g. 2.5"
              value={area || ''}
              onChange={e => setArea(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-emerald-600">Soil Classification</label>
            <input 
              required
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all"
              placeholder="e.g. Fertile Alluvial / Clayey"
              value={soilType}
              onChange={e => setSoilType(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-emerald-600">Climate/Weather Condition</label>
            <input 
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all"
              placeholder="e.g. Monsoon-heavy / Arid"
              value={climate}
              onChange={e => setClimate(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 pt-4">
            <button 
              disabled={loading}
              className="w-full bg-emerald-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-100 hover:scale-[1.01] transition-all"
            >
              {loading ? 'Simulating Growth Cycles...' : 'Forecast Potential Yield'}
            </button>
          </div>
        </form>

        {result && (
          <div className="animate-in slide-in-from-bottom-6 duration-500">
            <div className="bg-emerald-50 p-12 rounded-[2.5rem] border border-emerald-100 text-center mb-10">
               <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Estimated Total Yield</p>
               <h3 className="text-6xl font-black text-emerald-950 mb-2">{result.estimatedYield} <span className="text-2xl opacity-60 font-bold">{result.unit}</span></h3>
               <p className="text-sm font-bold text-emerald-700 italic opacity-80">Confidence Interval: {result.confidenceInterval}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-3">
                  <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm">⚠️</span>
                  Limiting Factors
                </h4>
                <div className="space-y-3">
                  {result.limitingFactors.map((f, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 text-sm font-medium text-slate-600 shadow-sm">
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">💡</span>
                  Optimization Strategies
                </h4>
                <div className="space-y-3">
                  {result.optimizationStrategies.map((s, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 text-sm font-medium text-emerald-900 shadow-sm">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldPredictionSystem;
