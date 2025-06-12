import React, { useState } from 'react';

interface FileUrlInputProps {
  onFilesAdded: (urls: string[]) => void;
  disabled: boolean;
}

const FileUrlInput: React.FC<FileUrlInputProps> = ({ onFilesAdded, disabled }) => {
  const [urlInput, setUrlInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlInput.trim()) return;
    
    const urls = urlInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urls.length > 0) {
      onFilesAdded(urls);
      setUrlInput('');
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add Files from URLs
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
            File URLs (one per line)
          </label>
          <textarea
            id="url-input"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/file1.pdf&#10;https://example.com/file2.pdf"
            rows={4}
            className="input-field resize-vertical"
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !urlInput.trim()}
          className="btn-primary w-full"
        >
          {disabled ? 'Processing...' : 'Add Files'}
        </button>
      </form>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <div className="text-blue-600 mr-2 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Enter one URL per line</li>
              <li>• Make sure URLs are publicly accessible</li>
              <li>• CORS policies may prevent some downloads</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUrlInput; 