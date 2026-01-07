
import React, { useState, useCallback, useRef } from 'react';
import { AnalysisState, SoilAnalysis } from './types';
import { analyzeSoilImage } from './services/geminiService';
import Header from './components/Header';
import AnalysisResult from './components/AnalysisResult';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    imagePreview: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setState(prev => ({ 
          ...prev, 
          imagePreview: base64, 
          result: null, 
          error: null 
        }));
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await analyzeSoilImage(base64);
      setState(prev => ({ ...prev, result, isLoading: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Failed to analyze image. Please try a clearer picture of the soil." 
      }));
    }
  };

  const reset = () => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      imagePreview: null,
    });
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f7]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-emerald-950 mb-4 leading-tight">
            Identify Your Soil Type <br/> 
            <span className="text-emerald-600">Instantly with AI</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a photo of your garden or farm soil. Our advanced vision models will analyze texture, moisture, and composition to provide tailored gardening advice.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-12">
          {!state.imagePreview ? (
            <label className="group relative block w-full border-4 border-dashed border-emerald-200 rounded-3xl p-12 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-emerald-900 mb-1">Upload Soil Photo</p>
                <p className="text-gray-500">Tap to browse or drop image here</p>
                <span className="mt-4 px-6 py-2 bg-emerald-700 text-white rounded-full font-medium shadow-md group-hover:bg-emerald-800 transition-colors">
                  Select Image
                </span>
              </div>
            </label>
          ) : (
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <img 
                src={state.imagePreview} 
                alt="Soil preview" 
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                {state.isLoading ? (
                  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl flex flex-col items-center shadow-xl">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-emerald-900 font-bold">Analyzing Earth Layers...</p>
                    <p className="text-xs text-gray-500 mt-1 italic">This takes about 5-10 seconds</p>
                  </div>
                ) : (
                  <button 
                    onClick={reset}
                    className="bg-white text-emerald-900 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors"
                  >
                    Analyze New Image
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{state.error}</p>
                <button 
                    onClick={() => state.imagePreview && processImage(state.imagePreview)}
                    className="text-xs text-red-600 underline mt-1 font-bold"
                >
                    Retry Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {state.result && <AnalysisResult result={state.result} />}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-white font-bold text-xl">SoilSense AI</span>
          </div>
          <p className="text-sm max-w-md mx-auto mb-8">
            Harnessing the power of Gemini 3 Vision to transform how we understand our earth. Perfect for gardeners, farmers, and researchers.
          </p>
          <div className="flex justify-center gap-6 mb-8 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">API Reference</a>
            <a href="#" className="hover:text-white">Contact Support</a>
          </div>
          <p className="text-xs">&copy; 2024 SoilSense AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
