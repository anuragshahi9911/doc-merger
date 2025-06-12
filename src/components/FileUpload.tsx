import React, { useRef, useState } from 'react';
import { MergeType } from '../App';

interface FileUploadProps {
  onFilesAdded: (files: FileList) => void;
  disabled: boolean;
  acceptedTypes: MergeType;
}

const getAcceptAttribute = (mergeType: MergeType): string => {
  switch (mergeType) {
    case 'pdf':
      return '.pdf';
    case 'zip':
      return '.zip,.rar,.7z';
    case 'csv':
      return '.csv';
    case 'text':
      return '.txt,.md';
    default:
      return '*';
  }
};

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded, disabled, acceptedTypes }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFilesAdded(files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Files
      </h3>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptAttribute(acceptedTypes)}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
          </svg>
          <p className="mb-2 text-sm">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Accepted: {getAcceptAttribute(acceptedTypes)} files
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <div className="flex items-start">
          <div className="text-green-600 mr-2 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Local File Processing:</p>
            <ul className="space-y-1 text-xs">
              <li>• Files are processed entirely in your browser</li>
              <li>• No data is sent to external servers</li>
              <li>• Support for multiple file selection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 