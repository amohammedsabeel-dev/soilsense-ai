
import React, { useState, useRef } from 'react';
import { DiseaseAnalysis } from '../types';
import { analyzePlantDisease } from '../services/geminiService';

const DiseaseScanner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        process(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const process = async (base64: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzePlantDisease(base64);
      setResult(data);
    } catch (err) {
      setError("Failed to scan plant. Ensure the leaf is clearly visible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500 pb-20">
      <button onClick={onBack} className="mb-6 text-emerald-700 font-bold flex items-center gap-2">← Back to Home</button>
      <h2 className="text-3xl font-bold text-emerald-950 mb-8">Plant Disease Diagnostic</h2>
      
      {!image ? (
        <label className="border-4 border-dashed border-emerald-200 rounded-[2.5rem] p-20 block text-center cursor-pointer hover:bg-emerald-50 transition-all">
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📸</span>
          </div>
          <p className="text-2xl font-bold text-emerald-950">Capture Leaf Photo</p>
          <p className="text-gray-500 mt-2">Upload a high-quality photo of a diseased or healthy leaf</p>
        </label>
      ) : (
        <div className="space-y-8">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
            <img src={image} className="w-full h-96 object-cover" alt="Scan" />
            {loading && (
              <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-bold text-white text-xl">Analyzing Tissue Health...</p>
                <p className="text-emerald-200 text-sm mt-2">Scanning for fungal, viral, and bacterial markers</p>
              </div>
            )}
            {!loading && <button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-white shadow-xl p-3 rounded-full text-emerald-900 font-bold hover:scale-110 transition-transform">✕</button>}
          </div>

          {result && (
            <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-emerald-50">
              <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-3 h-3 rounded-full ${result.status === 'Healthy' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
                    <h3 className={`text-3xl font-black ${result.status === 'Healthy' ? 'text-emerald-700' : 'text-red-700'}`}>
                      {result.status === 'Healthy' ? 'Specimen is Healthy' : result.diseaseName}
                    </h3>
                  </div>
                  <p className="text-gray-500 font-medium">Diagnostic Confidence: {result.confidence}% | Action Required: {result.urgency}</p>
                </div>
                <div className="bg-emerald-50 px-6 py-3 rounded-2xl text-emerald-800 font-black text-sm uppercase tracking-widest border border-emerald-100">
                  Phytosanitary Report
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <section>
                    <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🔍</span> Identification Markers
                    </h4>
                    <ul className="space-y-3">
                      {result.symptoms.map((s, i) => (
                        <li key={i} className="text-sm bg-slate-50 p-4 rounded-2xl flex items-start gap-3 border border-slate-100">
                          <span className="text-emerald-600 font-bold mt-1">✔</span> 
                          <span className="text-slate-700 font-medium">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
                
                <div className="space-y-8">
                  <section className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🛠️</span> Treatment Protocol
                    </h4>
                    <p className="text-sm text-emerald-800 leading-relaxed font-medium mb-8">
                      {result.recommendation}
                    </p>
                    
                    {result.status === 'Diseased' && (
                      <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-600 opacity-60">Recommended Product</p>
                        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
                           <div>
                              <p className="font-bold text-emerald-950">{result.pesticideLink}</p>
                              <p className="text-[10px] text-gray-400 font-bold">AGRICULTURAL GRADE TREATMENT</p>
                           </div>
                           <a 
                            href={`https://www.google.com/search?q=buy+${encodeURIComponent(result.pesticideLink)}+pesticide+online`} 
                            target="_blank" 
                            className="bg-emerald-700 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-emerald-900 transition-colors shadow-lg shadow-emerald-50"
                          >
                            Find Online
                          </a>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          )}
          {error && <div className="p-6 bg-red-50 text-red-700 rounded-3xl font-bold border border-red-100 shadow-sm">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default DiseaseScanner;
