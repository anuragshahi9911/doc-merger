import React from 'react';

interface ProgressTrackerProps {
  progress: number;
  message: string;
  isProcessing: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, message, isProcessing }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Processing Files
        </h3>
        <span className="text-sm font-medium text-gray-600">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="progress-bar mb-4">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center text-sm text-gray-600">
        {isProcessing && (
          <div className="animate-spin mr-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        )}
        <span>{message || 'Ready to process files...'}</span>
      </div>
    </div>
  );
};

export default ProgressTracker; 