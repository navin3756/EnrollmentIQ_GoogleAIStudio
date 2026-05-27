import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileUp, Settings, Bell, Search, User, Menu, GitMerge, Send, Database, ShieldCheck, Activity, HelpCircle, Sparkles, Moon, Sun, Shield, Cpu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import StagingView from './components/StagingView';
import WorkflowStatus from './components/WorkflowStatus';
import MappingView from './components/MappingView';
import RoutingView from './components/RoutingView';
import SystemSettings from './components/SystemSettings';
import TeamAccess from './components/TeamAccess';
import FeaturesView from './components/FeaturesView';
import HelpView from './components/HelpView';
import GlobalConfig from './components/GlobalConfig';
import ComplianceView from './components/ComplianceView';
import AgentsView from './components/AgentsView';
import { EnrollmentFile, FileStatus } from './types';

type View = 'dashboard' | 'upload' | 'review' | 'mapping' | 'routing' | 'system' | 'team' | 'features' | 'help' | 'logs' | 'config' | 'compliance' | 'agents';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedFile, setSelectedFile] = useState<EnrollmentFile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleUploadSuccess = (file: EnrollmentFile) => {
    setSelectedFile(file);
    setCurrentView('review');
  };

  const handleFileSelect = (file: EnrollmentFile) => {
    setSelectedFile(file);
    setCurrentView('review');
  };

  const handleProcessComplete = () => {
    if (selectedFile) {
        setSelectedFile({
            ...selectedFile,
            status: FileStatus.PROCESSED,
            processedDate: new Date().toISOString()
        });
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <WorkflowStatus status={FileStatus.UPLOADED} />
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        );
      case 'review':
        return selectedFile ? (
          <StagingView 
            file={selectedFile} 
            onBack={() => setCurrentView('dashboard')}
            onProcessComplete={handleProcessComplete}
          />
        ) : (
          <div className="text-red-400">Error: No file selected</div>
        );
      case 'mapping':
        return <MappingView />;
      case 'routing':
        return <RoutingView />;
      case 'system':
        return <SystemSettings />;
      case 'team':
        return <TeamAccess />;
      case 'features':
        return <FeaturesView />;
      case 'help':
        return <HelpView />;
      case 'config':
        return <GlobalConfig />;
      case 'compliance':
        return <ComplianceView />;
      case 'agents':
        return <AgentsView />;
      default:
        return <Dashboard onSelectFile={handleFileSelect} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* Ambient Background Animation */}
      <div className="fixed inset-0 w-full h-full bg-slate-50 dark:bg-slate-900 z-0 overflow-hidden pointer-events-none transition-colors duration-500">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar - Glassmorphism */}
      <aside className="w-72 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white flex-shrink-0 hidden md:flex flex-col z-10 relative transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck size={24} className="text-white" />
             </div>
             <div>
                <div className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Enrollment<span className="text-blue-600 dark:text-blue-400">IQ</span></div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">AI-Powered 834 EDI Platform</p>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4">Core Console</div>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
          />
          <SidebarItem 
            icon={Sparkles} 
            label="Platform Features" 
            active={currentView === 'features'} 
            onClick={() => setCurrentView('features')} 
          />
          <SidebarItem 
            icon={FileUp} 
            label="Data Ingestion" 
            active={currentView === 'upload'} 
            onClick={() => setCurrentView('upload')} 
          />
          
          <div className="pt-6 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4">Transformation</div>
          <SidebarItem 
            icon={GitMerge} 
            label="Mapping Rules" 
            active={currentView === 'mapping'}
            onClick={() => setCurrentView('mapping')}
          />
          <SidebarItem 
            icon={Send} 
            label="Outbound Routing" 
            active={currentView === 'routing'}
            onClick={() => setCurrentView('routing')}
          />
          <SidebarItem 
            icon={Cpu} 
            label="Autonomous Agents" 
            active={currentView === 'agents'}
            onClick={() => setCurrentView('agents')}
          />
          
          <div className="pt-6 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4">System</div>
          <SidebarItem 
            icon={Activity} 
            label="Health & Scaling" 
            active={currentView === 'system'}
            onClick={() => setCurrentView('system')}
          />
          <SidebarItem 
            icon={User} 
            label="Team Access" 
            active={currentView === 'team'}
            onClick={() => setCurrentView('team')}
          />
           <SidebarItem 
            icon={HelpCircle} 
            label="Documentation" 
            active={currentView === 'help'}
            onClick={() => setCurrentView('help')}
          />
          <SidebarItem 
            icon={Settings} 
            label="Global Config" 
            active={currentView === 'config'}
            onClick={() => setCurrentView('config')}
          />
          <SidebarItem 
            icon={Shield} 
            label="Compliance & SLA" 
            active={currentView === 'compliance'}
            onClick={() => setCurrentView('compliance')}
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-100/50 dark:bg-slate-800/20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-sm shadow-md text-white">AD</div>
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Admin User</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Billing: Pro Plan</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        {/* Glass Header */}
        <header className="h-16 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-6 flex-shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Menu /></button>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 hidden md:block tracking-wide">
              {currentView === 'dashboard' && 'AI Remediation Center'}
              {currentView === 'upload' && 'Secure ML Ingestion'}
              {currentView === 'review' && 'AI Translation & Remediation Console'}
              {currentView === 'mapping' && 'ML Rules Canvas'}
              {currentView === 'routing' && 'Outbound Channel Hub'}
              {currentView === 'system' && 'Infrastructure & Scaling'}
              {currentView === 'team' && 'Identity & Access Management'}
              {currentView === 'features' && 'Platform Capabilities'}
              {currentView === 'help' && 'Documentation Hub'}
              {currentView === 'config' && 'Global System Configuration'}
              {currentView === 'compliance' && 'Compliance & Agreements'}
              {currentView === 'agents' && 'AI Autonomous Agents Console'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search logs/members..." 
                    className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
                 />
             </div>
             <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-full transition-all"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
             >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button 
                onClick={() => setCurrentView('help')}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-full transition-all"
             >
                <HelpCircle size={20} />
             </button>
             <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-full transition-all">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 scroll-smooth">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden
      ${active 
        ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 shadow-sm' 
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
    <Icon size={18} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    {label}
  </button>
);

export default App;