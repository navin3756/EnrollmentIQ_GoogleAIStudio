import React, { useState } from 'react';
import { CloudLightning, GitMerge, Send, ShieldCheck, Database, Zap, Cpu, Search, Lock, Globe, BrainCircuit, LineChart, Stethoscope, Map, CheckCircle2 } from 'lucide-react';

const FeaturesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'prd'>('prd');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-700/50 justify-center">
        <button 
          onClick={() => setActiveTab('prd')}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${activeTab === 'prd' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
        >
          PRD Tracking Roadmap
          {activeTab === 'prd' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('marketing')}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${activeTab === 'marketing' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
        >
          Platform Capabilities
          {activeTab === 'marketing' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === 'prd' && (
        <div className="max-w-5xl mx-auto space-y-8">
           <div className="text-center space-y-4 mb-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Product Requirements (PRD) Tracking</h2>
            <p className="text-slate-400">
              Live status of critical path features and known critical defects for EnrollmentIQ Enterprise integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Core Features */}
             <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-200 border-b border-slate-700/50 pb-2">Production-Ready Core (PRDs)</h3>
                <PrdItem id="PRD-001" title="X12 834 Parser" description="HIPAA 5010X220A1 compliant, 10K members < 5 seconds" status="done" />
                <PrdItem id="PRD-002" title="997 Generator" description="Trading partner ready, X12 005010X231A1" status="done" />
                <PrdItem id="PRD-003" title="State Validation" description="56 jurisdictions, 100+ rules, 3-tier (Basic/Standard/Strict)" status="done" />
                <PrdItem id="PRD-004" title="AI Auto-Remediation" description="70+ fix rules, confidence scoring" status="done" />
                <PrdItem id="PRD-005" title="NY eMedNY" description="Daily/monthly reconciliation, FIPS codes, break-in-coverage" status="done" />
                <PrdItem id="PRD-006" title="HIPAA Audit" description="7-year retention, PHI logging, AES-256 encryption" status="done" />
                <PrdItem id="PRD-007" title="Automated Bulk Ingestion" description="Background file watcher service monitoring folders" status="done" />
                <PrdItem id="PRD-008" title="HIPAA BAA & SLA" description="Enterprise agreements, terms of service and compliance acceptance UI" status="done" />
             </div>

             {/* Defect Fixes */}
             <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-200 border-b border-slate-700/50 pb-2">Resolved Critical Defects (DEFs)</h3>
                <PrdItem id="DEF-001" title="IRemediationRuleRepository" description="Implemented missing interface to structure ML rules" status="done" />
                <PrdItem id="DEF-002" title="ILearningService" description="Implemented missing learning service for confidence calculation" status="done" />
                <PrdItem id="DEF-003" title="25 auto-fix methods" description="Implemented underlying structures in remediation engine" status="done" />
                <PrdItem id="DEF-004" title="Member Model Properties" description="Added missing properties: Email, Phone, ZIP, SSN" status="done" />
             </div>
          </div>
        </div>
      )}

      {activeTab === 'marketing' && (
        <>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">AI-Powered Auto-Remediation</h2>
            <p className="text-slate-400 text-lg">
              Eliminating the $4.5B manual correction problem. Guarantee 92% accuracy across all 834 inbound files using our continuous learning ML rules engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BrainCircuit}
              title="70+ ML Rules Engine"
              description="Fixes name typos, invalid gender codes, missing dates, and inferenced relationships automatically with confidence scoring."
              color="blue"
            />
            <FeatureCard 
              icon={Zap}
              title="Ultra-Low Latency"
              description="Validates and auto-corrects enrollments in under 5 seconds for batches of 10,000+ members."
              color="amber"
            />
            <FeatureCard 
              icon={Map}
              title="All 50 States Support"
              description="Out-of-the-box support for strict state-specific validation, including NYSOH eMedNY with FIPS verification."
              color="indigo"
            />
            <FeatureCard 
              icon={LineChart}
              title="Massive Cost Reduction"
              description="Health plans cut $2–5M in operational costs, processing scale-ups without adding manual data entry staff."
              color="emerald"
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="HIPAA & Audit Ready"
              description="Maintains a full immutable audit trail of every AI-driven change for compliance and security."
              color="violet"
            />
            <FeatureCard 
              icon={Stethoscope}
              title="Member Satisfaction"
              description="Process enrollments 10x faster and avoid compliance penalties, ensuring instant coverage activation for members."
              color="sky"
            />
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-2xl overflow-hidden relative mt-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">The Smart Remediation Lifecycle</h3>
                <div className="space-y-6">
                  <LifecycleStep number="01" title="Semantic Parsing" description="Upload EDI 834. The engine maps flat segments to normalized JSON." />
                  <LifecycleStep number="02" title="ML Inference Detection" description="Applies 70+ models to detect anomalies like FIPS mismatches or typo'd identifiers." />
                  <LifecycleStep number="03" title="Confidence Scoring" description="If confidence > 90%, auto-corrects. Otherwise, flags for human-reviewable suggestions." />
                  <LifecycleStep number="04" title="Final Routing" description="Cleaned, compliant data is dispatched to the health plan system instantly." />
                </div>
              </div>
              <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-2xl shadow-inner font-mono text-sm overflow-x-auto">
                 <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> EnrollmentIQ Engine output
                </div>
                <pre className="text-blue-300 leading-relaxed text-xs">
                  {`{
      "memberId": "CIN2002",
      "name": "Sarah Connor",
      "detected_errors": [
        {
          "field": "N406",
          "issue": "Missing NY FIPS Code required for eMedNY",
          "severity": "CRITICAL"
        }
      ],
      "ai_remediation": {
        "status": "AUTO_CORRECTED",
        "rule_triggered": "ML_RULE_NY_FIPS_INFERENCE_08",
        "suggested_value": "36029",
        "confidence_score": 0.985,
        "rationale": "Inferred Erie County FIPS based on zipCode 14201 and matched against active state rosters."
      },
      "processing_time_ms": 42
    }`}
                </pre>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PrdItem = ({ id, title, description, status }: any) => {
    return (
        <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800/60 transition-colors">
            <div className="pt-1">
                <CheckCircle2 className="text-emerald-500" size={20} />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md">{id}</span>
                    <h4 className="font-bold text-white text-sm">{title}</h4>
                </div>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, color }: any) => {
  const colors: any = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-all group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${colors[color]} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const LifecycleStep = ({ number, title, description }: any) => (
  <div className="flex gap-6">
    <div className="text-3xl font-black text-slate-700 shrink-0">{number}</div>
    <div>
      <h5 className="font-bold text-white mb-1">{title}</h5>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  </div>
);

export default FeaturesView;