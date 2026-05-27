import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, Check, AlertTriangle, Loader2, CloudLightning } from 'lucide-react';
import { ApiService } from '../services/mockApi';
import { EnrollmentFile } from '../types';

interface FileUploadProps {
  onUploadSuccess: (file: EnrollmentFile) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processUpload(files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    if (!file.name.endsWith('.edi') && !file.name.endsWith('.txt') && !file.name.endsWith('.x12')) {
      setError('Invalid file format. Security protocols require .EDI, .TXT, or .X12 extensions.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(90);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setProgress(100);
      setTimeout(() => onUploadSuccess(result), 500);
    } catch (err) {
      setError('Secure upload handshake failed. Please check network connection.');
    } finally {
      setTimeout(() => setUploading(false), 800);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl p-1 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-2xl transition-colors duration-300">
        <div 
          className={`relative rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-300 min-h-[400px] border-2 border-dashed
            ${isDragging 
              ? 'border-blue-500 bg-blue-500/10 scale-[0.99]' 
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input 
            id="fileInput" 
            type="file" 
            className="hidden" 
            onChange={handleFileInput}
            accept=".edi,.txt,.x12"
          />

          {uploading ? (
            <div className="flex flex-col items-center w-full max-w-xs">
              <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
                  <Loader2 className="h-16 w-16 text-blue-500 dark:text-blue-400 animate-spin relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analyzing Data Structure...</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">Validating ANSI X12 compliance & HIPAA rules</p>
              
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest">{progress}% Processed</div>
            </div>
          ) : (
            <>
              <div className={`p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-slate-200 dark:border-slate-700 ${isDragging ? 'shadow-blue-500/20' : ''}`}>
                <CloudLightning className={`h-10 w-10 ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-300'}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">Inbound EDI Ingestion</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
                Drag and drop your 834 EDI file here, or click to browse. Processing is accelerated by the AI remediation engine.
              </p>
              
              <div className="flex gap-3">
                 <FileTypeBadge ext="X12" />
                 <FileTypeBadge ext="834" />
                 <FileTypeBadge ext="EDI" />
              </div>
            </>
          )}

          {error && (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-300 animate-in slide-in-from-bottom-2">
              <AlertTriangle size={20} className="shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Backend Watcher Info */}
      <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-2xl flex items-start gap-4">
        <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400">
          <UploadCloud size={24} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-1">Automated Bulk Ingestion Active</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xl">
            A background file watcher is monitoring the <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded text-indigo-400 font-mono">uploads/watch</code> directory.
            Any EDI files dropped here will be automatically parsed, remediated by the AI engine, and added to your staging queue.
          </p>
        </div>
      </div>
    </div>
  );
};

const FileTypeBadge = ({ ext }: { ext: string }) => (
    <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 flex items-center gap-2">
        <FileText size={12} /> {ext}
    </div>
);

export default FileUpload;