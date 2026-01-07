
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Role, User, Product, Machinery, AgricultureVideo, 
  UserPage, AdminPage, BillReport 
} from './types';
import SoilAnalyzer from './components/SoilAnalyzer';
import DiseaseScanner from './components/DiseaseScanner';
import Marketplace from './components/Marketplace';
import AdminDashboard from './components/AdminDashboard';
import ProductManagement from './components/ProductManagement';
import MachineryManagement from './components/MachineryManagement';
import VideoManagement from './components/VideoManagement';
import IoTDashboard from './components/IoTDashboard';
import CropRecommendationSystem from './components/CropRecommendationSystem';
import YieldPredictionSystem from './components/YieldPredictionSystem';

// --- INITIAL MOCK DATA ---
const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium NPK Fertilizer', price: 45.00, description: 'High-grade 10-10-10 nitrogen-phosphorus-potassium.', quantity: 100, category: 'Supplements' },
  { id: '2', name: 'Organic Compost', price: 20.00, description: '100% natural microbial soil enhancer.', quantity: 250, category: 'Soil' },
];

const DEFAULT_MACHINERY: Machinery[] = [
  { id: '1', name: 'John Deere 5050E', price: 25000, description: 'Powerhouse tractor for medium-sized farms.', imageUrl: 'https://images.unsplash.com/photo-1594411133670-35360a8848d7?w=400' },
  { id: '2', name: 'Rotary Tiller', price: 1200, description: 'Efficient soil preparation tool.', imageUrl: 'https://images.unsplash.com/photo-1622329399276-857a22cc375f?w=400' },
];

const DEFAULT_VIDEOS: AgricultureVideo[] = [
  { id: '1', title: 'Sustainable Farming Basics', youtubeId: 'mK6K1o6v-gQ', description: 'Learning the foundations of permaculture.', category: 'Education' },
  { id: '2', title: 'Smart Irrigation Tech', youtubeId: 'F0zCidV38M4', description: 'How IoT sensors save water.', category: 'IoT' },
];

