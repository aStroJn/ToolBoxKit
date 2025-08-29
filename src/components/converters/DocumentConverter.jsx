import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DocumentConverter = () => {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const simulateConversion = async (file, targetFormat) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFileName = file.name.replace(/\.[^/.]+$/, `.${targetFormat.toLowerCase()}`);
        resolve(new File([file], newFileName, { type: `application/${targetFormat.toLowerCase()}` }));
      }, 1000);
    });
  };

  const convertFiles = async (targetFormat) => {
    if (files.length === 0) return;

    setConverting(true);
    const zip = new JSZip();
    const conversions = [];

    for (const file of files) {
      const convertedFile = await simulateConversion(file, targetFormat);
      zip.file(convertedFile.name, convertedFile);
      conversions.push(convertedFile);
    }

    if (conversions.length === 1) {
      // Single file download
      saveAs(conversions[0], conversions[0].name);
    } else {
      // Multiple files - download as zip
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, 'converted-documents.zip');
    }

    setConverting(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Document Converter
      </h3>
      
      <div className="space-y-4">
        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {files.length > 0 ? `${files.length} file(s) selected` : 'Click to select document files'}
          </p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Select Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.html"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Files:</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300 truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Format Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['PDF', 'DOCX', 'TXT', 'HTML'].map((format) => (
            <button
              key={format}
              onClick={() => convertFiles(format)}
              disabled={files.length === 0 || converting}
              className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">📝</div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {converting ? 'Converting...' : `To ${format}`}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Convert between document formats (simulated conversion)
        </div>
      </div>
    </div>
  );
};

export default DocumentConverter;