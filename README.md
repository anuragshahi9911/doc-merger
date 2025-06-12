# File Merger App

A modern React application built with TypeScript, Tailwind CSS, and SCSS that allows users to merge multiple files directly in their browser without server-side processing.

## Features

- **Client-side Processing**: All file processing happens in the browser - no data sent to servers
- **Multiple File Types**: Support for PDFs, ZIP archives, CSV files, and text documents
- **Dual Input Methods**: 
  - Upload files directly from your device
  - Add files via URLs (with CORS considerations)
- **Real-time Progress Tracking**: Visual progress indicators during processing
- **Modern UI**: Built with Tailwind CSS and custom SCSS components
- **TypeScript**: Full type safety throughout the application

## Supported File Types

### PDF Merger
- Combines multiple PDF files into a single document
- Maintains original formatting and structure

### ZIP Archive Creator
- Packages multiple files into a single ZIP archive
- Supports various input file types

### CSV Data Merger
- Merges multiple CSV files with intelligent header handling
- Preserves data structure and combines rows

### Text File Combiner
- Concatenates multiple text files with clear separators
- Supports various text formats (.txt, .md)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd file-merger-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

### Adding Files

1. **Select Merge Type**: Choose the type of files you want to merge (PDF, ZIP, CSV, or Text)

2. **Add Files**: Use one of two methods:
   - **Upload Files**: Click or drag files directly into the upload area
   - **Add URLs**: Enter file URLs (one per line) in the URL input field

3. **Review Files**: Check the file list to ensure all desired files are added

4. **Merge**: Click the "Merge Files" button to start processing

5. **Download**: The merged file will automatically download when processing is complete

### URL Considerations

When adding files via URLs:
- URLs must be publicly accessible
- CORS policies may prevent downloads from some domains
- Timeout is set to 30 seconds per file
- Ensure URLs point directly to the file, not a webpage

## Technical Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **SCSS**: Enhanced CSS with variables and mixins
- **File Processing Libraries**:
  - `jszip`: ZIP file creation and manipulation
  - `pdf-merger-js`: PDF file merging
  - `file-saver`: Client-side file downloads
  - `axios`: HTTP requests for URL-based file fetching

## Architecture

### Components

- `App.tsx`: Main application component with state management
- `FileUrlInput.tsx`: URL input component for adding files via URLs
- `FileUpload.tsx`: Drag-and-drop file upload component
- `ProgressTracker.tsx`: Real-time progress display
- `MergeControls.tsx`: File list management and merge controls

### Services

- `fileMergerService.ts`: Core file processing and merging logic

### Styling

- `index.scss`: Main SCSS file with Tailwind imports
- Custom component classes using Tailwind's `@apply` directive
- Responsive design with mobile-first approach

## Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Limitations

- File size limits depend on browser memory
- CORS restrictions may prevent some URL downloads
- PDF merging requires modern browser support for ArrayBuffer
- Processing large files may impact browser performance

## Security Notes

- All processing happens client-side
- No files are uploaded to external servers
- URL-based downloads are subject to CORS policies
- Users should only process files from trusted sources

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Troubleshooting

### Common Issues

**Files won't download from URLs**
- Check if the URL is publicly accessible
- Verify CORS headers on the target server
- Ensure the URL points directly to the file

**Large files cause browser to freeze**
- Consider processing smaller batches
- Close other browser tabs to free memory
- Use a desktop browser for better performance

**PDF merging fails**
- Ensure all files are valid PDFs
- Check that PDFs are not password-protected
- Verify browser supports modern JavaScript features 