const App: React.FC = () => {
  // Auth & Roles
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('f_auth');
    return saved ? JSON.parse(saved) : null;
  });

  // Pages
  const [userPage, setUserPage] = useState<UserPage>('home');
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');

  // Shared Data (State)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('f_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });
  const [machinery, setMachinery] = useState<Machinery[]>(() => {
    const saved = localStorage.getItem('f_machinery');
    return saved ? JSON.parse(saved) : DEFAULT_MACHINERY;
  });
  const [videos, setVideos] = useState<AgricultureVideo[]>(() => {
    const saved = localStorage.getItem('f_videos');
    return saved ? JSON.parse(saved) : DEFAULT_VIDEOS;
  });
  const [bills, setBills] = useState<BillReport[]>(() => {
    const saved = localStorage.getItem('f_bills');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<{ p: Product, q: number }[]>([]);

  // Search & Navigation Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('f_products', JSON.stringify(products));
    localStorage.setItem('f_machinery', JSON.stringify(machinery));
    localStorage.setItem('f_videos', JSON.stringify(videos));
    localStorage.setItem('f_bills', JSON.stringify(bills));
    if (currentUser) localStorage.setItem('f_auth', JSON.stringify(currentUser));
    else localStorage.removeItem('f_auth');
  }, [products, machinery, videos, bills, currentUser]);

  // URL Sync simulation
  useEffect(() => {
    const role = currentUser?.role || 'auth';
    const currentSub = currentUser?.role === 'admin' ? adminPage : userPage;
    const url = `#/${role}/${currentSub}${searchQuery ? '?search=' + encodeURIComponent(searchQuery) : ''}`;
    window.history.replaceState(null, '', url);
  }, [userPage, adminPage, currentUser, searchQuery]);

  // Global Search Logic - Direct jump to item by name
  useEffect(() => {
    if (!searchQuery) return;
    const q = searchQuery.toLowerCase().trim();

    // Machinery direct jump
    const foundMachinery = machinery.find(m => m.name.toLowerCase() === q);
    if (foundMachinery && currentUser?.role === 'user') {
      setSelectedItem(foundMachinery);
      setUserPage('machinery-details');
      setSearchQuery(''); // clear after jump
      return;
    }

    // Video direct jump (partial match acceptable for jump to play)
    const foundVideo = videos.find(v => v.title.toLowerCase() === q);
    if (foundVideo && currentUser?.role === 'user') {
      setSelectedItem(foundVideo);
      setUserPage('video-player');
      setSearchQuery(''); // clear after jump
      return;
    }
  }, [searchQuery, machinery, videos, currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setUserPage('home');
    setAdminPage('dashboard');
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  // --- RENDERING HELPERS ---
  const UserNavbar = () => (
    <nav className="glass-nav fixed top-0 w-full z-50 px-6 py-4 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setUserPage('home')}>
          <div className="bg-[#2E7D32] p-1.5 rounded-lg text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </div>
          <span className="font-poppins font-bold text-xl tracking-tight text-[#2E7D32]">Smart Farmer</span>
        </div>

        <div className="flex-grow max-w-lg mx-8 relative">
          <input 
            type="text" 
            placeholder="Type name (e.g. 'John Deere') to jump..."
            className="w-full bg-gray-100 border-none rounded-full py-2 px-12 text-sm focus:ring-2 focus:ring-[#2E7D32] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-4 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="flex items-center gap-6">
          <NavLink active={userPage === 'home'} onClick={() => setUserPage('home')}>Home</NavLink>
          <NavLink active={userPage === 'marketplace'} onClick={() => setUserPage('marketplace')}>Marketplace</NavLink>
          <NavLink active={userPage === 'machinery'} onClick={() => setUserPage('machinery')}>Machinery</NavLink>
          <NavLink active={userPage === 'videos'} onClick={() => setUserPage('videos')}>Videos</NavLink>
          <div className="flex items-center gap-4 ml-4 border-l pl-4">
            <span className="text-sm font-semibold text-gray-600">@{currentUser.username}</span>
            <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:text-red-800 uppercase tracking-tighter">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );

  const AdminSidebar = () => (
    <aside className="w-64 admin-sidebar h-screen bg-white fixed left-0 top-0 flex flex-col p-6 no-print">
      <div className="flex items-center gap-2 mb-12">
        <div className="bg-[#2E7D32] p-1.5 rounded-lg text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </div>
        <span className="font-poppins font-bold text-lg text-[#2E7D32]">Admin Panel</span>
      </div>

      <div className="space-y-1 flex-grow">
        <SidebarBtn active={adminPage === 'dashboard'} onClick={() => setAdminPage('dashboard')} icon="📊" label="Dashboard" />
        <SidebarBtn active={adminPage === 'manage-products'} onClick={() => setAdminPage('manage-products')} icon="📦" label="Products" />
        <SidebarBtn active={adminPage === 'manage-machinery'} onClick={() => setAdminPage('manage-machinery')} icon="🚜" label="Machinery" />
        <SidebarBtn active={adminPage === 'manage-videos'} onClick={() => setAdminPage('manage-videos')} icon="🎬" label="Videos" />
        <SidebarBtn active={adminPage === 'view-reports'} onClick={() => setAdminPage('view-reports')} icon="📑" label="Reports" />
      </div>

      <button onClick={handleLogout} className="mt-auto flex items-center gap-3 p-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all">
        <span>🚪</span> Logout
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen">
      {currentUser.role === 'admin' ? (
        <div className="pl-64">
          <AdminSidebar />
          <header className="bg-white px-8 py-5 border-b flex justify-between items-center no-print">
            <h2 className="text-xl font-bold font-poppins text-gray-800 uppercase tracking-wide">
              {adminPage.replace('-', ' ')}
            </h2>
            <div className="flex items-center gap-4">
               <span className="text-sm text-gray-400">System Administrator</span>
               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">A</div>
            </div>
          </header>
          <main className="p-8">
            <AdminRouter 
              page={adminPage} 
              products={products} setProducts={setProducts}
              machinery={machinery} setMachinery={setMachinery}
              videos={videos} setVideos={setVideos}
              bills={bills}
            />
          </main>
        </div>
      ) : (
        <div className="pt-24">
          <UserNavbar />
          <main className="max-w-7xl mx-auto px-6 pb-12">
            <UserRouter 
              page={userPage} setPage={setUserPage}
              search={searchQuery}
              products={products}
              machinery={machinery}
              videos={videos}
              cart={cart} setCart={setCart}
              selectedItem={selectedItem} setSelectedItem={setSelectedItem}
              setBills={setBills}
            />
          </main>
        </div>
      )}
    </div>
  );
};

// --- ROUTERS ---
const UserRouter: React.FC<any> = ({ page, setPage, search, products, machinery, videos, cart, setCart, selectedItem, setSelectedItem, setBills }) => {
  const filteredProducts = useMemo(() => products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase())), [products, search]);
  
  switch(page) {
    case 'home': return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-emerald-800 rounded-3xl p-12 text-white relative overflow-hidden mb-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">Empowering Farmers with <br/>AI Precision.</h2>
            <p className="text-emerald-100 text-lg mb-10 opacity-90">Detect plant diseases early, analyze soil health, and forecast your harvest all in one integrated hub.</p>
            <div className="flex gap-4">
              <button onClick={() => setPage('plant-prediction')} className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">Soil Analyzer</button>
              <button onClick={() => setPage('crop-recommendation')} className="bg-emerald-700/50 backdrop-blur-md border border-emerald-400/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all">Crop Selection</button>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
          <HomeTile icon="🩺" label="Disease Scanner" sub="AI Diagnostic" onClick={() => setPage('symptoms')} />
          <HomeTile icon="📊" label="IoT Monitor" sub="Live Telemetry" onClick={() => setPage('iot-dashboard')} />
          <HomeTile icon="🌾" label="Crop Recommender" sub="AI Soil Match" onClick={() => setPage('crop-recommendation')} />
          <HomeTile icon="🔮" label="Yield Predictor" sub="Harvest Forecast" onClick={() => setPage('yield-prediction')} />
          <HomeTile icon="🚜" label="Machinery" sub="Shop Equipment" onClick={() => setPage('machinery')} />
          <HomeTile icon="📽️" label="Tutorials" sub="Expert Guides" onClick={() => setPage('videos')} />
        </div>
      </div>
    );
    case 'plant-prediction': return <SoilAnalyzer onBack={() => setPage('home')} />;
    case 'symptoms': return <DiseaseScanner onBack={() => setPage('home')} />;
    case 'iot-dashboard': return <IoTDashboard onBack={() => setPage('home')} />;
    case 'crop-recommendation': return <CropRecommendationSystem onBack={() => setPage('home')} />;
    case 'yield-prediction': return <YieldPredictionSystem onBack={() => setPage('home')} />;
    case 'marketplace': return <Marketplace products={filteredProducts} cart={cart} setCart={setCart} onProceedToBill={() => setPage('bill')} />;
    case 'machinery': return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold mb-8 font-poppins text-gray-800">Available Machinery</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {machinery.map((m: any) => (
            <div key={m.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="h-48 overflow-hidden">
                <img src={m.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{m.name}</h3>
                <p className="text-emerald-700 font-bold text-lg mb-4">${m.price.toLocaleString()}</p>
                <button 
                  onClick={() => { setSelectedItem(m); setPage('machinery-details'); }}
                  className="w-full bg-gray-100 text-gray-800 py-2 rounded-xl font-bold hover:bg-emerald-800 hover:text-white transition-all"
                >View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    case 'machinery-details': return (
      <div className="animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
        <button onClick={() => setPage('machinery')} className="mb-6 font-bold text-emerald-700 flex items-center gap-2">← Back to List</button>
        {selectedItem && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border">
             <img src={selectedItem.imageUrl} className="w-full md:w-1/2 h-80 object-cover" />
             <div className="p-10 flex flex-col justify-center">
                <h2 className="text-3xl font-black mb-4">{selectedItem.name}</h2>
                <div className="text-2xl font-bold text-emerald-700 mb-6">${selectedItem.price.toLocaleString()}</div>
                <p className="text-gray-600 leading-relaxed mb-8">{selectedItem.description}</p>
                <button className="bg-emerald-800 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100">Contact Dealer</button>
             </div>
          </div>
        )}
      </div>
    );
    case 'videos': return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold mb-8 font-poppins text-gray-800">Knowledge Hub</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((v: any) => (
            <div 
              key={v.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl transition-all group"
              onClick={() => { setSelectedItem(v); setPage('video-player'); }}
            >
              <div className="relative aspect-video">
                <img src={`https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <div className="bg-white/90 p-3 rounded-full text-emerald-800 scale-75 group-hover:scale-100 transition-all">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 2.688l11.022 6.312-11.022 6.312v-12.624z" /></svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase mb-1 block">{v.category}</span>
                <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-700 transition-colors">{v.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    case 'video-player': return (
      <div className="animate-in fade-in duration-500">
        <button onClick={() => setPage('videos')} className="mb-6 font-bold text-emerald-700 flex items-center gap-2">← Back to Videos</button>
        {selectedItem && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <iframe className="w-full aspect-video" src={`https://www.youtube.com/embed/${selectedItem.youtubeId}?autoplay=1`} allowFullScreen></iframe>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-4">{selectedItem.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{selectedItem.description}</p>
            </div>
          </div>
        )}
      </div>
    );
    case 'bill': return <BillingView cart={cart} setCart={setCart} onSave={(b: any) => setBills((prev: any) => [...prev, b])} />;
    default: return null;
  }
};

