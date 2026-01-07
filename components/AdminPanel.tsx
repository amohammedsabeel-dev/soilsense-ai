
import React, { useState } from 'react';
import { Product } from '../types';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, setProducts, onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'Seeds' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Invalid Admin Password');
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      setProducts(prev => [...prev, { 
        id: Math.random().toString(36).substr(2, 9),
        name: newProduct.name!,
        price: Number(newProduct.price),
        description: newProduct.description || '',
        quantity: Number(newProduct.quantity) || 0,
        category: newProduct.category || 'Seeds'
      }]);
      setNewProduct({ category: 'Seeds' });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold text-emerald-950 mb-6">Admin Secure Login</h2>
        <form onSubmit={handleLogin} className="space-y-4 bg-white p-8 rounded-3xl shadow-xl border border-emerald-50">
          <input 
            type="password" 
            placeholder="Enter Password (admin123)" 
            className="w-full p-4 rounded-xl border border-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold">Enter Panel</button>
          <button type="button" onClick={onBack} className="text-sm text-gray-400 hover:text-emerald-700 underline">Return to Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="mb-6 text-emerald-700 font-bold">← Dashboard</button>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <h3 className="text-2xl font-bold mb-6">Add New Product</h3>
          <form onSubmit={addProduct} className="bg-white p-8 rounded-3xl shadow-lg space-y-4 border border-emerald-50">
            <input 
              required
              placeholder="Product Name" 
              className="w-full p-3 rounded-lg border border-gray-100"
              value={newProduct.name || ''}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                type="number" 
                placeholder="Price" 
                className="w-full p-3 rounded-lg border border-gray-100"
                value={newProduct.price || ''}
                onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
              />
              <input 
                required
                type="number" 
                placeholder="Qty" 
                className="w-full p-3 rounded-lg border border-gray-100"
                value={newProduct.quantity || ''}
                onChange={e => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
              />
            </div>
            <select 
              className="w-full p-3 rounded-lg border border-gray-100"
              value={newProduct.category}
              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            >
              <option>Seeds</option>
              <option>Supplements</option>
              <option>Machinery</option>
              <option>Pesticides</option>
            </select>
            <textarea 
              placeholder="Description" 
              className="w-full p-3 rounded-lg border border-gray-100 h-24"
              value={newProduct.description || ''}
              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            ></textarea>
            <button className="w-full bg-emerald-800 text-white py-3 rounded-xl font-bold">Save Product</button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold mb-6">Inventory Management</h3>
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-emerald-50">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Stock</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="p-4 font-bold">{p.name}</td>
                    <td className="p-4 text-gray-400">{p.category}</td>
                    <td className="p-4 text-right">${p.price.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono">{p.quantity}</td>
                    <td className="p-4">
                      <button onClick={() => deleteProduct(p.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
