
import React, { useState } from 'react';
import { AgricultureVideo } from '../types';

const VideoManagement = ({ videos, setVideos }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<AgricultureVideo>>({ title: '', youtubeId: '', category: 'Education' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeId) return;
    const item: AgricultureVideo = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title!,
      youtubeId: formData.youtubeId!,
      description: formData.description || 'Expert agricultural tutorial.',
      category: formData.category || 'Education'
    };
    setVideos([...videos, item]);
    setShowModal(false);
  };

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Tutorial Management</h2>
        <button onClick={() => setShowModal(true)} className="bg-emerald-800 text-white px-6 py-2.5 rounded-full font-bold">+ Upload Video Info</button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <table className="w-full text-left">
           <thead className="bg-gray-50 text-xs font-black uppercase text-gray-400">
              <tr>
                <th className="p-6">Title</th>
                <th className="p-6">Category</th>
                <th className="p-6">YouTube ID</th>
                <th className="p-6 text-center">Action</th>
              </tr>
           </thead>
           <tbody>
              {videos.map((v: any) => (
                <tr key={v.id} className="border-b border-gray-50">
                   <td className="p-6 font-bold">{v.title}</td>
                   <td className="p-6 text-emerald-600 font-bold text-xs">{v.category}</td>
                   <td className="p-6 font-mono text-xs">{v.youtubeId}</td>
                   <td className="p-6 text-center">
                      <button onClick={() => setVideos(videos.filter((i:any) => i.id !== v.id))} className="text-red-500 font-bold">Delete</button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10">
              <h3 className="text-2xl font-bold mb-8">Publish New Video</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                 <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" placeholder="Video Title" onChange={e => setFormData({...formData, title: e.target.value})} />
                 <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" placeholder="YouTube Video ID (e.g. mK6K1o6v-gQ)" onChange={e => setFormData({...formData, youtubeId: e.target.value})} />
                 <input className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none" placeholder="Category (e.g. Harvesting)" onChange={e => setFormData({...formData, category: e.target.value})} />
                 <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none h-24" placeholder="Brief video summary..." onChange={e => setFormData({...formData, description: e.target.value})} />
                 <div className="flex gap-4 mt-8">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-grow py-4 rounded-2xl font-bold text-gray-500">Cancel</button>
                    <button type="submit" className="flex-grow bg-emerald-800 text-white py-4 rounded-2xl font-bold">Publish to User App</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;
