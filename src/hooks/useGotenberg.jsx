/**
 * useGotenberg Hook
 * Simplified conversion hook for document and image conversions via Gotenberg
 * Handles health checks, file processing, and progress tracking
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  checkGotenbergHealth,
  convertDocument,
  convertImage,
  downloadBlob,
} from '../services/gotenbergService';

const INITIAL_HEALTH = {
  status: 'unknown',
  latencyMs: null,
  message: '',
};

const useGotenberg = (conversionType = 'document') => {
  // Health & Status
  const [isServiceReady, setIsServiceReady] = useState(false);
  const [health, setHealth] = useState(INITIAL_HEALTH);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Conversion State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Queue Management
  const [currentFile, setCurrentFile] = useState(null);
  const [processedFiles, setProcessedFiles] = useState([]);

  const abortControllerRef = useRef(null);

  /**
   * Check service health
   */
  const checkHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const healthInfo = await checkGotenbergHealth();
      setHealth(healthInfo);
      setIsServiceReady(healthInfo.status === 'healthy');
      return healthInfo.status === 'healthy';
    } catch (error) {
      console.error('Health check error:', error);
      setHealth({
        status: 'unreachable',
        latencyMs: null,
        message: error.message,
      });
      setIsServiceReady(false);
      return false;
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  /**
   * Check health on component mount
   */
  useEffect(() => {
    checkHealth();
    // Check health periodically every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  /**
   * Setup abort controller cleanup
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Convert a single file
   */
  const convertFile = useCallback(
    async (file, targetFormat, options = {}) => {
      if (!isServiceReady) {
        throw new Error('Gotenberg service is not ready');
      }

      setIsProcessing(true);
      setProgress(0);
      setError(null);
      setSuccessMessage('');
      setCurrentFile({
        name: file.name,
        format: targetFormat,
        startTime: Date.now(),
      });

      try {
        // Simulate progress updates (Gotenberg doesn't provide real-time progress)
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 20;
          });
        }, 500);

        // Determine conversion function based on type
        let convertedBlob;

        if (conversionType === 'image') {
          convertedBlob = await convertImage(file, targetFormat, options);
        } else {
          convertedBlob = await convertDocument(file, targetFormat, options);
        }

        clearInterval(progressInterval);
        setProgress(100);

        // Create output filename
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const outputFile = new File(
          [convertedBlob],
          `${baseName}.${targetFormat.toLowerCase()}`,
          { type: convertedBlob.type }
        );

        setProcessedFiles((prev) => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}`,
            originalFile: file.name,
            originalSize: file.size,
            outputFile,
            targetFormat,
            convertedSize: convertedBlob.size,
            completedAt: new Date().toISOString(),
            status: 'completed',
            duration: Date.now() - currentFile.startTime,
          },
        ]);

        setSuccessMessage(`✅ Successfully converted: ${file.name}`);

        return outputFile;
      } catch (err) {
        console.error('Conversion error:', err);
        const errorMsg = err.message || 'Conversion failed';
        setError(errorMsg);

        setProcessedFiles((prev) => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}`,
            originalFile: file.name,
            targetFormat,
            status: 'failed',
            error: errorMsg,
            completedAt: new Date().toISOString(),
            duration: Date.now() - currentFile.startTime,
          },
        ]);

        throw err;
      } finally {
        setIsProcessing(false);
        setCurrentFile(null);
        setProgress(0);
      }
    },
    [isServiceReady, conversionType, currentFile]
  );

  /**
   * Convert multiple files sequentially
   */
  const convertFiles = useCallback(
    async (files, targetFormat, options = {}) => {
      if (!files || files.length === 0) {
        throw new Error('No files provided');
      }

      if (!isServiceReady) {
        throw new Error('Gotenberg service is not ready');
      }

      setProcessedFiles([]);
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      for (let i = 0; i < files.length; i++) {
        if (abortController.signal.aborted) {
          throw new Error('Conversion cancelled');
        }

        const file = files[i];

        try {
          const convertedFile = await convertFile(file, targetFormat, options);
          // Auto-download
          downloadBlob(convertedFile, convertedFile.name);
        } catch (error) {
          console.error(`Failed to convert ${file.name}:`, error);
          // Continue with next file even if one fails
        }
      }
    },
    [isServiceReady, convertFile]
  );

  /**
   * Cancel ongoing conversion
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsProcessing(false);
    setProgress(0);
    setCurrentFile(null);
    setError('Conversion cancelled');
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setProcessedFiles([]);
    setError(null);
    setSuccessMessage('');
    setProgress(0);
    setCurrentFile(null);
    setIsProcessing(false);
  }, []);

  /**
   * Clear processed files
   */
  const clearProcessed = useCallback(() => {
    setProcessedFiles([]);
  }, []);

  return {
    // Status
    isServiceReady,
    isCheckingHealth,
    health,

    // Processing State
    isProcessing,
    progress,
    error,
    successMessage,

    // Current Operation
    currentFile,
    processedFiles,

    // Methods
    convertFile,
    convertFiles,
    cancel,
    reset,
    clearProcessed,
    refreshHealth: checkHealth,

    // Helpers
    canConvert: isServiceReady && !isProcessing && !isCheckingHealth,
  };
};

export default useGotenberg;
