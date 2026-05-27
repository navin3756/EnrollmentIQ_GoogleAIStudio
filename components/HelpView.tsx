import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, Book, FileCode, ChevronRight, ExternalLink, Mail, Phone, LifeBuoy, TrendingUp, Target, Zap, ShieldCheck, DollarSign, BrainCircuit } from 'lucide-react';

const HelpView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'docs' | 'pitch'>('docs');

  const faqs = [
    { q: "What is an 834 file?", a: "The EDI 834 is the Benefit Enrollment and Maintenance document used to transfer enrollment information between employers and health insurance plans." },
    { q: "How do I fix validation errors?", a: "Navigate to the Ingestion view, click on a file with 'Review Needed' status, go to the Members tab, and use the 'View' button on failed records to fix them." },
    { q: "How does AI Auto-Remediation work?", a: "EnrollmentIQ applies 70+ ML rules instantly to identify and provide high-confidence fixes for common issues like name typos, FIPS code mismatches, and gender code inference." },
    { q: "Can I map segments to a custom database?", a: "Yes, use the Mapping Studio to define target fields and Routing Hub to configure your database connection string." },
    { q: "What is a 997 Acknowledgment?", a: "A 997 is a functional acknowledgment that tells the sender their EDI transmission was received and whether it was syntactically correct." }
  ];

  const handleDownloadSample = () => {
    const sampleContent = `ISA*00*          *00*          *ZZ*SENDERID       *ZZ*RECEIVERID     *240507*1200*U*00501*000000001*0*T*:~
GS*BE*SENDERID*RECEIVERID*20240507*1200*1*X*005010X220A1~
ST*834*0001~
BGN*00*FILE001*20240507*1200****~
INS*Y*18*021*20~
NM1*IL*1*WONDER*ALICE****34*123456789~
N3*100 RABBIT HOLE~
N4*WONDERLAND*NY*14201**36029~
DMG*D8*19950322*X~
INS*Y*18*021*20~
NM1*IL*1*BUCKET*CHARLIE****34*987654321~
N3*1 FACTORY LANE~
N4*LONDON*NY*10001~
DMG*D8*20100812*X~
SE*15*0001~
GE*1*1~
IEA*1*000000001~`;

    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SAMPLE_ENROLLMENT_ERROR.834';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Support & Information</h2>
          <p className="text-slate-400 text-sm mt-1">Documentation, FAQs, and Platform Presentations</p>
        </div>
        
        {/* Toggle inside header area on desktop, below on mobile */}
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 w-full md:w-auto">
           <button 
              onClick={() => setActiveTab('docs')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'docs' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
           >
              Documentation
           </button>
           <button 
              onClick={() => setActiveTab('pitch')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'pitch' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
           >
              <TrendingUp size={16} /> Investor Pitch
           </button>
        </div>
      </div>

      {activeTab === 'docs' ? (
        <>
          <div className="flex justify-end w-full">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><MessageSquare size={20} className="text-blue-400" /> Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors group cursor-default">
                      <h4 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                        {faq.q}
                        <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                    </div>
                  )) : (
                    <p className="text-center py-8 text-slate-500 italic">No matching articles found.</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><FileCode size={20} className="text-emerald-400" /> EDI 834 Segment Reference</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900/50 text-slate-500 uppercase font-bold tracking-widest">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Segment</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3 rounded-r-lg">Common Elements</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        <SegmentRow id="BGN" desc="Beginning Segment" elements="Purpose Code, Reference ID" />
                        <SegmentRow id="INS" desc="Member Level Detail" elements="Insured Indicator, Relationship" />
                        <SegmentRow id="NM1" desc="Member Name" elements="Entity ID, Name, SSN/ID" />
                        <SegmentRow id="DMG" desc="Demographic Information" elements="DOB, Gender, Marital Status" />
                        <SegmentRow id="HD" desc="Health Coverage" elements="Maintenance Type, Plan Code" />
                      </tbody>
                    </table>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10 w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                  <LifeBuoy size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">Need Direct Help?</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed relative z-10">Our implementation specialists are available 24/7 for Enterprise Tier support.</p>
                <div className="space-y-3 relative z-10">
                  <a 
                    href="mailto:support@enrollmentiq.io?subject=Support%20Request"
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Contact Support <Mail size={14} />
                  </a>
                  <button 
                    onClick={() => alert('Demo scheduling interface opening... One of our specialists will contact you.')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                  >
                    Schedule a Demo <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <SidebarLink 
                    icon={Book} 
                    label="API Reference (Mock)" 
                    onClick={() => alert('The Technical API Documentation is restricted to active sandbox environments. Please contact your account manager for access tokens.')}
                  />
                  <SidebarLink 
                    icon={ExternalLink} 
                    label="Official X12.org" 
                    href="https://x12.org/"
                  />
                  <SidebarLink 
                    icon={FileCode} 
                    label="Download Sample 834" 
                    onClick={handleDownloadSample}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <InvestorPitchDeck />
      )}
    </div>
  );
};

const InvestorPitchDeck: React.FC = () => {
   return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
         {/* Title Slide */}
         <div className="bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-indigo-900/50 rounded-3xl p-10 lg:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full"></div>
            <div className="relative z-10 max-w-4xl">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs tracking-widest uppercase mb-8">
                  <TrendingUp size={14} /> Seed Round Pitch Deck
               </div>
               <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                  Eliminating the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">$4.5B</span> Manual Correction Problem in Healthcare.
               </h1>
               <p className="text-xl text-indigo-200/80 leading-relaxed font-light max-w-3xl">
                  EnrollmentIQ is an AI-powered 834 EDI platform that validates and auto-corrects enrollment files with 92% accuracy, replacing legacy flagging systems with autonomous remediation.
               </p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* The Problem */}
             <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-xl">
                 <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <Target className="text-red-400" size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-4">The Problem</h3>
                 <p className="text-slate-400 leading-relaxed mb-6">
                    Legacy competitors only flag errors in EDI files. They don't fix them. Currently, health plans spend millions hiring manual data entry staff to correct typographical errors, mismatched FIPS codes, and invalid dates in benefit enrollments.
                 </p>
                 <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                       <span className="mt-1 text-red-400 font-bold block">×</span>
                       <span>Slow enrollment processing causes delays in member care and coverage.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                       <span className="mt-1 text-red-400 font-bold block">×</span>
                       <span>Health plans face steep compliance penalties for inaccurate reporting.</span>
                    </li>
                 </ul>
             </div>

             {/* The Solution */}
             <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                 <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 relative z-10">
                    <Zap className="text-emerald-400" size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Our Solution</h3>
                 <p className="text-slate-400 leading-relaxed mb-6 relative z-10">
                    Our auto-remediation engine applies 70+ continuous-learning ML rules to fix errors instantly. We evaluate complex cases using confidence scoring, auto-correcting what we can, and providing human-reviewable suggestions for edge cases.
                 </p>
                 <ul className="space-y-3 relative z-10">
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                       <span className="mt-1 text-emerald-400 font-bold block">✓</span>
                       <span>Fixes typos, dates, and state-specific logic (NY eMedNY FIPS).</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                       <span className="mt-1 text-emerald-400 font-bold block">✓</span>
                       <span>Validates & corrects 10,000+ members in under 5 seconds.</span>
                    </li>
                 </ul>
             </div>
         </div>

         {/* The Value Proposition */}
         <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 lg:p-12 shadow-xl">
             <div className="text-center mb-10">
                 <h3 className="text-2xl md:text-3xl font-bold text-white">Why Investors Care</h3>
                 <p className="text-slate-400 mt-2">The measurable impact of replacing manual workflows with autonomous agents.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="text-center px-4">
                     <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-400 flex items-center justify-center rounded-2xl mb-4 border border-blue-500/20"><DollarSign size={28} /></div>
                     <div className="text-3xl font-extrabold text-white mb-2">$2-5M</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Cost Savings per Plan</div>
                 </div>
                 <div className="text-center px-4">
                     <div className="w-16 h-16 mx-auto bg-amber-500/10 text-amber-400 flex items-center justify-center rounded-2xl mb-4 border border-amber-500/20"><Zap size={28} /></div>
                     <div className="text-3xl font-extrabold text-white mb-2">10x</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Faster Processing Speed</div>
                 </div>
                 <div className="text-center px-4">
                     <div className="w-16 h-16 mx-auto bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl mb-4 border border-emerald-500/20"><ShieldCheck size={28} /></div>
                     <div className="text-3xl font-extrabold text-white mb-2">100%</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">HIPAA Output Compliance</div>
                 </div>
                 <div className="text-center px-4">
                     <div className="w-16 h-16 mx-auto bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-2xl mb-4 border border-indigo-500/20"><BrainCircuit size={28} /></div>
                     <div className="text-3xl font-extrabold text-white mb-2">92%</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Auto-Correction Accuracy</div>
                 </div>
             </div>
         </div>
      </div>
   )
};

const SegmentRow = ({ id, desc, elements }: any) => (
  <tr className="hover:bg-slate-700/20 transition-colors">
    <td className="px-4 py-4 font-mono font-bold text-indigo-400">{id}</td>
    <td className="px-4 py-4 text-slate-300">{desc}</td>
    <td className="px-4 py-4 text-slate-500 italic">{elements}</td>
  </tr>
);

const SidebarLink = ({ icon: Icon, label, href, onClick }: any) => {
  const content = (
    <>
      <Icon size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
      <span>{label}</span>
    </>
  );

  const className = "w-full flex items-center gap-3 p-2 text-sm text-slate-400 hover:text-white transition-colors group text-left";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};

export default HelpView;