
import React, { useState, useEffect } from 'react';
import { SensorData } from '../types';

const IoTDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [data, setData] = useState<SensorData>({
    temp: 24,
    humidity: 65,
    moisture: 42,
    timestamp: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        temp: +(prev.temp + (Math.random() - 0.5) * 0.5).toFixed(1),
        humidity: +(prev.humidity + (Math.random() - 0.5) * 2).toFixed(1),
        moisture: +(prev.moisture + (Math.random() - 0.5) * 1.5).toFixed(1),
        timestamp: new Date().toLocaleTimeString()
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'Ambient Temperature', value: `${data.temp}°C`, color: 'text-orange-600', bg: 'bg-orange-50', icon: '🌡️' },
    { label: 'Relative Humidity', value: `${data.humidity}%`, color: 'text-blue-600', bg: 'bg-blue-50', icon: '💧' },
    { label: 'Soil Moisture', value: `${data.moisture}%`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '🌱' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
      <button onClick={onBack} className="mb-6 text-emerald-700 font-bold">← Back</button>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald-950">Live IoT Monitoring</h2>
          <p className="text-gray-500">Real-time telemetry from farm sensors</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full text-sm font-bold">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Live Syncing
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className={`${m.bg} p-8 rounded-3xl shadow-sm border border-black/5 flex flex-col items-center text-center`}>
            <span className="text-4xl mb-4">{m.icon}</span>
            <span className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">{m.label}</span>
            <span className={`text-4xl font-extrabold ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-50">
        <h3 className="text-xl font-bold mb-6 flex justify-between">
          Sensor History 
          <span className="text-xs text-gray-400 font-normal">Last Update: {data.timestamp}</span>
        </h3>
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
              <div className="flex gap-4 items-center">
                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">{i}</span>
                <span className="text-sm font-medium">Node_#0{i}_Gateway</span>
              </div>
              <span className="text-sm font-bold text-emerald-600">Connected</span>
              <span className="text-sm text-gray-400">Stable</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;
