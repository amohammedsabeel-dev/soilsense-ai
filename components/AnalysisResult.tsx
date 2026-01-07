
import React from 'react';
import { SoilAnalysis } from '../types';

interface AnalysisResultProps {
  result: SoilAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100 mb-12">
      <div className="bg-emerald-800 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{result.soilType} Soil</h2>
          <p className="text-emerald-100 flex items-center gap-2 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-300"></span>
            AI Confidence: {result.confidence}%
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm uppercase tracking-wider text-emerald-300 font-semibold">Classification</span>
          <div className="text-xl font-mono">#{result.soilType.toLowerCase()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Characteristics & Stats */}
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3 border-b border-emerald-50 pb-2">Key Properties</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-600 block uppercase mb-1">Estimated pH</span>
                <span className="text-xl font-bold text-emerald-900">{result.estimatedPH}</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-600 block uppercase mb-1">Drainage</span>
                <span className="text-xl font-bold text-emerald-900">{result.drainageQuality}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3 border-b border-emerald-50 pb-2">Physical Features</h3>
            <ul className="grid grid-cols-1 gap-2">
              {result.characteristics.map((char, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg text-sm">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {char}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Composition Chart (Manual bars) */}
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3 border-b border-emerald-50 pb-2">Mineral Composition</h3>
            <div className="space-y-4">
              {[
                { label: 'Sand', value: result.composition.sand, color: 'bg-yellow-400' },
                { label: 'Silt', value: result.composition.silt, color: 'bg-orange-400' },
                { label: 'Clay', value: result.composition.clay, color: 'bg-amber-600' },
                { label: 'Organic Matter', value: result.composition.organicMatter, color: 'bg-emerald-700' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1 font-medium text-gray-600">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-1000`} 
                      style={{ width: item.value.includes('%') ? item.value : '25%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3 border-b border-emerald-50 pb-2">Best for Growth</h3>
            <div className="flex flex-wrap gap-2">
              {result.recommendedPlants.map((plant, idx) => (
                <span key={idx} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {plant}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="bg-emerald-50 p-8 border-t border-emerald-100">
        <h3 className="text-lg font-semibold text-emerald-900 mb-2">Expert Recommendations</h3>
        <p className="text-emerald-800 leading-relaxed text-sm">
          {result.careInstructions}
        </p>
      </div>
    </div>
  );
};

export default AnalysisResult;
