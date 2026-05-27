import React, { useEffect, useState } from 'react';
import { Users, UserPlus, MoreVertical, Shield, Mail, Clock, ShieldCheck, UserCog, Trash2, Search } from 'lucide-react';
import { ApiService } from '../services/mockApi';
import { TeamMember } from '../types';

const TeamAccess: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await ApiService.getTeamMembers();
      setMembers(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Team Access Control</h2>
          <p className="text-slate-400 text-sm mt-1">Manage organizational users, roles, and resource permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
          <UserPlus size={18} /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Stats Section */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl">
               <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <ShieldCheck size={20} />
                    </div>
                    <h3 className="font-bold text-white">RBAC Active</h3>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed mb-4">Role-Based Access Control is enforced for all transformation logs and PII fields.</p>
               <div className="space-y-2">
                    <RoleCounter label="Administrators" count={1} />
                    <RoleCounter label="Editors" count={2} />
                    <RoleCounter label="Auditors" count={1} />
               </div>
           </div>

           <div className="bg-gradient-to-br from-blue-900/20 to-slate-800/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-white mb-2">Security Policy</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">MFA is required for all Admin actions. Session timeout set to 60 minutes of inactivity.</p>
                <button className="text-[10px] font-bold text-blue-400 hover:underline">Update Security Settings</button>
           </div>
        </div>

        {/* Members List Section */}
        <div className="lg:col-span-3">
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-bold text-white px-2">Manage Users</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input type="text" placeholder="Filter by name or email..." className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-64 transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 font-bold">Member</th>
                                <th className="px-6 py-4 font-bold">Role</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Last Activity</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">Accessing IAM records...</td></tr>
                            ) : members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-700/20 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-md">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{member.name}</p>
                                                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                    <Mail size={10} /> {member.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Shield size={12} className={member.role === 'Admin' ? 'text-blue-400' : 'text-slate-500'} />
                                            <span className="text-xs font-medium text-slate-300">{member.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                            member.status === 'Active' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <Clock size={12} /> {member.lastActive}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all" title="Manage Permissions">
                                                <UserCog size={16} />
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all" title="Remove Member">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const RoleCounter = ({ label, count }: { label: string, count: number }) => (
    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <span className="text-xs text-slate-300">{label}</span>
        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">{count}</span>
    </div>
);

export default TeamAccess;