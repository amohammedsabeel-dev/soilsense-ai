
import React from 'react';
import { Product } from '../types';

interface MarketplaceProps {
  products: Product[];
  cart: { p: Product, q: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ p: Product, q: number }[]>>;
  onProceedToBill: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ products, cart, setCart, onProceedToBill }) => {
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.p.id === product.id);
      if (existing) {
        return prev.map(item => item.p.id === product.id ? { ...item, q: item.q + 1 } : item);
      }
      return [...prev, { p: product, q: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.p.id !== id));
  };

  const cartTotal = cart.reduce((acc, i) => acc + (i.p.price * i.q), 0);

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow">
          <h2 className="text-3xl font-bold mb-10 font-poppins text-gray-800 tracking-tight">Agriculture Marketplace</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase mb-1 block">{p.category}</span>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">{p.name}</h3>
                  </div>
                  <span className="text-2xl font-black text-gray-900">${p.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-sm mb-10 leading-relaxed">{p.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available: {p.quantity} units</span>
                  <button 
                    disabled={p.quantity <= 0}
                    onClick={() => addToCart(p)}
                    className="bg-emerald-800 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-50 hover:bg-emerald-950 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 sticky top-32 border border-emerald-50">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="text-2xl">🛒</span> 
              <span>Active Cart</span>
              {cart.length > 0 && <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-black">{cart.length}</span>}
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-sm font-bold">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-sm">{item.p.name}</p>
                        <p className="text-xs text-gray-400">{item.q} × ${item.p.price}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-sm text-emerald-800">${(item.p.price * item.q).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.p.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-8">
                  <div className="flex justify-between mb-2 opacity-50 text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-10">
                    <span className="font-bold text-lg">Estimated Total</span>
                    <span className="text-3xl font-black text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={onProceedToBill} className="w-full bg-emerald-950 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:scale-[1.02] transition-all">Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
