import { useState, useRef, useEffect } from 'react';
import useFFmpeg from '../../hooks/useFFmpeg';

const VideoConverter = () => {
  const [files, setFiles] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('MP4');
  const [conversionQueue, setConversionQueue] = useState([]);
  const [currentConversion, setCurrentConversion] = useState(null);
  const [completedConversions, setCompletedConversions] = useState([]);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const fileInputRef = useRef(null);

  const { 
    isLoaded, 
    isProcessing, 
    progress, 
    log, 
    error, 
    loadFFmpeg, 
    convertFile, 
    downloadFile, 
    reset 
  } = useFFmpeg();

  // Auto-load FFmpeg when component mounts
  useEffect(() => {
    const initializeFFmpeg = async () => {
      if (!isLoaded && !isProcessing) {
        await loadFFmpeg();
        setFFmpegLoaded(true);
      }
    };
    initializeFFmpeg();
  }, [isLoaded, isProcessing, loadFFmpeg]);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files).filter(file => 
      file.type.startsWith('video/')
    );
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setConversionQueue([]);
    setCompletedConversions([]);
    setCurrentConversion(null);
    reset();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const startConversion = async () => {
    if (files.length === 0 || !isLoaded) return;

    // Create conversion queue
    const queue = files.map(file => ({
      file,
      format: selectedFormat,
      id: Date.now() + Math.random()
    }));
    setConversionQueue(queue);
    setCurrentConversion(queue[0]);
    setCompletedConversions([]);

    // Process conversions sequentially
    for (let i = 0; i < queue.length; i++) {
      const conversion = queue[i];
      setCurrentConversion(conversion);

      try {
        const options = getConversionOptions(selectedFormat);
        const convertedFile = await convertFile(conversion.file, selectedFormat, options);
        
        // Add to completed conversions
        setCompletedConversions(prev => [...prev, {
          ...conversion,
          convertedFile,
          timestamp: new Date(),
          status: 'completed'
        }]);

        // Auto-download
        downloadFile(convertedFile);

        // Remove from queue
        setConversionQueue(prev => prev.filter(item => item.id !== conversion.id));

      } catch (conversionError) {
        console.error('Conversion failed:', conversionError);
        setCompletedConversions(prev => [...prev, {
          ...conversion,
          error: conversionError.message,
          timestamp: new Date(),
          status: 'failed'
        }]);
      }
    }

    setCurrentConversion(null);
  };

  const getConversionOptions = (format) => {
    const baseOptions = {
      resolution: '1080p',
      videoBitrate: '2M',
      audioBitrate: '128k',
      videoCodec: 'libx264',
      audioCodec: 'aac'
    };

    switch (format) {
      case 'MP4':
        return {
          ...baseOptions,
          videoCodec: 'libx264',
          audioCodec: 'aac',
          videoBitrate: '2M'
        };
      case 'WEBM':
        return {
          ...baseOptions,
          videoCodec: 'libvpx-vp9',
          audioCodec: 'libopus',
          videoBitrate: '1.5M'
        };
      case 'AVI':
        return {
          ...baseOptions,
          videoCodec: 'libx264',
          audioCodec: 'mp3',
          videoBitrate: '1.5M'
        };
      case 'MOV':
        return {
          ...baseOptions,
          videoCodec: 'libx264',
          audioCodec: 'aac',
          videoBitrate: '2M'
        };
      case 'MKV':
        return {
          ...baseOptions,
          videoCodec: 'libx264',
          audioCodec: 'aac',
          videoBitrate: '2M'
        };
      default:
        return baseOptions;
    }
  };

  const isConverting = isProcessing || conversionQueue.length > 0;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🎬</div>
            <div>
              <h2 className="text-2xl font-bold">Video Converter</h2>
              <p className="text-blue-100">Convert videos to any format with professional quality</p>
            </div>
          </div>
          <div className="text-right">
            {ffmpegLoaded ? (
              <div className="flex items-center space-x-2 text-green-300">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">FFmpeg Ready</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-300">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Loading FFmpeg...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* File Upload Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer"
             onClick={() => !isConverting && fileInputRef.current?.click()}>
          <div className="text-center">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {files.length > 0 ? `${files.length} Video${files.length > 1 ? 's' : ''} Selected` : 'Select Video Files'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag & drop videos here or click to browse
            </p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              onClick={(e) => {
                e.stopPropagation();
                if (!isConverting) fileInputRef.current?.click();
              }}
              disabled={isConverting}
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Selected Videos</h4>
              <button
                onClick={clearAllFiles}
                disabled={isConverting}
                className="text-red-500 hover:text-red-700 disabled:text-gray-400 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🎥</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {!isConverting && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Format Selection */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Output Format</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['MP4', 'WEBM', 'AVI', 'MOV', 'MKV'].map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                disabled={isConverting}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedFormat === format
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">📁</div>
                <span className="text-sm font-medium">{format}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Progress */}
        {(isProcessing || conversionQueue.length > 0 || completedConversions.length > 0) && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Conversion Progress</h4>
            
            {/* Current Conversion */}
            {currentConversion && (
              <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Converting:</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{currentConversion.file.name}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{progress}% complete</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">→ {selectedFormat}</span>
                </div>
              </div>
            )}

            {/* Conversion Queue */}
            {conversionQueue.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {conversionQueue.length} file{conversionQueue.length > 1 ? 's' : ''} remaining
                </p>
              </div>
            )}

            {/* Completed Conversions */}
            {completedConversions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completed ({completedConversions.length})
                </p>
                {completedConversions.map((conversion, index) => (
                  <div key={index} className={`p-3 rounded-lg flex items-center justify-between ${
                    conversion.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {conversion.status === 'completed' ? '✅' : '❌'}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {conversion.file.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {conversion.status === 'completed' ? 'Downloaded' : 'Failed'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span className="text-red-700 dark:text-red-400 font-medium">Error:</span>
            </div>
            <p className="text-red-600 dark:text-red-300 mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* FFmpeg Log */}
        {log && isProcessing && (
          <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xs max-h-40 overflow-y-auto">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-400">🔧</span>
              <span className="text-gray-300">FFmpeg Log:</span>
            </div>
            <pre className="whitespace-pre-wrap">{log}</pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={startConversion}
            disabled={files.length === 0 || !isLoaded || isConverting}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              {isConverting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Start Conversion</span>
                </>
              )}
            </span>
          </button>
          
          {completedConversions.length > 0 && (
            <button
              onClick={clearAllFiles}
              disabled={isConverting}
              className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:border-red-300 hover:text-red-600 dark:hover:border-red-600 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50"
            >
              Clear Results
            </button>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">ℹ️</span>
            <div>
              <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Features</h5>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Real-time conversion progress tracking</li>
                <li>• Supports MP4, WEBM, AVI, MOV, MKV formats</li>
                <li>• Automatic quality optimization</li>
                <li>• Batch conversion support</li>
                <li>• Client-side processing (no upload required)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConverter;