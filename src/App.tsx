import React, { useState, useCallback } from 'react';
import FileUrlInput from './components/FileUrlInput';
import FileUpload from './components/FileUpload';
import ProgressTracker from './components/ProgressTracker';
import MergeControls from './components/MergeControls';
import { fileMergerService } from './services/fileMergerService';

export interface FileItem {
  id: string;
  name: string;
  type: 'url' | 'upload';
  status: 'pending' | 'ready' | 'processing' | 'completed' | 'error';
  url?: string;
  file?: File;
}

export interface ProgressData {
  percentage: number;
  message: string;
}

export type MergeType = 'pdf' | 'zip' | 'csv' | 'text';

const MERGE_TYPES: Record<string, MergeType> = {
  PDF: 'pdf',
  ZIP: 'zip',
  CSV: 'csv',
  TEXT: 'text'
};

const App: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [mergeType, setMergeType] = useState<MergeType>(MERGE_TYPES.PDF);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFilesFromUrls = useCallback((urlList: string[]) => {
    const newFiles: FileItem[] = urlList.map((url, index) => ({
      id: `url-${index}-${Date.now()}`,
      url: url.trim(),
      name: url.split('/').pop() || `file-${index + 1}`,
      type: 'url',
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  }, []);

  const handleFilesFromUpload = useCallback((uploadedFiles: FileList) => {
    const newFiles: FileItem[] = Array.from(uploadedFiles).map((file, index) => ({
      id: `upload-${index}-${Date.now()}`,
      file,
      name: file.name,
      type: 'upload',
      status: 'ready'
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    setProgress(0);
    setStatusMessage('');
    setError('');
  }, []);

  const handleMergeFiles = useCallback(async () => {
    if (files.length < 2) {
      setError('Please add at least 2 files to merge');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError('');
    setStatusMessage('Starting merge process...');

    try {
      const onProgress = (progressData: ProgressData) => {
        setProgress(progressData.percentage);
        setStatusMessage(progressData.message);
      };

      const result = await fileMergerService.mergeFiles(files, mergeType, onProgress);
      
      if (result.success) {
        setStatusMessage('Files merged successfully! Download started.');
        setProgress(100);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Merge failed: ${errorMessage}`);
      setStatusMessage('');
    } finally {
      setIsProcessing(false);
    }
  }, [files, mergeType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            File Merger
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Merge multiple files directly in your browser. 
            Support for PDFs, ZIP archives, CSV files, and text documents.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Merge Type Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Merge Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(MERGE_TYPES).map(([key, value]) => (
                <button
                  key={value}
                  onClick={() => setMergeType(value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    mergeType === value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{key}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    .{value} files
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File Input Methods */}
          <div className="grid md:grid-cols-2 gap-8">
            <FileUrlInput 
              onFilesAdded={handleFilesFromUrls}
              disabled={isProcessing}
            />
            <FileUpload 
              onFilesAdded={handleFilesFromUpload}
              disabled={isProcessing}
              acceptedTypes={mergeType}
            />
          </div>

          {/* Progress Tracker */}
          {(isProcessing || progress > 0) && (
            <ProgressTracker 
              progress={progress}
              message={statusMessage}
              isProcessing={isProcessing}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-600 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* File List and Merge Controls */}
          <MergeControls
            files={files}
            onRemoveFile={removeFile}
            onClearAll={clearAllFiles}
            onMerge={handleMergeFiles}
            isProcessing={isProcessing}
            mergeType={mergeType}
          />
        </div>
      </div>
    </div>
  );
};

export default App; 