const HomeTile = ({ icon, label, sub, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="font-bold text-sm mb-1">{label}</h3>
    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">{sub}</p>
  </div>
);

const AdminRouter: React.FC<any> = ({ page, products, setProducts, machinery, setMachinery, videos, setVideos, bills }) => {
  switch(page) {
    case 'dashboard': return <AdminDashboard products={products} machinery={machinery} videos={videos} bills={bills} />;
    case 'manage-products': return <ProductManagement products={products} setProducts={setProducts} />;
    case 'manage-machinery': return <MachineryManagement machinery={machinery} setMachinery={setMachinery} />;
    case 'manage-videos': return <VideoManagement videos={videos} setVideos={setVideos} />;
    case 'view-reports': return (
      <div className="animate-in slide-in-from-right duration-500">
         <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
           <h3 className="text-2xl font-bold mb-8">Sales Reports</h3>
           <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <th className="py-4">Invoice ID</th>
                  <th className="py-4">Date</th>
                  <th className="py-4">Customer</th>
                  <th className="py-4 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b: any) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-5 font-bold font-mono text-emerald-700">{b.id}</td>
                    <td className="py-5 text-gray-500">{b.date}</td>
                    <td className="py-5 font-semibold">{b.customer}</td>
                    <td className="py-5 text-right font-black text-lg">${b.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
           </table>
         </div>
      </div>
    );
    default: return null;
  }
};

// --- SUB-COMPONENTS ---
const Login = ({ onLogin }: any) => {
  const [role, setRole] = useState<Role>('user');
  const [username, setUsername] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-white">
        <div className="text-center mb-10">
          <div className="bg-emerald-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-800">
             <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
          </div>
          <h1 className="text-3xl font-extrabold font-poppins text-slate-900">Agriculture Hub</h1>
          <p className="text-slate-500 mt-2 font-medium">Please sign in to continue</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button onClick={() => setRole('user')} className={`flex-grow py-3 rounded-xl font-bold text-sm transition-all ${role === 'user' ? 'bg-white shadow-md text-emerald-800' : 'text-slate-400'}`}>USER</button>
          <button onClick={() => setRole('admin')} className={`flex-grow py-3 rounded-xl font-bold text-sm transition-all ${role === 'admin' ? 'bg-white shadow-md text-emerald-800' : 'text-slate-400'}`}>ADMIN</button>
        </div>

        <div className="space-y-6">
           <input 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium focus:border-emerald-500 outline-none transition-all" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
           />
           <input 
              type="password"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium focus:border-emerald-500 outline-none transition-all" 
              placeholder="Password (Try anything)" 
           />
           <button 
             onClick={() => onLogin({ id: '1', username: username || 'Farmer', role })}
             className="w-full bg-emerald-800 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100 active:scale-[0.98] transition-all"
           >Sign In</button>
        </div>
      </div>
    </div>
  );
};

const NavLink = ({ active, onClick, children }: any) => (
  <button onClick={onClick} className={`text-sm font-bold transition-all px-2 ${active ? 'text-[#2E7D32]' : 'text-gray-500 hover:text-gray-900'}`}>{children}</button>
);

const SidebarBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-400 hover:bg-gray-50'
    }`}
  >
    <span className="text-lg">{icon}</span> {label}
  </button>
);

const BillingView = ({ cart, setCart, onSave }: any) => {
  const total = cart.reduce((acc: any, i: any) => acc + (i.p.price * i.q), 0);
  const handleCheckout = () => {
    onSave({ id: `INV-${Date.now()}`, date: new Date().toLocaleDateString(), customer: 'Active Farmer', total, items: cart.map((i:any) => i.p.name) });
    window.print();
    setCart([]);
  };
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
        <div className="flex justify-between items-start mb-16 border-b pb-10">
          <div>
            <h1 className="text-4xl font-black text-emerald-800 mb-2">INVOICE</h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Smart Farmer Systems</p>
          </div>
          <div className="text-right">
             <p className="text-gray-400 text-xs font-bold uppercase mb-1">Date</p>
             <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b border-gray-900 text-xs font-black uppercase tracking-widest text-gray-400">
              <th className="py-4">Item</th>
              <th className="py-4 text-center">Qty</th>
              <th className="py-4 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-50 text-sm">
                <td className="py-6 font-bold">{item.p.name}</td>
                <td className="py-6 text-center">{item.q}</td>
                <td className="py-6 text-right font-black">${(item.p.price * item.q).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-emerald-800 rounded-2xl p-8 text-white flex justify-between items-center mb-12">
           <span className="text-xl font-bold opacity-80">Grand Total Due</span>
           <span className="text-4xl font-black">${total.toFixed(2)}</span>
        </div>
        <button onClick={handleCheckout} className="no-print w-full bg-emerald-950 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-100">Generate & Print PDF Bill</button>
      </div>
    </div>
  );
};

export default App;
