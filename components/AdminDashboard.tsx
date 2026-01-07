
import React from 'react';

const AdminDashboard = ({ products, machinery, videos, bills }: any) => {
  const totalSales = bills.reduce((acc: any, b: any) => acc + b.total, 0);
  
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard label="Live Products" value={products.length} color="bg-blue-600" icon="📦" />
        <StatCard label="Heavy Machinery" value={machinery.length} color="bg-emerald-600" icon="🚜" />
        <StatCard label="Total Sales" value={`$${totalSales.toFixed(0)}`} color="bg-orange-600" icon="💰" />
        <StatCard label="Active Invoices" value={bills.length} color="bg-purple-600" icon="📑" />
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-8">System Health & Inventory</h3>
        <div className="space-y-6">
          {products.slice(0, 4).map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800 font-bold">#</div>
                 <div>
                   <p className="font-bold text-gray-800">{p.name}</p>
                   <p className="text-xs text-gray-400">Stock: {p.quantity} units</p>
                 </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest ${p.quantity < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {p.quantity < 10 ? 'Low Stock' : 'Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }: any) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 relative overflow-hidden group hover:shadow-lg transition-all">
    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500 text-6xl`}>{icon}</div>
    <div className={`w-8 h-1 rounded-full mb-4 ${color}`}></div>
    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-3xl font-black text-gray-900">{value}</p>
  </div>
);

export default AdminDashboard;
