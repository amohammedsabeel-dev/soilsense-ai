
import React, { useState } from 'react';
import { Machinery } from '../types';

const MachineryManagement = ({ machinery, setMachinery }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Machinery>>({ name: '', price: 0, description: '', imageUrl: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const item: Machinery = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      price: Number(formData.price),
      description: formData.description || 'Professional farm equipment.',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b?w=400'
    };
    setMachinery([...machinery, item]);
    setShowModal(false);
  };

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Heavy Machinery Catalog</h2>
        <button onClick={() => setShowModal(true)} className="bg-emerald-800 text-white px-6 py-2.5 rounded-full font-bold">+ New Equipment</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {machinery.map((m: any) => (
          <div key={m.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
             <img src={m.imageUrl} className="h-40 w-full object-cover" />
             <div className="p-6 flex-grow">
                <h3 className="font-bold text-lg mb-1">{m.name}</h3>
                <p className="text-emerald-700 font-black mb-4">${m.price.toLocaleString()}</p>
                <div className="flex gap-2">
                   <button className="flex-grow bg-gray-100 text-gray-500 py-2 rounded-xl text-xs font-bold">Edit</button>
                   <button onClick={() => setMachinery(machinery.filter((i:any) => i.id !== m.id))} className="flex-grow bg-red-50 text-red-500 py-2 rounded-xl text-xs font-bold">Delete</button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10">
              <h3 className="text-2xl font-bold mb-8">Register New Machinery</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                 <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" placeholder="Model Name (e.g. Tractor X500)" onChange={e => setFormData({...formData, name: e.target.value})} />
                 <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" placeholder="Retail Price ($)" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                 <input className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" placeholder="Image URL" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                 <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none h-24" placeholder="Equipment specifications..." onChange={e => setFormData({...formData, description: e.target.value})} />
                 <div className="flex gap-4 mt-8">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-grow py-4 rounded-2xl font-bold text-gray-500">Cancel</button>
                    <button type="submit" className="flex-grow bg-emerald-800 text-white py-4 rounded-2xl font-bold">Save Record</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default MachineryManagement;
