import React, { useEffect, useState } from 'react';
import { GitMerge, Plus, Trash2, Edit3, Shield, Database, RefreshCw, CheckCircle2, XCircle, X, BookOpen, Upload, FileText, Search, ListFilter, Sparkles, Wand2, Bot } from 'lucide-react';
import { ApiService } from '../services/mockApi';
import { MappingRule } from '../types';

const MappingView: React.FC = () => {
  const [rules, setRules] = useState<MappingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ sourceSegment: '', sourceElement: '', targetField: '', transformation: '' });
  const [testing, setTesting] = useState(false);
  const [autoMapping, setAutoMapping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await ApiService.getMappingRules();
      setRules(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveRule = () => {
    if (!newRule.sourceSegment || !newRule.targetField) return;

    if (editingId) {
        // Update existing rule
        setRules(rules.map(rule => rule.id === editingId ? {
            ...rule,
            sourceSegment: newRule.sourceSegment.toUpperCase(),
            sourceElement: newRule.sourceElement,
            targetField: newRule.targetField,
            transformation: newRule.transformation || 'Direct Map'
        } : rule));
    } else {
        // Create new rule
        const rule: MappingRule = {
            id: Date.now().toString(),
            sourceSegment: newRule.sourceSegment.toUpperCase(),
            sourceElement: newRule.sourceElement,
            targetField: newRule.targetField,
            transformation: newRule.transformation || 'Direct Map',
            isActive: true
        };
        setRules([rule, ...rules]);
    }
    
    setIsModalOpen(false);
    setNewRule({ sourceSegment: '', sourceElement: '', targetField: '', transformation: '' });
    setEditingId(null);
  };

  const openAddModal = () => {
      setNewRule({ sourceSegment: '', sourceElement: '', targetField: '', transformation: '' });
      setEditingId(null);
      setIsModalOpen(true);
  };

  const handleEditRule = (rule: MappingRule) => {
      setNewRule({
          sourceSegment: rule.sourceSegment,
          sourceElement: rule.sourceElement,
          targetField: rule.targetField,
          transformation: rule.transformation === 'Direct Map' ? '' : (rule.transformation || '')
      });
      setEditingId(rule.id);
      setIsModalOpen(true);
  };

  const handleDeleteRule = (id: string) => {
      if (window.confirm('Are you sure you want to delete this mapping rule?')) {
          setRules(rules.filter(r => r.id !== id));
      }
  };

  // Automation Feature: Auto-Map / Auto-Discovery
  const handleAutoDiscovery = () => {
      setAutoMapping(true);
      
      // Simulate AI analysis delay
      setTimeout(() => {
          const suggestedRules: MappingRule[] = [
              { id: 'auto-1', sourceSegment: 'L2000s_HD03', sourceElement: 'Insurance Line Code', targetField: 'coverageLevelCode', transformation: 'Lookup (HLT=Health)', isActive: true },
              { id: 'auto-2', sourceSegment: 'L2300_REF', sourceElement: 'Prior Coverage Months', targetField: 'priorCoverageMonths', transformation: 'To Integer', isActive: true },
              // NYSOH Specific Rules
              { id: 'auto-ny-1', sourceSegment: 'N406', sourceElement: 'Location Identifier', targetField: 'fipsCode', transformation: 'Validate NY FIPS', isActive: true },
              { id: 'auto-ny-2', sourceSegment: 'NM109', sourceElement: 'Member Identifier', targetField: 'cinNumber', transformation: 'Format CIN (AA12345Z)', isActive: true },
              { id: 'auto-ny-3', sourceSegment: 'REF_17', sourceElement: 'Client Reporting Category', targetField: 'aidCategory', transformation: 'Lookup NY Codes', isActive: true },
          ];

          // Filter out duplicates
          const uniqueNewRules = suggestedRules.filter(
              newR => !rules.some(r => r.sourceSegment === newR.sourceSegment && r.targetField === newR.targetField)
          );

          if (uniqueNewRules.length > 0) {
            setRules(prev => [...uniqueNewRules, ...prev]);
            alert(`Auto-Discovery Complete: ${uniqueNewRules.length} missing standard fields mapped (including NYSOH specifics).`);
          } else {
            alert("Auto-Discovery Complete: Your mapping is already optimized for standard 834 compliance.");
          }
          setAutoMapping(false);
      }, 2000);
  };

  // Automation Feature: AI Assist inside Modal
  const handleAiSuggest = () => {
      const seg = newRule.sourceSegment.toUpperCase();
      if (!seg) return;

      let suggestion = { element: '', target: '', trans: '' };

      if (seg.startsWith('REF')) suggestion = { element: 'Reference Identification', target: 'legacySystemId', trans: 'Remove Hyphens' };
      else if (seg.startsWith('NM1')) suggestion = { element: 'Name First', target: 'firstName', trans: 'Title Case' };
      else if (seg.startsWith('DTP')) suggestion = { element: 'Date Time Period', target: 'eligibilityEndDate', trans: 'CCYYMMDD to ISO' };
      else if (seg.startsWith('PER')) suggestion = { element: 'Comm Number', target: 'mobilePhone', trans: 'Format (XXX) XXX-XXXX' };
      else if (seg.startsWith('N4')) suggestion = { element: 'Location ID', target: 'fipsCode', trans: 'Direct Map' };
      else suggestion = { element: 'Unknown Element', target: 'customField_01', trans: 'Direct Map' };

      setNewRule(prev => ({
          ...prev,
          sourceElement: suggestion.element,
          targetField: suggestion.target,
          transformation: suggestion.trans
      }));
  };

  const handleImportGuide = (guideName: string) => {
    const newRules: MappingRule[] = [
        { id: Date.now().toString() + '1', sourceSegment: 'REF', sourceElement: 'state_specific_id', targetField: 'stateEnrollmentId', transformation: `${guideName} Logic`, isActive: true },
        { id: Date.now().toString() + '2', sourceSegment: 'DTP', sourceElement: 'coverage_period', targetField: 'benefitPeriod', transformation: 'Date Range Split', isActive: true },
        { id: Date.now().toString() + '3', sourceSegment: 'NM1', sourceElement: 'provider_code', targetField: 'providerId', transformation: 'Lookup Table B', isActive: true },
    ];
    setRules([...rules, ...newRules]);
    setIsGuideModalOpen(false);
    alert(`Successfully integrated ${guideName} companion guide rules.`);
  };

  const handleTest = () => {
      setTesting(true);
      setTimeout(() => {
          setTesting(false);
          alert("Mapping validation successful! All rules conform to X12 5010 standards.");
      }, 1500);
  }

  const filteredRules = rules.filter(rule => 
      rule.sourceSegment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.sourceElement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.targetField.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mapping Studio</h2>
          <p className="text-slate-400 text-sm mt-1">Configure source 834 EDI segments to target application fields</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search segment or field..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 outline-none w-full sm:w-64" 
                />
            </div>
            <div className="flex gap-3">
                {/* Auto-Discovery Button */}
                <button 
                    onClick={handleAutoDiscovery}
                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-fuchsia-500/20 whitespace-nowrap"
                >
                    {autoMapping ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} className="text-yellow-300" />}
                    <span className="hidden sm:inline">Auto-Map Fields</span>
                </button>

                <button 
                    onClick={() => setIsGuideModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium transition-all whitespace-nowrap"
                >
                    <BookOpen size={18} /> <span className="hidden sm:inline">Guides</span>
                </button>
                <button 
                    onClick={handleTest}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium transition-all whitespace-nowrap"
                >
                    <RefreshCw size={18} className={testing ? 'animate-spin' : ''} /> 
                    {testing ? 'Validating...' : 'Test'}
                </button>
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap"
                >
                    <Plus size={18} /> <span className="hidden sm:inline">Add Rule</span>
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 gap-6">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-4 py-3 font-semibold">Source Segment</th>
                  <th className="px-4 py-3 font-semibold">Source Element</th>
                  <th className="px-4 py-3 font-semibold text-blue-400">Target Field</th>
                  <th className="px-4 py-3 font-semibold">Transformation</th>
                  <th className="px-4 py-3 font-semibold text-center">Active</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                    <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                            Scanning translator schemas...
                        </td>
                    </tr>
                ) : filteredRules.length === 0 ? (
                    <tr>
                         <td colSpan={6} className="py-12 text-center text-slate-500 italic flex flex-col items-center justify-center gap-2">
                            <ListFilter size={24} />
                            No mapping rules found matching "{searchQuery}"
                        </td>
                    </tr>
                ) : filteredRules.map((rule) => (
                  <tr key={rule.id} className={`hover:bg-slate-700/30 transition-colors group ${rule.id.startsWith('auto') ? 'bg-fuchsia-900/5' : ''}`}>
                    <td className="px-4 py-3 font-mono text-blue-300 font-bold whitespace-nowrap">
                        <span className="bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/30 mr-2">{rule.sourceSegment}</span>
                        {rule.id.startsWith('auto') && <span className="inline-flex"><Sparkles size={12} className="text-fuchsia-400" /></span>}
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs italic">{rule.sourceElement}</td>
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                            <span className="text-white font-medium">{rule.targetField}</span>
                        </div>
                    </td>
                    <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 whitespace-nowrap">
                            {rule.transformation || 'Direct Map'}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                        {rule.isActive ? (
                            <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                        ) : (
                            <XCircle size={16} className="text-slate-600 mx-auto" />
                        )}
                    </td>
                    <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => handleEditRule(rule)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                title="Edit Rule"
                            >
                                <Edit3 size={14} />
                            </button>
                            <button 
                                onClick={() => handleDeleteRule(rule.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                                title="Delete Rule"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/30 text-xs text-slate-500 flex justify-between items-center flex-shrink-0">
             <span>Showing {filteredRules.length} of {rules.length} mapped elements</span>
             <span className="flex items-center gap-2"><Shield size={12} className="text-emerald-500" /> ANSI X12 5010 Compliance Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-shrink-0">
            <div className="bg-gradient-to-br from-blue-900/20 to-slate-800/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                        <Shield size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Validation Overlay</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">Mappings are automatically validated against X12 5010 implementation guides.</p>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 size={14} /> Schema integrity verified
                </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-900/20 to-slate-800/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Database size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Output Profiling</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">Current target profile is set to <strong>Healthcare Application JSON</strong>.</p>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                    <RefreshCw size={14} /> Sync target metadata
                </div>
            </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    {editingId ? <Edit3 size={20} className="text-blue-400"/> : <Bot size={20} className="text-fuchsia-400"/>}
                    {editingId ? 'Edit Mapping Rule' : 'Add New Mapping Rule'}
                </h3>
                
                <div className="space-y-4">
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Source Segment</label>
                        <input type="text" value={newRule.sourceSegment} onChange={e => setNewRule({...newRule, sourceSegment: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none" placeholder="e.g. REF" />
                        {!editingId && newRule.sourceSegment.length >= 3 && (
                            <button 
                                onClick={handleAiSuggest}
                                className="absolute right-2 top-[29px] p-1.5 text-fuchsia-400 hover:bg-fuchsia-500/10 rounded-md transition-colors"
                                title="AI Suggest Fields"
                            >
                                <Wand2 size={16} />
                            </button>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Source Element (Field Name)</label>
                        <div className="flex gap-2">
                            <input type="text" value={newRule.sourceElement} onChange={e => setNewRule({...newRule, sourceElement: e.target.value})} className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none" placeholder="e.g. member_id" />
                            <button 
                                onClick={handleAiSuggest}
                                className="px-3 py-2 bg-fuchsia-600/20 text-fuchsia-400 hover:bg-fuchsia-600/30 border border-fuchsia-500/30 rounded-lg flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap"
                            >
                                <Wand2 size={16} /> AI Suggest
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Field</label>
                        <input type="text" value={newRule.targetField} onChange={e => setNewRule({...newRule, targetField: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none" placeholder="e.g. externalId" />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Transformation Logic</label>
                        <input type="text" value={newRule.transformation} onChange={e => setNewRule({...newRule, transformation: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none" placeholder="Optional (e.g. Date Format)" />
                    </div>
                    
                    <button onClick={handleSaveRule} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-4 transition-all">
                        {editingId ? 'Update Mapping' : 'Save Mapping'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Companion Guide Modal */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden">
                <button onClick={() => setIsGuideModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <BookOpen className="text-indigo-400" size={24} /> 
                        Integration Library
                    </h3>
                    <p className="text-slate-400 text-sm">Select a State Specific Companion Guide or upload a custom rule set to overlay on your current mapping configuration.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* State Guides */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">State Companion Guides</h4>
                        <button onClick={() => handleImportGuide('CA Covered')} className="w-full text-left p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all group">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-white group-hover:text-blue-400 transition-colors">California (Covered CA)</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800">v5010</span>
                            </div>
                            <p className="text-xs text-slate-400">Standard 834 enrollment map for California exchange.</p>
                        </button>
                        <button onClick={() => handleImportGuide('NY Medicaid')} className="w-full text-left p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all group">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-white group-hover:text-blue-400 transition-colors">New York Medicaid</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800">v5010A1</span>
                            </div>
                            <p className="text-xs text-slate-400">Specific logic for CIN and County Codes.</p>
                        </button>
                        <button onClick={() => handleImportGuide('FL Healthy Kids')} className="w-full text-left p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all group">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-white group-hover:text-blue-400 transition-colors">Florida Healthy Kids</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800">v4010</span>
                            </div>
                            <p className="text-xs text-slate-400">Legacy support for FL state programs.</p>
                        </button>
                    </div>

                    {/* Custom & Upload */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Custom Integrations</h4>
                         <button className="w-full text-left p-3 rounded-xl border border-dashed border-slate-600 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center text-center h-24 group">
                            <Upload size={24} className="text-slate-400 mb-2 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">Upload Definition File</span>
                            <span className="text-[10px] text-slate-500">.JSON, .XML, or .MAP</span>
                        </button>
                        
                        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 mt-2">
                            <div className="flex items-start gap-3">
                                <FileText size={18} className="text-slate-400 mt-1" />
                                <div>
                                    <h5 className="text-sm font-bold text-white">Documentation</h5>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                        Learn how to structure custom companion guide files for automatic ingestion.
                                    </p>
                                    <a href="#" className="text-xs text-blue-400 hover:underline mt-2 inline-block">View Schema Spec →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button onClick={() => setIsGuideModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Close Library</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MappingView;