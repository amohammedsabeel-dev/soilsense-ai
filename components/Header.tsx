
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-900 text-white py-6 px-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <svg className="w-8 h-8 text-emerald-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SoilSense AI</h1>
            <p className="text-xs text-emerald-200 font-medium">Advanced Earth Analysis</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#" className="hover:text-emerald-300 transition-colors">Analyzer</a>
          <a href="#" className="hover:text-emerald-300 transition-colors">Plant Guide</a>
          <a href="#" className="hover:text-emerald-300 transition-colors">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
