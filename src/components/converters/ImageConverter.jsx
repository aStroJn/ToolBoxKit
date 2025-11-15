import { useRef, useState } from 'react';
import useGotenberg from '../../hooks/useGotenberg';

const SUPPORTED_FORMATS = ['JPG', 'PNG', 'WEBP'];

const ImageConverter = () => {
  const [files, setFiles] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('JPG');
  const [quality, setQuality] = useState(85);
  const fileInputRef = useRef(null);

  const {
    isServiceReady,
    isCheckingHealth,
    health,
    isProcessing,
    progress,
    error,
    successMessage,
    processedFiles,
    currentFile,
    convertFiles,
    cancel,
    reset,
    refreshHealth,
    canConvert,
  } = useGotenberg('image');

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files).filter((file) => file.type.startsWith('image/'));
    if (!selectedFiles.length) return;

    setFiles((prev) => {
      const existing = new Set(prev.map((file) => file.name));
      const unique = selectedFiles.filter((file) => !existing.has(file.name));
      return [...prev, ...unique];
    });
  };

  const removeFile = (index) => {
    if (isProcessing) return;
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    if (isProcessing) return;
    setFiles([]);
  };

  const startConversion = async () => {
    if (!files.length || !canConvert) return;
    try {
      await convertFiles(files, selectedFormat, { quality });
    } catch (conversionError) {
      console.error('Image conversion failed to start:', conversionError);
    }
  };

  const handleCancel = () => {
    cancel();
  };

  const handleReset = () => {
    reset();
    setFiles([]);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🖼️</div>
            <div>
              <h2 className="text-2xl font-bold">Image Converter</h2>
              <p className="text-orange-100">
                Optimized conversions with adjustable quality and production-grade delivery
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  isProcessing ? 'bg-yellow-300' : isServiceReady ? 'bg-green-300' : 'bg-red-300'
                }`}
              />
              <div className="text-sm font-medium text-orange-100">
                {isCheckingHealth && 'Checking service…'}
                {!isCheckingHealth && isServiceReady && 'Service ready'}
                {!isCheckingHealth && !isServiceReady && 'Service offline'}
              </div>
            </div>
            {health.message && (
              <div className="text-xs text-orange-100 mt-1">
                {health.message}
                {typeof health.latencyMs === 'number' ? ` · ${health.latencyMs} ms` : ''}
              </div>
            )}
            {!isServiceReady && !isCheckingHealth && (
              <button
                className="mt-2 text-xs underline text-orange-100 hover:text-white transition-colors"
                onClick={refreshHealth}
              >
                Retry health check
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div
          className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-xl p-8 border-2 border-dashed border-orange-200 dark:border-orange-500/50 hover:border-orange-400 dark:hover:border-orange-400 transition-all duration-300 cursor-pointer"
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {files.length > 0 ? `${files.length} Image${files.length > 1 ? 's' : ''} Selected` : 'Select Image Files'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag & drop photos here or click to upload JPG, PNG, WEBP, or HEIC files
            </p>
            <button
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              onClick={(e) => {
                e.stopPropagation();
                if (!isProcessing) fileInputRef.current?.click();
              }}
              disabled={isProcessing}
            >
              Choose Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,image/heic,image/heif"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Selected Images</h4>
              <button
                onClick={clearFiles}
                disabled={isProcessing}
                className="text-red-500 hover:text-red-700 disabled:text-gray-400 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🖼️</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB · {file.type || 'image'}
                      </p>
                    </div>
                  </div>
                  {!isProcessing && (
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

        <div className="bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-xl p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Output Format</h4>
            <div className="grid grid-cols-3 gap-3">
              {SUPPORTED_FORMATS.map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  disabled={isProcessing}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedFormat === format
                      ? 'border-orange-500 bg-orange-500 text-white shadow-lg transform scale-105'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">🎨</div>
                  <span className="text-sm font-medium">{format}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-inner border border-orange-100 dark:border-orange-700/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">✨</span>
              <h5 className="font-semibold text-gray-900 dark:text-white">Quality</h5>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                disabled={isProcessing}
                className="w-full sm:w-48 accent-orange-500"
              />
              <span className="text-gray-900 dark:text-white w-12 text-right text-sm">{quality}%</span>
            </div>
          </div>
        </div>

        {(isProcessing || processedFiles.length > 0 || successMessage || error) && (
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">Conversion Progress</h4>
              {isProcessing && (
                <button className="text-sm text-red-600 dark:text-red-400 hover:underline" onClick={handleCancel}>
                  Cancel current job
                </button>
              )}
            </div>

            {currentFile && (
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Converting:</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentFile.name} → {currentFile.format}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{Math.round(progress)}% complete</span>
                  <span>Quality {quality}%</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm text-green-700 dark:text-green-300">
                {successMessage}
              </div>
            )}

            {processedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Processed ({processedFiles.length})
                </p>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {processedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`p-3 rounded-lg flex items-center justify-between ${
                        file.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/40'
                          : 'bg-red-100 dark:bg-red-900/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{file.status === 'completed' ? '✅' : '❌'}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {file.originalFile}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {file.status === 'completed' ? 'Downloaded' : file.error || 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={startConversion}
            disabled={!files.length || !canConvert}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Processing…</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Start Conversion</span>
                </>
              )}
            </span>
          </button>

          {(processedFiles.length > 0 || error) && (
            <button
              onClick={handleReset}
              className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:border-red-300 hover:text-red-600 dark:hover:border-red-600 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50"
            >
              Reset Session
            </button>
          )}
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-orange-500 text-xl">ℹ️</span>
            <div>
              <h5 className="font-semibold text-orange-900 dark:text-orange-200 mb-1">Powered by Gotenberg</h5>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Fast, reliable image conversion via Gotenberg service</li>
                <li>• Supports JPG, PNG, and WEBP formats</li>
                <li>• Quality-aware conversion with configurable output quality</li>
                <li>• Automatic local download delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;