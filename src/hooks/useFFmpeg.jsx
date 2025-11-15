import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const useFFmpeg = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState('');
  const [error, setError] = useState('');
  const ffmpegRef = useRef(null);
  const loadedRef = useRef(false);

  // Check browser compatibility for FFMPEG.wasm
  const checkBrowserCompatibility = useCallback(() => {
    const issues = [];

    // Check WebAssembly support
    if (typeof WebAssembly === 'undefined') {
      issues.push('WebAssembly is not supported in this browser');
    }

    // Check SharedArrayBuffer support (required for FFMPEG.wasm)
    if (typeof SharedArrayBuffer === 'undefined') {
      issues.push('SharedArrayBuffer is not available. This may be due to missing Cross-Origin-Embedder-Policy headers.');
    } else {
      // Check if SharedArrayBuffer is actually usable (not just defined)
      try {
        const testBuffer = new SharedArrayBuffer(1);
        if (!testBuffer) {
          issues.push('SharedArrayBuffer is defined but not usable');
        }
      } catch (e) {
        issues.push(`SharedArrayBuffer test failed: ${e.message}`);
      }
    }

    return issues;
  }, []);

  const loadFFmpeg = useCallback(async () => {
    if (loadedRef.current && ffmpegRef.current) {
      setIsLoaded(true);
      setLog('FFmpeg already loaded');
      return ffmpegRef.current;
    }

    try {
      setIsProcessing(true);
      setProgress(0);
      setLog('Initializing FFmpeg...');
      setError('');
      
      console.log('Starting FFmpeg load...');

      // Check browser compatibility first
      const compatibilityIssues = checkBrowserCompatibility();
      if (compatibilityIssues.length > 0) {
        const errorMessage = `Browser compatibility issues detected:\n${compatibilityIssues.join('\n')}\n\nPlease ensure your browser supports WebAssembly and SharedArrayBuffer. For SharedArrayBuffer, ensure the site is served with Cross-Origin-Embedder-Policy: require-corp header.`;
        setError(errorMessage);
        setLog(prev => prev + `\n❌ ${errorMessage}`);
        throw new Error(errorMessage);
      }

      setLog('Browser compatibility check passed');
      
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      // Set up progress tracking
      ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg log:', message);
        setLog(prev => {
          const newLog = prev + '\n' + message;
          return newLog.length > 500 ? newLog.slice(-500) : newLog;
        });
      });

      ffmpeg.on('progress', ({ progress: prog }) => {
        const percentage = Math.round(prog * 100);
        setProgress(percentage);
        console.log('FFmpeg progress:', percentage + '%');
      });

      // Try different CDN URLs with fallbacks
      const cdnUrls = [
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm',
        'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/esm',
        'https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.2/dist/esm'
      ];

      let loaded = false;
      let lastError = null;
      const LOAD_TIMEOUT = 30000; // 30 seconds timeout

      // Retry logic with exponential backoff
      const maxRetries = 2;
      for (let retry = 0; retry <= maxRetries && !loaded; retry++) {
        if (retry > 0) {
          const backoffDelay = Math.min(1000 * Math.pow(2, retry - 1), 5000);
          setLog(`Retry attempt ${retry} after ${backoffDelay}ms delay...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }

        for (const baseURL of cdnUrls) {
          try {
            setLog(`Trying to load from ${baseURL}...`);
            console.log(`Loading FFmpeg from: ${baseURL}`);
            
            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('FFmpeg load timeout after 30 seconds')), LOAD_TIMEOUT)
            );

            // Create load promise
            const loadPromise = ffmpeg.load({
              coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
              wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            // Race between load and timeout
            await Promise.race([loadPromise, timeoutPromise]);
            
            loaded = true;
            break;
          } catch (cdnError) {
            console.warn(`Failed to load from ${baseURL}:`, cdnError);
            lastError = cdnError;
            
            // Provide more specific error messages
            let errorMessage = cdnError.message || 'Unknown error';
            if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
              errorMessage = `CORS error: ${errorMessage}. Check Content-Security-Policy and CORS headers.`;
            } else if (errorMessage.includes('CSP') || errorMessage.includes('Content-Security-Policy')) {
              errorMessage = `CSP violation: ${errorMessage}. Ensure 'wasm-unsafe-eval' is in script-src directive.`;
            } else if (errorMessage.includes('timeout')) {
              errorMessage = `Load timeout: ${errorMessage}. Network may be slow or CDN unavailable.`;
            } else if (errorMessage.includes('SharedArrayBuffer')) {
              errorMessage = `SharedArrayBuffer error: ${errorMessage}. Ensure Cross-Origin-Embedder-Policy header is set.`;
            }
            
            setLog(prev => prev + `\nFailed from ${baseURL}: ${errorMessage}`);
          }
        }

        if (loaded) break;
      }

      if (!loaded) {
        const errorMessage = lastError?.message || 'Unknown error';
        let userFriendlyError = `All CDN sources failed after ${maxRetries + 1} attempts. `;
        
        if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
          userFriendlyError += 'This appears to be a CORS issue. Please check your deployment configuration.';
        } else if (errorMessage.includes('CSP') || errorMessage.includes('Content-Security-Policy')) {
          userFriendlyError += 'This appears to be a Content-Security-Policy issue. Ensure "wasm-unsafe-eval" is included in the script-src directive.';
        } else if (errorMessage.includes('SharedArrayBuffer')) {
          userFriendlyError += 'SharedArrayBuffer is required but not available. Ensure Cross-Origin-Embedder-Policy: require-corp header is set.';
        } else {
          userFriendlyError += `Last error: ${errorMessage}`;
        }
        
        throw new Error(userFriendlyError);
      }

      setIsLoaded(true);
      loadedRef.current = true;
      setLog(prev => prev + '\n✅ FFmpeg loaded successfully!');
      console.log('FFmpeg loaded successfully');
      return ffmpeg;
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      const errorMsg = error.message || 'Unknown error';
      setError(`Failed to load FFmpeg: ${errorMsg}`);
      setLog(prev => prev + `\n❌ Error: ${errorMsg}`);
      setIsLoaded(false);
      loadedRef.current = false;
      
      // Don't re-throw, just log the error
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [checkBrowserCompatibility]);

  const convertFile = useCallback(async (inputFile, outputFormat, options = {}) => {
    if (!ffmpegRef.current || !loadedRef.current) {
      throw new Error('FFmpeg is not loaded yet. Please load FFmpeg first.');
    }

    const ffmpeg = ffmpegRef.current;
    setIsProcessing(true);
    setProgress(0);
    setLog(`Starting conversion of ${inputFile.name}...`);
    setError('');

    try {
      // Generate unique filenames to avoid conflicts
      const inputFileName = `input_${Date.now()}.${inputFile.name.split('.').pop()}`;
      const outputFileName = `output_${Date.now()}.${outputFormat.toLowerCase()}`;

      setLog('Writing file to FFmpeg filesystem...');
      
      // Write input file to FFmpeg filesystem
      await ffmpeg.writeFile(inputFileName, await fetchFile(inputFile));

      // Build FFmpeg command based on file type and options
      const isVideo = inputFile.type.startsWith('video/');
      const isAudio = inputFile.type.startsWith('audio/');

      let command = [];
      
      if (isVideo) {
        command = [
          '-i', inputFileName,
          '-c:v', options.videoCodec || 'libx264',
          '-c:a', options.audioCodec || 'aac',
          '-b:v', options.videoBitrate || '1M',
          '-b:a', options.audioBitrate || '128k',
        ];
        
        // Add resolution if specified
        if (options.resolution) {
          const resolutionMap = {
            '1080p': '1920:1080',
            '720p': '1280:720',
            '480p': '854:480',
            '360p': '640:360'
          };
          command.push('-s', resolutionMap[options.resolution] || '1280:720');
        }
        
        command.push(outputFileName);
      } else if (isAudio) {
        command = [
          '-i', inputFileName,
          '-c:a', options.audioCodec || 'libmp3lame',
          '-b:a', `${options.audioBitrate || 128}k`,
          '-ar', options.sampleRate || '44100',
        ];
        command.push(outputFileName);
      } else {
        throw new Error(`Unsupported file type: ${inputFile.type}`);
      }

      setLog(`Converting to ${outputFormat.toUpperCase()}...`);
      console.log('FFmpeg command:', command);
      
      // Execute conversion
      await ffmpeg.exec(command);

      setLog('Reading converted file...');
      
      // Read output file
      const data = await ffmpeg.readFile(outputFileName);
      const outputBlob = new Blob([data.buffer], { 
        type: isVideo ? `video/${outputFormat.toLowerCase()}` : `audio/${outputFormat.toLowerCase()}` 
      });

      // Create output filename
      const baseName = inputFile.name.replace(/\.[^/.]+$/, '');
      const outputFile = new File(
        [outputBlob], 
        `${baseName}.${outputFormat.toLowerCase()}`,
        { type: outputBlob.type }
      );

      setLog('Cleaning up temporary files...');
      
      // Cleanup
      try {
        await ffmpeg.deleteFile(inputFileName);
        await ffmpeg.deleteFile(outputFileName);
      } catch (cleanupError) {
        console.warn('Cleanup warning:', cleanupError);
      }

      setLog('✅ Conversion completed successfully!');
      return outputFile;
    } catch (error) {
      console.error('Conversion error:', error);
      const errorMsg = error.message || 'Unknown conversion error';
      setError(`Conversion failed: ${errorMsg}`);
      setLog(prev => prev + `\n❌ Error: ${errorMsg}`);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const downloadFile = useCallback((file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setLog('');
  }, []);

  return {
    isLoaded,
    isProcessing,
    progress,
    log,
    error,
    loadFFmpeg,
    convertFile,
    downloadFile,
    reset,
  };
};

export default useFFmpeg;