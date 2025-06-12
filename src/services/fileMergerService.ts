import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PDFMerger from 'pdf-merger-js';
import { FileItem, MergeType, ProgressData } from '../App';

interface MergeResult {
  success: boolean;
  error?: string;
}

class FileMergerService {
  async mergeFiles(
    files: FileItem[], 
    mergeType: MergeType, 
    onProgress: (progress: ProgressData) => void
  ): Promise<MergeResult> {
    try {
      onProgress({ percentage: 0, message: 'Starting file processing...' });

      // Download files first if they are URLs
      const downloadedFiles = await this.downloadFiles(files, onProgress);
      
      onProgress({ percentage: 50, message: 'Merging files...' });

      // Merge based on type
      let mergedBlob: Blob;
      let fileName: string;

      switch (mergeType) {
        case 'pdf':
          const result = await this.mergePDFs(downloadedFiles);
          mergedBlob = result.blob;
          fileName = result.fileName;
          break;
        case 'zip':
          const zipResult = await this.mergeAsZip(downloadedFiles);
          mergedBlob = zipResult.blob;
          fileName = zipResult.fileName;
          break;
        case 'csv':
          const csvResult = await this.mergeCSVs(downloadedFiles);
          mergedBlob = csvResult.blob;
          fileName = csvResult.fileName;
          break;
        case 'text':
          const textResult = await this.mergeTextFiles(downloadedFiles);
          mergedBlob = textResult.blob;
          fileName = textResult.fileName;
          break;
        default:
          throw new Error(`Unsupported merge type: ${mergeType}`);
      }

      onProgress({ percentage: 90, message: 'Preparing download...' });

      // Save the merged file
      saveAs(mergedBlob, fileName);

      onProgress({ percentage: 100, message: 'Download started!' });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errorMessage };
    }
  }

  private async downloadFiles(
    files: FileItem[], 
    onProgress: (progress: ProgressData) => void
  ): Promise<Array<{ name: string; data: ArrayBuffer | string; file?: File }>> {
    const downloadedFiles: Array<{ name: string; data: ArrayBuffer | string; file?: File }> = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progressPercentage = Math.round((i / totalFiles) * 40); // 0-40% for downloads
      
      onProgress({ 
        percentage: progressPercentage, 
        message: `Downloading ${file.name}...` 
      });

      if (file.type === 'url' && file.url) {
        try {
          const response = await axios.get(file.url, {
            responseType: 'arraybuffer',
            timeout: 30000, // 30 second timeout
            headers: {
              'Accept': '*/*',
            }
          });
          downloadedFiles.push({
            name: file.name,
            data: response.data
          });
        } catch (error) {
          throw new Error(`Failed to download ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else if (file.type === 'upload' && file.file) {
        const arrayBuffer = await file.file.arrayBuffer();
        downloadedFiles.push({
          name: file.name,
          data: arrayBuffer,
          file: file.file
        });
      }
    }

    return downloadedFiles;
  }

  private async mergePDFs(files: Array<{ name: string; data: ArrayBuffer | string; file?: File }>): Promise<{ blob: Blob; fileName: string }> {
    const merger = new PDFMerger();

    for (const file of files) {
      if (file.data instanceof ArrayBuffer) {
        await merger.add(new Uint8Array(file.data));
      } else if (file.file) {
        // Convert File to ArrayBuffer first
        const fileArrayBuffer = await file.file.arrayBuffer();
        await merger.add(new Uint8Array(fileArrayBuffer));
      }
    }

    const mergedPdfBuffer = await merger.saveAsBuffer();
    const blob = new Blob([mergedPdfBuffer], { type: 'application/pdf' });
    
    return {
      blob,
      fileName: `merged-${Date.now()}.pdf`
    };
  }

  private async mergeAsZip(files: Array<{ name: string; data: ArrayBuffer | string; file?: File }>): Promise<{ blob: Blob; fileName: string }> {
    const zip = new JSZip();

    for (const file of files) {
      if (file.data instanceof ArrayBuffer) {
        zip.file(file.name, file.data);
      } else if (typeof file.data === 'string') {
        zip.file(file.name, file.data);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    return {
      blob: zipBlob,
      fileName: `merged-files-${Date.now()}.zip`
    };
  }

  private async mergeCSVs(files: Array<{ name: string; data: ArrayBuffer | string; file?: File }>): Promise<{ blob: Blob; fileName: string }> {
    let mergedContent = '';
    let headerAdded = false;

    for (const file of files) {
      let content: string;
      
      if (file.data instanceof ArrayBuffer) {
        content = new TextDecoder().decode(file.data);
      } else {
        content = file.data as string;
      }

      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) continue;

      if (!headerAdded) {
        // Add header from first file
        mergedContent += lines[0] + '\n';
        headerAdded = true;
        // Add data rows from first file
        mergedContent += lines.slice(1).join('\n') + '\n';
      } else {
        // Skip header, add only data rows from subsequent files
        mergedContent += lines.slice(1).join('\n') + '\n';
      }
    }

    const blob = new Blob([mergedContent.trim()], { type: 'text/csv' });
    
    return {
      blob,
      fileName: `merged-data-${Date.now()}.csv`
    };
  }

  private async mergeTextFiles(files: Array<{ name: string; data: ArrayBuffer | string; file?: File }>): Promise<{ blob: Blob; fileName: string }> {
    let mergedContent = '';

    for (const file of files) {
      let content: string;
      
      if (file.data instanceof ArrayBuffer) {
        content = new TextDecoder().decode(file.data);
      } else {
        content = file.data as string;
      }

      mergedContent += `\n\n=== ${file.name} ===\n\n`;
      mergedContent += content;
    }

    const blob = new Blob([mergedContent.trim()], { type: 'text/plain' });
    
    return {
      blob,
      fileName: `merged-text-${Date.now()}.txt`
    };
  }

  // Utility method to validate file type
  validateFileType(fileName: string, expectedType: MergeType): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (expectedType) {
      case 'pdf':
        return extension === 'pdf';
      case 'zip':
        return ['zip', 'rar', '7z'].includes(extension);
      case 'csv':
        return extension === 'csv';
      case 'text':
        return ['txt', 'md', 'text'].includes(extension);
      default:
        return false;
    }
  }
}

export const fileMergerService = new FileMergerService(); 