import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { FileText, Users, Activity, Eye, Play, Download, TrendingUp, Clock, CheckCircle, GitMerge, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import { ApiService } from '../services/mockApi';
import { DashboardStats, EnrollmentFile, FileStatus } from '../types';

interface DashboardProps {
  onSelectFile: (file: EnrollmentFile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectFile }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentFiles, setRecentFiles] = useState<EnrollmentFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const s = await ApiService.getDashboardStats();
      const f = await ApiService.getFiles();
      setStats(s);
      setRecentFiles(f);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDownloadSample = () => {
    const sampleContent = `ISA*00*          *00*          *ZZ*SENDERID       *ZZ*RECEIVERID     *231025*0830*U*00501*000000001*0*T*:~
GS*BE*SENDERID*RECEIVERID*20231025*0830*1*X*005010X220A1~
ST*834*0001~
BGN*00*FILE001*20231025*0830****~
N1*P5*PAYER NAME*FI*999999999~
INS*Y*18*030*20~
REF*0F*123456789~
NM1*IL*1*DOE*JOHN****MI*111223333~
PER*IP**TE*5551234567~
N3*123 MAIN ST~
N4*ANYTOWN*NY*12345~
DMG*D8*19800101*M~
HD*030**HLT~
DTP*348*D8*20240101~
SE*13*0001~
GE*1*1~
IEA*1*000000001~`;

    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SAMPLE_834_ENROLLMENT.edi';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const chartData = [
    { name: 'Mon', throughput: 400, errors: 20 },
    { name: 'Tue', throughput: 300, errors: 45 },
    { name: 'Wed', throughput: 550, errors: 10 },
    { name: 'Thu', throughput: 480, errors: 30 },
    { name: 'Fri', throughput: 620, errors: 15 },
  ];

  if (loading) return (
    <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Translator Console</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Global ingestion & transformation monitoring</p>
        </div>
        <button 
          onClick={handleDownloadSample}
          className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-bold text-white transition duration-300 ease-out border border-blue-600 dark:border-blue-500 rounded-lg shadow-md hover:shadow-xl group"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 dark:bg-blue-600 group-hover:translate-x-0 ease">
             <Download size={18} />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-blue-600 dark:text-blue-100 transition-all duration-300 transform group-hover:translate-x-full ease">Download EDI 834 Template</span>
          <span className="relative invisible">Download EDI 834 Template</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
            title="Auto-Corrected Records" 
            value={stats.aiCorrectedRecords?.toLocaleString() || '0'} 
            icon={Activity} 
            trend="92.4% Accuracy" 
            gradient="from-blue-600 to-indigo-400" 
        />
        <StatCard 
            title="Estimated Cost Avoided" 
            value={stats.costSaved || '$0'} 
            icon={TrendingUp} 
            trend="Reduced manual review" 
            gradient="from-emerald-600 to-teal-400" 
        />
        <StatCard 
            title="Continuous Learning" 
            value="70+ Rules" 
            icon={Activity} 
            trend="Active ML Models" 
            gradient="from-violet-600 to-purple-400" 
        />
         <StatCard 
            title="Average Latency" 
            value="4.2s / 10K" 
            icon={Clock} 
            trend="10x Faster Processing" 
            gradient="from-amber-500 to-orange-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table - Glassmorphism */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Transaction Log</h3>
             <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold">Clear Logs</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100/80 dark:bg-slate-800/50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 font-bold rounded-l-lg text-[10px] tracking-wider">Inbound Resource</th>
                  <th className="px-4 py-3 font-bold text-[10px] tracking-wider">997 ACK</th>
                  <th className="px-4 py-3 font-bold text-[10px] tracking-wider">Status</th>
                  <th className="px-4 py-3 font-bold text-[10px] tracking-wider">Format</th>
                  <th className="px-4 py-3 font-bold text-right rounded-r-lg text-[10px] tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {recentFiles.map((file) => (
                  <tr key={file.fileId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                        <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 shadow-sm">
                             <FileText size={14} />
                        </div>
                        {file.fileName}
                    </td>
                    <td className="px-4 py-4">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                         file.ackStatus === 'Sent' 
                           ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' 
                           : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                       }`}>
                          {file.ackStatus || 'Pending'}
                       </span>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${
                             file.status === FileStatus.PROCESSED ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'
                           }`}></div>
                           <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{file.status}</span>
                       </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                        {file.targetFormat}
                    </td>
                    <td className="px-4 py-4 text-right">
                       <button 
                         onClick={() => onSelectFile(file)}
                         className="p-2 bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                       >
                          <Play size={14} fill="currentColor" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Performance</h3>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                 <TrendingUp size={16} />
              </div>
           </div>
           
           <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                    <defs>
                       <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#f8fafc' 
                      }} 
                    />
                    <Area type="monotone" dataKey="throughput" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorThroughput)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
           
           <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-xs text-slate-500 dark:text-slate-400">ML Confidence Score Avg</span>
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-100">96.8%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-violet-500 w-[96%] h-full rounded-full"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, gradient }: any) => (
  <div className={`relative overflow-hidden bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] cursor-default`}>
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-[0.03] dark:opacity-[0.07] rounded-bl-[100px]`}></div>
    <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
            <Icon size={20} />
        </div>
        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{trend}</div>
    </div>
    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{title}</div>
    <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
  </div>
);

export default Dashboard;