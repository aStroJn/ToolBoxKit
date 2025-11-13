import { useMemo, useRef, useState } from 'react';
import useRemoteConversion from '../../hooks/useRemoteConversion';

const SUPPORTED_FORMATS = ['PDF', 'DOCX', 'TXT', 'HTML'];

const DocumentConverter = () => {
  const [files, setFiles] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const fileInputRef = useRef(null);

  const {
    isServiceReady,
    isCheckingHealth,
    health,
    isProcessing,
    progress,
    error,
    conversionQueue,
    currentConversion,
    completedConversions,
    enqueueConversions,
    cancelCurrent,
    resetState,
    refreshHealth,
    canStartConversions,
  } = useRemoteConversion('documents', { pollIntervalMs: 2500 });

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;

    setFiles((prev) => {
      const existingNames = new Set(prev.map((file) => file.name));
      const newFiles = selectedFiles.filter((file) => !existingNames.has(file.name));
      return [...prev, ...newFiles];
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
    if (!files.length || !canStartConversions) return;
    try {
      await enqueueConversions(files, selectedFormat, {});
    } catch (conversionError) {
      console.error('Document conversion failed to start:', conversionError);
    }
  };

  const handleCancel = () => {
    cancelCurrent();
  };

  const handleReset = () => {
    resetState();
    setFiles([]);
  };

  const filesSummary = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        size: file.size,
      })),
    [files],
  );

  const isConverting = isProcessing || conversionQueue.length > 0;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">📚</div>
            <div>
              <h2 className="text-2xl font-bold">Document Converter</h2>
              <p className="text-indigo-100">
                Secure, production-ready conversions across all major document formats
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
              <div className="text-sm font-medium text-indigo-100">
                {isCheckingHealth && 'Checking service…'}
                {!isCheckingHealth && isServiceReady && 'Service ready'}
                {!isCheckingHealth && !isServiceReady && 'Service offline'}
              </div>
            </div>
            {health.message && (
              <div className="text-xs text-indigo-100 mt-1">
                {health.message}
                {typeof health.latencyMs === 'number' ? ` · ${health.latencyMs} ms` : ''}
              </div>
            )}
            {!isServiceReady && !isCheckingHealth && (
              <button
                className="mt-2 text-xs underline text-indigo-100 hover:text-white transition-colors"
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
          className="bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-indigo-900/20 dark:to-sky-900/20 rounded-xl p-8 border-2 border-dashed border-indigo-200 dark:border-indigo-600/50 hover:border-indigo-400 dark:hover:border-indigo-400 transition-all duration-300 cursor-pointer"
          onClick={() => !isConverting && fileInputRef.current?.click()}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🗂️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {files.length > 0
                ? `${files.length} Document${files.length > 1 ? 's' : ''} Selected`
                : 'Select Document Files'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag & drop DOCX, PDF, TXT, or HTML files here or click to browse
            </p>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
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
              accept=".pdf,.doc,.docx,.txt,.html,.rtf,.odt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {filesSummary.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Selected Documents</h4>
              <button
                onClick={clearFiles}
                disabled={isConverting}
                className="text-red-500 hover:text-red-700 disabled:text-gray-400 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {filesSummary.map((file, index) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📄</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
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

        <div className="bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Output Format</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUPPORTED_FORMATS.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                disabled={isConverting}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedFormat === format
                    ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg transform scale-105'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">📝</div>
                <span className="text-sm font-medium">{format}</span>
              </button>
            ))}
          </div>
        </div>

        {(isProcessing || conversionQueue.length > 0 || completedConversions.length > 0 || error) && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">Conversion Progress</h4>
              {isConverting && (
                <button
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  onClick={handleCancel}
                >
                  Cancel current job
                </button>
              )}
            </div>

            {currentConversion && (
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Converting:</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentConversion.file.name} → {currentConversion.targetFormat}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{progress}% complete</span>
                  <span>Job {conversionQueue.length + completedConversions.length}</span>
                </div>
              </div>
            )}

            {conversionQueue.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {conversionQueue.length} file{conversionQueue.length > 1 ? 's' : ''} remaining in queue
              </div>
            )}

            {completedConversions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completed ({completedConversions.length})
                </p>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {completedConversions.map((conversion) => (
                    <div
                      key={conversion.id}
                      className={`p-3 rounded-lg flex items-center justify-between ${
                        conversion.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/40'
                          : 'bg-red-100 dark:bg-red-900/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {conversion.status === 'completed' ? '✅' : '❌'}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {conversion.originalFile.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {conversion.status === 'completed' ? 'Downloaded' : conversion.error || 'Failed'}
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
            disabled={!files.length || !canStartConversions}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              {isConverting ? (
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

          {(completedConversions.length > 0 || error) && (
            <button
              onClick={handleReset}
              className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:border-red-300 hover:text-red-600 dark:hover:border-red-600 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50"
            >
              Reset Session
            </button>
          )}
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-indigo-500 text-xl">ℹ️</span>
            <div>
              <h5 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">Production Features</h5>
              <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                <li>• Secure uploads via signed URLs with server-side queuing</li>
                <li>• Real-time progress with automatic file delivery</li>
                <li>• SLA-backed conversion engines with retry logic</li>
                <li>• Audit-friendly logging per document job</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentConverter;