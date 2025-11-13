import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createConversionJob,
  downloadConversionResult,
  getConversionHealth,
  pollConversionJob,
  uploadConversionArtifact,
} from '../services/conversionService';

const INITIAL_HEALTH = {
  status: 'unknown',
  message: '',
  latencyMs: null,
};

const toFileSummary = (file) => ({
  name: file.name,
  size: file.size,
  type: file.type,
});

const delay = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Conversion cancelled'));
      return;
    }

    let timeoutId;
    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(new Error('Conversion cancelled'));
    };

    timeoutId = setTimeout(() => {
      if (signal) {
        signal.removeEventListener('abort', onAbort);
      }
      resolve();
    }, ms);

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });

const useRemoteConversion = (resourceType, { pollIntervalMs = 3000, maxPollDurationMs = 5 * 60 * 1000 } = {}) => {
  const [isServiceReady, setIsServiceReady] = useState(false);
  const [health, setHealth] = useState(INITIAL_HEALTH);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const [conversionQueue, setConversionQueue] = useState([]);
  const [currentConversion, setCurrentConversion] = useState(null);
  const [completedConversions, setCompletedConversions] = useState([]);

  const abortControllerRef = useRef(null);

  const resetState = useCallback(() => {
    setProgress(0);
    setError(null);
    setConversionQueue([]);
    setCurrentConversion(null);
    setCompletedConversions([]);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const checkServiceHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const healthInfo = await getConversionHealth(resourceType);
      setHealth(healthInfo);
      setIsServiceReady(healthInfo.status === 'healthy');
    } catch (healthError) {
      setHealth({
        status: 'unreachable',
        message: healthError.message || 'Unable to reach conversion service',
        latencyMs: null,
      });
      setIsServiceReady(false);
    } finally {
      setIsCheckingHealth(false);
    }
  }, [resourceType]);

  useEffect(() => {
    checkServiceHealth();
  }, [checkServiceHealth]);

  useEffect(
    () => () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    },
    [],
  );

  const runConversionQueue = useCallback(
    async (queue) => {
      setIsProcessing(true);
      setError(null);
      setProgress(0);
      setConversionQueue(queue);
      setCompletedConversions([]);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const runNext = async (index) => {
        if (index >= queue.length || abortController.signal.aborted) {
          setCurrentConversion(null);
          setIsProcessing(false);
          setProgress(0);
          return;
        }

        const job = queue[index];
        setCurrentConversion(job);

        try {
          const jobMeta = await createConversionJob(resourceType, {
            filename: job.file.name,
            mimeType: job.file.type,
            size: job.file.size,
            targetFormat: job.targetFormat,
            options: job.options ?? {},
          });

          await uploadConversionArtifact(jobMeta.uploadUrl, job.file, jobMeta.uploadHeaders);

          const startTime = Date.now();

          let finished = false;
          while (!finished) {
            if (abortController.signal.aborted) {
              throw new Error('Conversion cancelled');
            }

            const elapsed = Date.now() - startTime;
            if (elapsed > maxPollDurationMs) {
              throw new Error('Conversion timed out');
            }

            const status = await pollConversionJob(jobMeta.statusUrl, abortController.signal);

            if (status.status === 'processing') {
              setProgress(status.progress ?? 0);
              await delay(pollIntervalMs, abortController.signal);
              continue;
            }

            if (status.status === 'failed') {
              throw new Error(status.error || 'Conversion failed');
            }

            if (status.status === 'completed') {
              setProgress(100);

              if (status.downloadUrl) {
                await downloadConversionResult(status.downloadUrl, job.file.name, job.targetFormat);
              }

              setCompletedConversions((prev) => [
                ...prev,
                {
                  id: job.id,
                  originalFile: toFileSummary(job.file),
                  targetFormat: job.targetFormat,
                  completedAt: new Date().toISOString(),
                  status: 'completed',
                },
              ]);

              setConversionQueue((prev) => prev.filter((item) => item.id !== job.id));
              finished = true;
            }
          }

          await runNext(index + 1);
        } catch (jobError) {
          console.error('Conversion job failed:', jobError);
          setError(jobError.message || 'Conversion failed');
          setCompletedConversions((prev) => [
            ...prev,
            {
              id: job.id,
              originalFile: toFileSummary(job.file),
              targetFormat: job.targetFormat,
              completedAt: new Date().toISOString(),
              status: 'failed',
              error: jobError.message,
            },
          ]);
          setConversionQueue((prev) => prev.filter((item) => item.id !== job.id));

          await runNext(index + 1);
        }
      };

      await runNext(0);
      setIsProcessing(false);
      setCurrentConversion(null);
      setProgress(0);
    },
    [resourceType, pollIntervalMs, maxPollDurationMs],
  );

  const enqueueConversions = useCallback(
    async (files, targetFormat, options = {}) => {
      if (!files?.length) return;

      if (!isServiceReady) {
        const serviceError = new Error('Conversion service is not ready');
        setError(serviceError.message);
        throw serviceError;
      }

      const queue = files.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        targetFormat,
        options,
        createdAt: Date.now(),
      }));

      try {
        await runConversionQueue(queue);
      } catch (err) {
        setError(err.message || 'Conversion failed');
        throw err;
      }
    },
    [isServiceReady, runConversionQueue],
  );

  const cancelCurrent = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsProcessing(false);
    setCurrentConversion(null);
    setProgress(0);
    setConversionQueue([]);
  }, []);

  const canStartConversions = useMemo(
    () => isServiceReady && !isProcessing && !isCheckingHealth,
    [isServiceReady, isProcessing, isCheckingHealth],
  );

  return {
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
    refreshHealth: checkServiceHealth,
    canStartConversions,
  };
};

export default useRemoteConversion;

