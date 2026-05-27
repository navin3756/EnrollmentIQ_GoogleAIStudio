import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, Server, Activity, ArrowRight, Play, CheckCircle2, AlertTriangle, RefreshCw, Layers, Check, Database, Sparkles, AlertCircle, Terminal } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Online' | 'Needs Attention' | 'Degraded' | 'Offline';
  throughput: string;
  accuracy: string;
  issue: string | null;
  ruleContext: string;
  icon: any;
  color: string;
}

const AgentsView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-1',
      name: 'SFTP Ingestion Bot',
      role: 'Automated file watcher monitoring `/uploads/watch` directory and polling inbound health feeds.',
      status: 'Needs Attention',
      throughput: '1.2 files/sec',
      accuracy: '99.9%',
      issue: 'Ingestion Watcher stability threshold mismatch (500ms configured in watcher, 2000ms stability minimum required for NYSOH eMedNY streams).',
      ruleContext: 'PRD-007: Automated Bulk Ingestion File Watcher Service',
      icon: Server,
      color: 'blue'
    },
    {
      id: 'agent-2',
      name: '834 Semantic Parsing Bot',
      role: 'Parses raw flat EDI segments into standardized hierarchical JSON documents.',
      status: 'Online',
      throughput: '2.4K records/sec',
      accuracy: '100.0%',
      issue: 'ISA/GS Segment length out of range on occasional tailing whitespace segments.',
      ruleContext: 'PRD-001: HIPAA 5010X220A1 Compliant Parser & 10K Members Performance Limit',
      icon: Layers,
      color: 'violet'
    },
    {
      id: 'agent-3',
      name: 'Jurisdictional State Rules Bot',
      role: 'Enforces 100+ state rules and geographical validity across 56 US dental/health jurisdictions.',
      status: 'Needs Attention',
      throughput: '1.8K records/sec',
      accuracy: '94.2%',
      issue: 'Missing official NYS eMedNY county FIPS reference dictionary for zip-to-county validation rules.',
      ruleContext: 'PRD-003: State Validation (56 jurisdictions, 100+ rules, 3-tier severity structure)',
      icon: Database,
      color: 'indigo'
    },
    {
      id: 'agent-4',
      name: 'AI Auto-Remediation Bot',
      role: 'Applies continuous-learning ML models to provide 70+ automated corrections for invalid data.',
      status: 'Needs Attention',
      throughput: '950 records/sec',
      accuracy: '92.4%',
      issue: 'Remediation Rule Repository is initialized but is temporarily unlinked from ILearningService feedback loop.',
      ruleContext: 'PRD-004 / DEF-001 & DEF-002: Confidence Scoring & Continuous ML Loop Execution',
      icon: Sparkles,
      color: 'fuchsia'
    },
    {
      id: 'agent-5',
      name: 'Target Outbound Channel Bot',
      role: 'Dispatches finalized clean enrollment structures to production routing channels and generates 997 ACKs.',
      status: 'Online',
      throughput: '1.5 files/sec',
      accuracy: '100.0%',
      issue: 'Outbound dispatch retry delay set to 0s causing backpressure spikes during high-throughput loads.',
      ruleContext: 'PRD-002: 997 Functional Acknowledgment Generation (X12 005010X231A1)',
      icon: Zap,
      color: 'emerald'
    }
  ]);

  const [fixingId, setFixingId] = useState<string | null>(null);
  const [fixProgress, setFixProgress] = useState<number>(0);
  const [fixMessage, setFixMessage] = useState<string>('');
  const [agentLogs, setAgentLogs] = useState<string[]>([
    '[SFTP_INGESTION] 20:15:33 | Watcher polling active on /uploads/watch.',
    '[SEMANTIC_PARSE] 20:15:35 | Mapped transaction set 834 successfully with zero syntax errors.',
    '[STATE_VALIDATOR] 20:15:36 | Executed geospatial validation. Flagged missing FIPS elements.',
    '[REMEDIATION_ENGINE] 20:15:36 | AI Infers Erie County FIPS for member CIN2002 (Ref: ML_RULE_NY_FIPS_INFERENCE_08).',
    '[OUTBOUND_DISPATCH] 20:15:40 | Generated and dispatched 997 ACK file (Accepted Status).'
  ]);

  const triggerAgentToggle = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Offline' ? 'Online' : 'Offline';
        addLog(`[AGENT_CONTROL] Toggle agent "${a.name}" status to ${nextStatus}.`);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAgentLogs(prev => [`[LOG] ${timestamp} | ${msg}`, ...prev.slice(0, 14)]);
  };

  const handleFixAgent = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;

    setFixingId(id);
    setFixProgress(1);
    setFixMessage('Initializing system diagnostic context...');

    const messages = [
      'Scanning local environment node rules...',
      'Synthesizing remediation patch from LLM feedback loop...',
      'Running integration validation tests...',
      'Patching target schema definitions...',
      'Agent re-initialization fully successful!'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setFixProgress(prev => Math.min(prev + 20, 100));
      if (step < messages.length) {
        setFixMessage(messages[step]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setAgents(prev => prev.map(a => {
            if (a.id === id) {
              return {
                ...a,
                status: 'Online',
                accuracy: '100.0%',
                issue: null
              };
            }
            return a;
          }));
          addLog(`Autonomous patch executed successfully on ${agent.name}. Telemetry rules locked.`);
          setFixingId(null);
          setFixProgress(0);
        }, 800);
      }
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-indigo-900/40 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
         <div className="relative z-10 max-w-4xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 shadow-inner rounded-full text-blue-300 font-bold text-xs tracking-wider uppercase mb-4">
                 <Cpu size={14} className="animate-spin" /> Autonomous Co-Agents Console
             </div>
             <h2 className="text-3xl font-extrabold text-white tracking-tight">Active Mediation & Processing Agents</h2>
             <p className="text-sm text-indigo-200/80 leading-relaxed font-light mt-2 max-w-2xl">
                 Our micro-agents run high-concurrency loops to ingest, clean, validate, and route heavy EDI throughput. 
                 Resolve listed anomalies with one-click hot-patch agents configuration.
             </p>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-[40px]"></div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Agents Active</div>
              <div className="text-3xl font-bold text-white flex items-end gap-2">
                  <span>{agents.filter(a => a.status === 'Online').length}</span>
                  <span className="text-sm text-slate-500 mb-1">/ {agents.length}</span>
              </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Overall Accuracy</div>
              <div className="text-3xl font-bold text-emerald-400">98.5%</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Throughput Speed</div>
              <div className="text-3xl font-bold text-indigo-400">5.1K recs/s</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-xl">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SLA Telemetry</div>
              <div className="text-3xl font-bold text-blue-400">100.0%</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Agents Feed */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity size={18} className="text-indigo-400" /> Active System Agents List
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{agents.filter(a => a.issue).length} alerts identified</span>
              </div>

              <div className="space-y-4">
                  {agents.map(agent => {
                      const Icon = agent.icon;
                      const hasIssue = agent.issue !== null;
                      const colors: any = {
                        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                        violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
                        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                        fuchsia: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
                        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      };

                      return (
                          <div 
                              key={agent.id} 
                              className={`bg-slate-800/30 border rounded-2xl p-6 transition-all hover:border-slate-600 shadow-xl relative group ${
                                  agent.status === 'Offline' ? 'opacity-50' : ''
                              } ${hasIssue && agent.status !== 'Offline' ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-slate-700/50'}`}
                          >
                              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                                  <div className="flex gap-4">
                                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[agent.color]}`}>
                                          <Icon size={24} />
                                      </div>
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <h4 className="text-md font-bold text-white">{agent.name}</h4>
                                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                  agent.status === 'Online' 
                                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                  : agent.status === 'Offline'
                                                  ? 'bg-slate-900 text-slate-500 border border-slate-800'
                                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                              }`}>
                                                  {agent.status}
                                              </span>
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1">{agent.role}</p>
                                          <p className="text-[10px] font-mono font-semibold text-slate-500 mt-1 border-t border-slate-800 pt-1 w-fit">{agent.ruleContext}</p>
                                      </div>
                                  </div>

                                  {/* Enable/Disable Toggle button */}
                                  <div className="flex items-center gap-2 self-end sm:self-center">
                                      <span className="text-xs text-slate-500 font-bold select-none">{agent.status === 'Offline' ? 'Disabled' : 'Enabled'}</span>
                                      <button 
                                          onClick={() => triggerAgentToggle(agent.id)}
                                          className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${agent.status !== 'Offline' ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                      >
                                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${agent.status !== 'Offline' ? 'left-6' : 'left-1'}`}></div>
                                      </button>
                                  </div>
                              </div>

                              {/* Health telemetry stats */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-900/30 border border-slate-800 rounded-xl mb-4">
                                  <div>
                                      <span className="text-[10px] text-slate-500 uppercase font-bold">Inbound Speed</span>
                                      <p className="text-xs text-white font-mono font-bold mt-0.5">{agent.throughput}</p>
                                  </div>
                                  <div>
                                      <span className="text-[10px] text-slate-500 uppercase font-bold">Accuracy Index</span>
                                      <p className="text-xs text-white font-mono font-bold mt-0.5">{agent.accuracy}</p>
                                  </div>
                                  <div>
                                      <span className="text-[10px] text-slate-500 uppercase font-bold">Execution Host</span>
                                      <p className="text-xs text-indigo-300 font-mono mt-0.5">saas-cluster-01.local</p>
                                  </div>
                                  <div>
                                      <span className="text-[10px] text-slate-500 uppercase font-bold">Telemetry</span>
                                      <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Good
                                      </p>
                                  </div>
                              </div>

                              {/* Identified Issue Alert & Active Action */}
                              {hasIssue && agent.status !== 'Offline' && (
                                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-2">
                                      <div className="flex gap-2.5 items-start">
                                          <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={16} />
                                          <div>
                                              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Configuration Defect Identified</span>
                                              <p className="text-xs text-amber-200 mt-1">{agent.issue}</p>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={() => handleFixAgent(agent.id)}
                                          disabled={fixingId !== null}
                                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-amber-500/10 transition-all uppercase tracking-wider whitespace-nowrap"
                                      >
                                          One-Click hotfix
                                      </button>
                                  </div>
                              )}

                              {!hasIssue && agent.status !== 'Offline' && (
                                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs animate-in fade-in">
                                      <CheckCircle2 size={14} />
                                      <span>All active rules fully synchronized and verified with 100% compliance SLA!</span>
                                  </div>
                              )}
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* Right Column: Dynamic Progress & Logs */}
          <div className="space-y-6">
              {/* Fix Progress Box */}
              {fixingId && (
                  <div className="bg-slate-800/50 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold text-sm">
                          <RefreshCw className="animate-spin" size={18} /> Hotfix Auto-Remediation in Progress
                      </div>
                      <p className="text-xs text-blue-200 leading-relaxed font-mono bg-slate-900 border border-slate-800 rounded-lg p-3 whitespace-pre-wrap">{fixMessage}</p>
                      
                      <div className="mt-4">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                              <span>Deploying Rule</span>
                              <span>{fixProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${fixProgress}%` }}></div>
                          </div>
                      </div>
                  </div>
              )}

              {/* Immutable Audit Logs Feed */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col h-[500px]">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 flex-shrink-0">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Terminal size={14} className="text-slate-400" /> Agent Telemetry Logs
                      </h4>
                      <button onClick={() => setAgentLogs([])} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase">Clear Feed</button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs text-slate-400 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                      {agentLogs.length > 0 ? agentLogs.map((log, idx) => (
                          <div key={idx} className={`p-2 rounded rounded-bl-none border-l-2 bg-slate-900/40 ${
                              log.includes('Failed') || log.includes('error') || log.includes('defect')
                              ? 'border-red-500 text-red-200'
                              : log.includes('Remediation') || log.includes('Auto') || log.includes('Infers') || log.includes('diagnostic')
                              ? 'border-indigo-400 text-slate-200'
                              : log.includes('Online') || log.includes('verified') || log.includes('successfully')
                              ? 'border-emerald-500 text-slate-200'
                              : 'border-slate-700'
                          }`}>
                              {log}
                          </div>
                      )) : (
                          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-600 italic">
                             Stdout stream inactive... Initiate transaction to log events.
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AgentsView;
