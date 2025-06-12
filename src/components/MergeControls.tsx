import React from 'react';
import { FileItem, MergeType } from '../App';

interface MergeControlsProps {
  files: FileItem[];
  onRemoveFile: (fileId: string) => void;
  onClearAll: () => void;
  onMerge: () => void;
  isProcessing: boolean;
  mergeType: MergeType;
}

const getFileIcon = (fileName: string, mergeType: MergeType) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (mergeType === 'pdf' || extension === 'pdf') {
    return (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    );
  } else if (mergeType === 'zip' || ['zip', 'rar', '7z'].includes(extension || '')) {
    return (
      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  } else {
    return (
      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
};

const getStatusBadge = (status: FileItem['status']) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
  
  switch (status) {
    case 'ready':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Ready</span>;
    case 'pending':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    case 'processing':
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Processing</span>;
    case 'completed':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
    case 'error':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Error</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
  }
};

const MergeControls: React.FC<MergeControlsProps> = ({ 
  files, 
  onRemoveFile, 
  onClearAll, 
  onMerge, 
  isProcessing, 
  mergeType 
}) => {
  if (files.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-3 7 7 13-13 3 3-16 16L7 21z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Files Added</h3>
        <p className="text-gray-600">Add files using the methods above to get started</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Files to Merge ({files.length})
        </h3>
        <button
          onClick={onClearAll}
          disabled={isProcessing}
          className="btn-secondary text-sm"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {getFileIcon(file.name, mergeType)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                {file.type === 'url' && (
                  <p className="text-xs text-gray-500 truncate">
                    {file.url}
                  </p>
                )}
              </div>
              {getStatusBadge(file.status)}
            </div>
            <button
              onClick={() => onRemoveFile(file.id)}
              disabled={isProcessing}
              className="ml-3 text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <button
          onClick={onMerge}
          disabled={isProcessing || files.length < 2}
          className="btn-primary w-full text-lg py-3"
        >
          {isProcessing ? 'Merging Files...' : `Merge ${files.length} Files`}
        </button>
        
        {files.length < 2 && !isProcessing && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Add at least 2 files to enable merging
          </p>
        )}
      </div>
    </div>
  );
};

export default MergeControls; 