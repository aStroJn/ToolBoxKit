const DEFAULT_BASE_URL = import.meta.env.VITE_CONVERSION_API_BASE ?? '/api';

const withBaseUrl = (path) => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${DEFAULT_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn('Failed to parse JSON response', error);
    return {};
  }
};

export const getConversionHealth = async (resourceType) => {
  const url = withBaseUrl(`/conversions/${resourceType}/health`);
  const start = performance.now();
  const response = await fetch(url, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  const data = await parseJsonSafely(response);
  const latencyMs = Math.round(performance.now() - start);

  return {
    status: data.status ?? 'unknown',
    message: data.message ?? '',
    latencyMs,
    limits: data.limits,
  };
};

export const createConversionJob = async (resourceType, payload) => {
  const url = withBaseUrl(`/conversions/${resourceType}/jobs`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    throw new Error(error.message || 'Failed to create conversion job');
  }

  const data = await parseJsonSafely(response);
  if (!data.jobId || !data.uploadUrl || !data.statusUrl) {
    throw new Error('Conversion job response missing required fields');
  }

  return {
    jobId: data.jobId,
    uploadUrl: data.uploadUrl,
    uploadHeaders: data.uploadHeaders ?? {},
    statusUrl: data.statusUrl,
  };
};

export const uploadConversionArtifact = async (uploadUrl, file, headers = {}) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'Content-Length': file.size,
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload conversion artifact (status ${response.status})`);
  }

  return response;
};

export const pollConversionJob = async (statusUrl, signal) => {
  const response = await fetch(statusUrl, {
    method: 'GET',
    credentials: 'include',
    signal,
  });

  if (response.status === 404) {
    throw new Error('Conversion job not found');
  }

  const data = await parseJsonSafely(response);
  return {
    status: data.status ?? 'processing',
    progress: data.progress ?? null,
    downloadUrl: data.downloadUrl,
    error: data.error,
    metadata: data.metadata,
  };
};

export const downloadConversionResult = async (downloadUrl, originalName, targetFormat) => {
  const response = await fetch(downloadUrl, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to download converted file (status ${response.status})`);
  }

  const blob = await response.blob();
  const extension = targetFormat.toLowerCase();
  const cleanedName = originalName.replace(/\.[^/.]+$/, '');
  const filename = `${cleanedName}.${extension}`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

