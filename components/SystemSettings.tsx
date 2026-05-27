import React, { useEffect, useState } from 'react';
import { Activity, Server, Zap, Layers, RefreshCw, ShieldCheck, HelpCircle, ArrowRight, X, Cpu, Gauge, Settings, Sliders, Database, Folder } from 'lucide-react';
import { ApiService } from '../services/mockApi';
import { SystemMetrics } from '../types';

const SystemSettings: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Mock State for settings
  const [ackEnabled, setAckEnabled] = useState(true);
  const [dupCheck, setDupCheck] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await ApiService.getSystemMetrics();
      setMetrics(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleRestart = () => {
      setRestarting(true);
      setTimeout(() => {
          setRestarting(false);
          // Simulate metric reset
          if (metrics) setMetrics({...metrics, activeWorkers: 0, queueDepth: 0});
          setTimeout(() => {
             // Ramp up
             if (metrics) setMetrics({...metrics, activeWorkers: 8, queueDepth: 4}); 
          }, 1500);
      }, 2000);
  };

  if (loading || !metrics) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-20">
            <Activity className="animate-pulse text-blue-500 mb-4" size={48} />
            <p className="text-slate-400">Polling infrastructure nodes...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Infrastructure</h2>
          <p className="text-slate-400 text-sm mt-1">SaaS Scaling & Translator Node Monitoring</p>
        </div>
        <button 
            onClick={handleRestart}
            disabled={restarting}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-medium transition-all ${
                restarting 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 cursor-not-allowed' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
        >
          <RefreshCw size={18} className={restarting ? 'animate-spin' : ''} /> 
          {restarting ? 'Restarting Bots...' : 'Restart Workers'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Node CPU" value={`${metrics.cpuUsage}%`} icon={Cpu} color="text-blue-400" progress={metrics.cpuUsage} />
          <MetricCard title="System RAM" value={`${metrics.memoryUsage}%`} icon={Server} color="text-violet-400" progress={metrics.memoryUsage} />
          <MetricCard title="Translation Workers" value={metrics.activeWorkers} icon={Zap} color="text-amber-400" />
          <MetricCard title="Queue Depth" value={metrics.queueDepth} icon={Layers} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-emerald-500" /> Scaling Guidance (Bots Engine)
                  </h3>
                  <div className="space-y-6">
                      <ScalingItem 
                          label="Vertical Scaling" 
                          status="Optimized" 
                          description="Current node has 16GB RAM / 8 Cores. Suitable for 50k transactions/day." 
                          current={true}
                          onClick={() => setActiveModal('vertical')}
                      />
                      <ScalingItem 
                          label="Horizontal Clustering" 
                          status="Available" 
                          description="Add secondary translator nodes for high-availability failover." 
                          current={false}
                          onClick={() => setActiveModal('horizontal')}
                      />
                      <ScalingItem 
                          label="Database Sharding" 
                          status="Recommended" 
                          description="Approaching 1M records in staging. Consider sharding by Payer ID." 
                          current={false}
                          warning={true}
                          onClick={() => setActiveModal('sharding')}
                      />
                  </div>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4">Functional ACK (997) Configuration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Auto-Generation</p>
                          <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${ackEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>{ackEnabled ? 'Enabled' : 'Disabled'}</span>
                              <button 
                                onClick={() => setAckEnabled(!ackEnabled)}
                                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${ackEnabled ? 'bg-emerald-600' : 'bg-slate-700'}`}
                              >
                                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${ackEnabled ? 'left-6' : 'left-1'}`}></div>
                              </button>
                          </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Duplicate Detection</p>
                          <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${dupCheck ? 'text-blue-400' : 'text-slate-400'}`}>{dupCheck ? 'ISA+GS Check' : 'Off'}</span>
                               <button 
                                onClick={() => setDupCheck(!dupCheck)}
                                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${dupCheck ? 'bg-blue-600' : 'bg-slate-700'}`}
                              >
                                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${dupCheck ? 'left-6' : 'left-1'}`}></div>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/20 to-slate-800/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle size={20} className="text-indigo-400" /> SaaS Documentation
              </h3>
              <div className="space-y-4">
                  <DocLink title="Any-to-Any Mapping Guide" />
                  <DocLink title="Configuring SFTP Endpoints" />
                  <DocLink title="Custom SQL Output Profiles" />
                  <DocLink title="API Integration Sandbox" />
                  <div className="pt-6 border-t border-slate-700/50 mt-6">
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                          "Bots supports any-to-any format translation, offering full visibility into the transformation cycle."
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* Configuration Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                
                <div className="mb-6 flex items-center gap-3">
                    <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
                        <Sliders size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Bots Engine Configuration</h3>
                        <p className="text-sm text-slate-400">
                            {activeModal === 'vertical' && 'Vertical Scaling / Thread Management'}
                            {activeModal === 'horizontal' && 'High Availability / Clustering'}
                            {activeModal === 'sharding' && 'Database Partitioning'}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {activeModal === 'vertical' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Max Worker Processes</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="1" max="32" defaultValue="8" className="w-full accent-blue-600 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                                    <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">8</span>
                                </div>
                                <p className="text-[10px] text-slate-500">Recommended: 1 process per CPU core.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Memory Limit (Per Worker)</label>
                                <select defaultValue="2048 MB" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-sm outline-none focus:border-blue-500">
                                    <option>512 MB</option>
                                    <option>1024 MB</option>
                                    <option>2048 MB</option>
                                    <option>4096 MB</option>
                                </select>
                            </div>
                        </>
                    )}

                    {activeModal === 'horizontal' && (
                        <>
                             <div className="p-4 bg-emerald-900/10 border border-emerald-900/30 rounded-xl text-emerald-400 text-sm">
                                <span className="font-bold block mb-1">Load Balancer Detected</span>
                                Cluster is ready for additional nodes.
                             </div>
                         <>
                             <div className="flex items-center gap-2 mb-4">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <h3 className="text-sm font-bold text-white">X12 Ingestion Watcher</h3>
                             </div>
                             <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                                    <div className="text-sm text-emerald-400 font-mono flex items-center gap-2">
                                        <Activity size={12} /> ACTIVE_MONITORING
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Stability Threshold</div>
                                    <div className="text-sm text-white font-mono">2000ms</div>
                                </div>
                             </div>
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Input Hot-Folder</label>
                                    <div className="flex items-center gap-2">
                                        <input type="text" value="/uploads/watch" readOnly className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono"/>
                                        <button className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"><Folder size={16} /></button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Retention Archive</label>
                                    <input type="text" value="/uploads/processed" readOnly className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono"/>
                                </div>
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                        <Zap size={14} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">AI Integration</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                        File watcher is linked to the <span className="text-white">RemediationEngine</span>. 
                                        Files with &gt;95% auto-fix confidence are automatically moved to "Ready" status without manual intervention.
                                    </p>
                                </div>
                             </div>
                             <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Autodiscovery Endpoint</label>
                                <input type="text" value="consul://cluster-01.internal:8500" readOnly className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-sm font-mono"/>
                             </div>
                         </>
                        </>
                    )}

                     {activeModal === 'sharding' && (
                        <div className="text-center py-4">
                            <Database size={40} className="text-slate-600 mx-auto mb-3"/>
                            <p className="text-slate-300 text-sm mb-4">Sharding requires database migration. This action will invoke a maintenance window.</p>
                            <button className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-sm transition-colors">Schedule Maintenance</button>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
                    <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                    <button onClick={() => { setActiveModal(null); setRestarting(true); setTimeout(() => setRestarting(false), 2000); }} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-blue-500/20">
                        Apply & Restart
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, progress }: any) => (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
            <Icon size={18} className={color} />
        </div>
        <div className="text-2xl font-bold text-white mb-3">{value}</div>
        {progress !== undefined && (
            <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                <div className={`h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]`} style={{ width: `${progress}%` }}></div>
            </div>
        )}
    </div>
);

const ScalingItem = ({ label, status, description, current, warning, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full text-left flex gap-4 p-4 rounded-xl transition-all group hover:scale-[1.02]
            ${current 
                ? 'bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20' 
                : 'bg-slate-900/40 border border-slate-700/50 hover:border-slate-500'}`}
    >
        <div className={`p-2 rounded-lg h-fit transition-colors ${warning ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
            <Server size={18} />
        </div>
        <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{label}</h4>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${warning ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-500'}`}>{status}</span>
            </div>
            <p className="text-xs text-slate-400">{description}</p>
        </div>
        <div className="flex items-center text-slate-600 group-hover:text-slate-400">
            <Settings size={14} />
        </div>
    </button>
);

const DocLink = ({ title }: { title: string }) => (
    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-slate-300">
        <span>{title}</span>
        <ArrowRight size={14} className="text-slate-600" />
    </button>
);

export default SystemSettings;