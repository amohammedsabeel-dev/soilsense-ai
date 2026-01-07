
import React, { useEffect } from 'react';

const ExitPage: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload(); // Hard reset simulation
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-1000 text-center">
      <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 text-6xl">👋</div>
      <h2 className="text-5xl font-extrabold text-emerald-950 mb-4 tracking-tight">Thank You!</h2>
      <p className="text-xl text-emerald-700 font-medium">For using the Smart Farmer Guidance System</p>
      <div className="mt-12 space-y-2 text-gray-400 text-sm">
        <p>Harvesting results... done.</p>
        <p>Storing local telemetry... done.</p>
        <p>Closing AI core... done.</p>
      </div>
      <div className="mt-8 text-xs text-gray-300 italic">Session will reset automatically in a few seconds...</div>
    </div>
  );
};

export default ExitPage;
