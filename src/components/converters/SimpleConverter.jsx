import { useState, useRef } from 'react';

const SimpleConverter = ({ isVideo = false, isAudio = false }) => {
  const [files, setFiles] = useState([]);
  const [conversionResults, setConversionResults] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setConversionResults([]);
  };

  const handleSimpleConversion = async (file) => {
    // This is a simple "conversion" that just changes the filename
    // In a real app, this would use server-side processing or simpler client-side methods
    return new Promise((resolve) => {
      setTimeout(() => {
        const newName = file.name.replace(/\.[^/.]+$/, '_converted.mp3');
        const blob = new Blob(['Demo content'], { 
          type: isAudio ? 'audio/mpeg' : 'video/mp4' 
        });
        resolve(new File([blob], newName, { type: blob.type }));
      }, 1000);
    });
  };

  const convertFiles = async () => {
    if (files.length === 0) return;

    const newResults = [];
    
    for (const file of files) {
      try {
        const convertedFile = await handleSimpleConversion(file);
        newResults.push({
          originalFile: file,
          convertedFile,
          success: true
        });
      } catch (error) {
        newResults.push({
          originalFile: file,
          error: error.message,
          success: false
        });
      }
    }
    
    setConversionResults(newResults);
  };

  const downloadResult = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const fileType = isVideo ? 'video/*' : 'audio/*';
  const icon = isVideo ? '🎥' : '🎵';
  const title = isVideo ? 'Video Converter' : 'Audio Converter';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title} (Demo Mode)
      </h3>
      
      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ Demo Mode: This is a simplified converter for testing. Real conversions require FFmpeg.wasm loading.
        </p>
      </div>
      
      <div className="space-y-4">
        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-4">{icon}</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {files.length > 0 ? `${files.length} file(s) selected` : `Click to select ${isVideo ? 'videos' : 'audio files'}`}
          </p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Select {isVideo ? 'Videos' : 'Audio'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={fileType}
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

        {/* Convert Button */}
        {files.length > 0 && (
          <button
            onClick={convertFiles}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors font-medium"
          >
            Convert Files (Demo)
          </button>
        )}

        {/* Conversion Results */}
        {conversionResults.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Conversion Results</h4>
            <div className="space-y-2">
              {conversionResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-100 dark:bg-green-800 rounded">
                  <div>
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">
                      {result.originalFile.name}
                    </span>
                    {result.success ? (
                      <span className="ml-2 text-xs text-green-700 dark:text-green-300">✓ Demo Converted</span>
                    ) : (
                      <span className="ml-2 text-xs text-red-700 dark:text-red-300">✗ {result.error}</span>
                    )}
                  </div>
                  {result.success && (
                    <button
                      onClick={() => downloadResult(result.convertedFile)}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleConverter;