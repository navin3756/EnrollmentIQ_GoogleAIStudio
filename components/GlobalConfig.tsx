import React from 'react';
import { Save, Globe, Lock, Bell, RefreshCw, Shield } from 'lucide-react';

const GlobalConfig: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Global Configuration</h2>
          <p className="text-slate-400 text-sm mt-1">Application-wide settings and defaults</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Globe size={20} className="text-blue-400"/> General Settings</h3>
          
          <div className="space-y-4">
             <SettingToggle label="Maintenance Mode" description="Suspend all incoming file processing" />
             <SettingToggle label="Debug Logging" description="Enable verbose transaction logs" active />
             <SettingToggle label="Auto-Archive" description="Move processed files to cold storage after 30 days" active />
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Lock size={20} className="text-emerald-400"/> Security Policies</h3>
          
          <div className="space-y-4">
             <SettingToggle label="Enforce MFA" description="Require Multi-Factor Authentication for all admins" active />
             <SettingToggle label="IP Whitelisting" description="Restrict API access to known IP ranges" />
             <SettingToggle label="PII Masking" description="Mask member SSN and DOB in logs" active />
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ label, description, active = false }: { label: string, description: string, active?: boolean }) => {
    const [isOn, setIsOn] = React.useState(active);
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
            <div>
                <p className="text-sm font-bold text-slate-200">{label}</p>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
            <button 
                onClick={() => setIsOn(!isOn)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isOn ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isOn ? 'left-7' : 'left-1'}`}></div>
            </button>
        </div>
    );
}

export default GlobalConfig;