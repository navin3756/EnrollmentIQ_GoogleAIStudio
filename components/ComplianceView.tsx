import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2, ChevronRight, Download, Lock } from 'lucide-react';

const ComplianceView: React.FC = () => {
  const [baaAccepted, setBaaAccepted] = useState(false);
  const [slaAccepted, setSlaAccepted] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Compliance & Agreements</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Review and accept the required Business Associate Agreement (BAA) and Service Level Agreement (SLA) to use this application in a production environment with PHI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAA Card */}
        <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  HIPAA Business Associate Agreement (BAA)
                  {baaAccepted && <CheckCircle2 size={16} className="text-emerald-500" />}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Required for handling Protected Health Information (PHI) under HIPAA regulations.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="h-40 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 font-mono leading-relaxed">
              <p>HIPAA BUSINESS ASSOCIATE AGREEMENT</p>
              <br />
              <p>This Business Associate Agreement ("BAA") is entered into by and between EnrollmentIQ ("Business Associate") and the Customer ("Covered Entity").</p>
              <br />
              <p>1. Obligations and Activities of Business Associate:</p>
              <p>Business Associate agrees to not use or disclose Protected Health Information (PHI) other than as permitted or required by the Agreement or as required by law.</p>
              <p>Business Associate agrees to use appropriate safeguards to prevent use or disclosure of the PHI.</p>
              <br />
              <p>2. Data Security & Encryption:</p>
              <p>All PHI processed by the AI-Remediation Engine is encrypted at rest (AES-256) and in transit (TLS 1.3). No plain-text PHI is persisted in our audit logs.</p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors">
                <Download size={16} /> Download PDF
              </button>
              
              {!baaAccepted ? (
                <button 
                  onClick={() => setBaaAccepted(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  Accept & Sign BAA <ChevronRight size={16} />
                </button>
              ) : (
                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-semibold flex items-center gap-2 border border-emerald-500/20">
                  <CheckCircle2 size={16} /> Accepted on {new Date().toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SLA Card */}
        <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Service Level Agreement (SLA)
                  {slaAccepted && <CheckCircle2 size={16} className="text-emerald-500" />}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Uptime guarantees, support response times, and throughput commitments.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="h-40 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 font-mono leading-relaxed">
              <p>ENTERPRISE SERVICE LEVEL AGREEMENT</p>
              <br />
              <p>1. Uptime Commitment:</p>
              <p>EnrollmentIQ guarantees a 99.99% monthly average uptime for the API and frontend console.</p>
              <br />
              <p>2. Performance Target:</p>
              <p>834 EDI files containing up to 10,000 members will be parsed and remediated in under 5.0 seconds (P95).</p>
              <br />
              <p>3. Support Response:</p>
              <p>Critical issues (Priority 1): 15-minute response time, 24/7/365.</p>
              <p>Standard support: 4 business hours.</p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors">
                <Download size={16} /> Download PDF
              </button>
              
              {!slaAccepted ? (
                <button 
                  onClick={() => setSlaAccepted(true)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  Accept SLA <ChevronRight size={16} />
                </button>
              ) : (
                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-semibold flex items-center gap-2 border border-emerald-500/20">
                  <CheckCircle2 size={16} /> Accepted on {new Date().toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {baaAccepted && slaAccepted && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Lock size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Production Ready</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              All compliance agreements have been accepted. Your organization is authorized to process live PHI data and route 834 transactions to trading partners.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceView;
