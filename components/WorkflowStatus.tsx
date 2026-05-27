import React from 'react';
import { FileStatus } from '../types';
import { Upload, Database, FileSearch, CheckCircle2, ArrowRight } from 'lucide-react';

interface WorkflowStatusProps {
  status: FileStatus;
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ status }) => {
  const steps = [
    { id: 'upload', label: 'Ingestion', icon: Upload, activeStates: [FileStatus.UPLOADED, FileStatus.STAGING, FileStatus.REVIEW_NEEDED, FileStatus.READY_TO_PROCESS, FileStatus.PROCESSED] },
    { id: 'staging', label: 'Parsing', icon: Database, activeStates: [FileStatus.STAGING, FileStatus.REVIEW_NEEDED, FileStatus.READY_TO_PROCESS, FileStatus.PROCESSED] },
    { id: 'review', label: 'Validation', icon: FileSearch, activeStates: [FileStatus.REVIEW_NEEDED, FileStatus.READY_TO_PROCESS, FileStatus.PROCESSED] },
    { id: 'integration', label: 'Production', icon: CheckCircle2, activeStates: [FileStatus.PROCESSED] },
  ];

  return (
    <div className="w-full bg-slate-800/40 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-xl">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 text-center">Enrollment Processing Pipeline</h3>
      <div className="flex items-center justify-between relative max-w-3xl mx-auto">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700/50 -z-0 -translate-y-1/2 rounded-full" />
        
        {steps.map((step, index) => {
          const isActive = step.activeStates.includes(status);
          const isCompleted = steps[index + 1]?.activeStates.includes(status);
          const isCurrent = isActive && !isCompleted;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                  ${isCurrent
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-110' 
                    : isActive 
                        ? 'bg-slate-800 border-blue-500/50 text-blue-400'
                        : 'bg-slate-900 border-slate-700 text-slate-600'
                  }`}
              >
                <step.icon size={22} className={isCurrent ? 'animate-pulse' : ''} />
              </div>
              <span className={`mt-4 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                {step.label}
              </span>
              
              {/* Connector Highlight */}
              {index < steps.length - 1 && (
                 <div className={`absolute top-1/2 left-[100%] w-[calc(100%-20px)] h-1 -translate-y-1/2 -z-10 transition-all duration-700 origin-left
                    ${isCompleted ? 'bg-blue-500 scale-x-100' : 'scale-x-0'}
                 `} style={{ width: '200px' }}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowStatus;