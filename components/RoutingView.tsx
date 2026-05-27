import React, { useEffect, useState } from 'react';
import { Send, Plus, Globe, Shield, Radio, Activity, CheckCircle, XCircle, MoreVertical, Link2, ExternalLink, Settings, X, Database, FileJson, FileCode, FileText } from 'lucide-react';
import { ApiService } from '../services/mockApi';
import { RoutingConfig } from '../types';

const RoutingView: React.FC = () => {
  const [configs, setConfigs] = useState<RoutingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: '', type: 'SFTP', endpoint: '', format: 'JSON' });

  useEffect(() => {
    const load = async () => {
      const data = await ApiService.getRoutingConfigs();
      setConfigs(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleAddChannel = () => {
      if(!newChannel.name || !newChannel.endpoint) return;
      
      const config: RoutingConfig = {
          id: Date.now().toString(),
          name: newChannel.name,
          type: newChannel.type as any,
          endpoint: newChannel.endpoint,
          status: 'Active' // Default to active for demo
      };
      
      setConfigs([...configs, config]);
      setIsAddModalOpen(false);
      setNewChannel({ name: '', type: 'SFTP', endpoint: '', format: 'JSON' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Outbound Routing</h2>
          <p className="text-slate-400 text-sm mt-1">Manage delivery endpoints and secure transmission channels</p>
        </div>
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus size={18} /> Add Channel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
                <Activity className="animate-pulse mb-4" size={40} />
                <p>Establishing secure channel links...</p>
            </div>
        ) : configs.map((config) => (
          <div key={config.id} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl bg-slate-900 border border-slate-700 ${config.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <ChannelIcon type={config.type} />
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                        config.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-700/50 text-slate-500 border-slate-700'
                    }`}>
                        {config.status}
                    </span>
                    <button className="p-1 text-slate-500 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{config.name}</h3>
            <p className="text-slate-400 text-xs font-mono truncate mb-6 flex items-center gap-2">
                <Link2 size={12} className="text-blue-400" />
                {config.endpoint}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <Activity size={12} className={config.status === 'Active' ? 'text-emerald-500' : ''} />
                    Latency: {config.status === 'Active' ? '45ms' : '--'}
                </div>
                <button className="flex items-center gap-1.5 text-xs text-blue-400 font-bold hover:underline">
                    View Logs <ExternalLink size={12} />
                </button>
            </div>
            
            {/* Ambient hover glow */}
            <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${
                config.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'
            }`}></div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-slate-500">
            <Settings size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Global Routing Policies</h3>
        <p className="text-slate-400 text-sm max-w-lg mb-6">
            Configure automatic failover, retry logic, and encryption standards for all outbound data streams. All transmissions are AES-256 encrypted by default.
        </p>
        <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-sm font-medium transition-all">
            Manage Global Policies
        </button>
      </div>

      {/* Add Channel Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                <h3 className="text-lg font-bold text-white mb-6">Configure New Outbound Channel</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Channel Name</label>
                        <input 
                            type="text" 
                            value={newChannel.name} 
                            onChange={(e) => setNewChannel({...newChannel, name: e.target.value})} 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-emerald-500 outline-none" 
                            placeholder="e.g. Partner DB Prod" 
                        />
                    </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Transport Protocol</label>
                        <div className="grid grid-cols-4 gap-2">
                             {['SFTP', 'API', 'DB', 'S3'].map(type => (
                                 <button 
                                    key={type}
                                    onClick={() => setNewChannel({...newChannel, type})}
                                    className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                                        newChannel.type === type 
                                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                    }`}
                                 >
                                     {type}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Output Format</label>
                         <div className="grid grid-cols-4 gap-2">
                             {[
                                 { id: 'JSON', icon: FileJson }, 
                                 { id: 'XML', icon: FileCode }, 
                                 { id: 'CSV', icon: FileText }, 
                                 { id: 'SQL', icon: Database }
                             ].map(fmt => (
                                 <button 
                                    key={fmt.id}
                                    onClick={() => setNewChannel({...newChannel, format: fmt.id})}
                                    className={`p-2 rounded-lg text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                                        newChannel.format === fmt.id 
                                        ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                    }`}
                                 >
                                     <fmt.icon size={16} />
                                     {fmt.id}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destination Endpoint</label>
                        <input 
                            type="text" 
                            value={newChannel.endpoint} 
                            onChange={(e) => setNewChannel({...newChannel, endpoint: e.target.value})} 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm font-mono focus:border-emerald-500 outline-none" 
                            placeholder={newChannel.type === 'DB' ? 'jdbc:postgresql://...' : 'https://api...'} 
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            onClick={handleAddChannel} 
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            Create Channel
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const ChannelIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'DB': return <Radio size={24} />;
        case 'API': return <Globe size={24} />;
        case 'SFTP': return <Shield size={24} />;
        default: return <Send size={24} />;
    }
};

export default RoutingView;