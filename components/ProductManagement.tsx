
import React, { useState } from 'react';
import { Product } from '../types';

const ProductManagement = ({ products, setProducts }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({ name: '', price: 0, quantity: 0, category: 'Seeds' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      category: formData.category || 'General',
      description: formData.description || 'Standard agriculture product.'
    };
    setProducts([...products, newProduct]);
    setShowModal(false);
    setFormData({ name: '', price: 0, quantity: 0, category: 'Seeds' });
  };

  const deleteProduct = (id: string) => {
    if (confirm('Delete this product from catalog?')) {
      setProducts(products.filter((p: any) => p.id !== id));
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-poppins">Inventory Control</h2>
        <button onClick={() => setShowModal(true)} className="bg-emerald-800 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-emerald-100 transition-all">+ Add Catalog Product</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-black uppercase tracking-widest text-gray-400">
            <tr>
              <th className="p-6">Product Detail</th>
              <th className="p-6">Category</th>
              <th className="p-6 text-right">Price</th>
              <th className="p-6 text-right">In Stock</th>
              <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-6 font-bold text-gray-800">{p.name}</td>
                <td className="p-6 text-gray-500 text-sm">{p.category}</td>
                <td className="p-6 text-right font-black text-emerald-800">${p.price.toFixed(2)}</td>
                <td className="p-6 text-right font-mono">{p.quantity}</td>
                <td className="p-6 text-center">
                   <button onClick={() => deleteProduct(p.id)} className="text-red-500 font-bold hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10 animate-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-bold mb-8">Add New Marketplace Product</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                 <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Product Name" onChange={e => setFormData({...formData, name: e.target.value})} />
                 <div className="grid grid-cols-2 gap-4">
                   <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Price ($)" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                   <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Stock Quantity" onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                 </div>
                 <select className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Supplements</option>
                    <option>Seeds</option>
                    <option>Soil</option>
                    <option>Pesticides</option>
                 </select>
                 <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 h-24" placeholder="Brief description..." onChange={e => setFormData({...formData, description: e.target.value})} />
                 <div className="flex gap-4 mt-8">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-grow py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="flex-grow bg-emerald-800 text-white py-4 rounded-2xl font-bold">Add to Catalog</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
