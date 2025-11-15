/**
 * Gotenberg Service
 * Handles all document and image conversions via Gotenberg API
 * Supports: PDF, DOCX, TXT, HTML (documents) and JPG, PNG, WEBP (images)
 */

const GOTENBERG_URL = import.meta.env.VITE_GOTENBERG_URL || 'http://localhost:3000';

/**
 * Check if Gotenberg service is healthy and accessible
 * @returns {Promise<{status: string, latencyMs: number, version?: string}>}
 */
export const checkGotenbergHealth = async () => {
  const start = performance.now();
  try {
    const response = await fetch(`${GOTENBERG_URL}/health`, {
      method: 'GET',
      credentials: 'include',
    });
    const latencyMs = Math.round(performance.now() - start);

    if (!response.ok) {
      return {
        status: 'unhealthy',
        latencyMs,
        message: `Health check failed with status ${response.status}`,
      };
    }

    return {
      status: 'healthy',
      latencyMs,
      message: 'Gotenberg service is operational',
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      status: 'unreachable',
      latencyMs,
      message: error.message || 'Failed to reach Gotenberg service',
    };
  }
};

/**
 * Convert document to target format using Gotenberg
 * Supported source formats: PDF, DOCX, TXT, HTML, PPTX, XLS
 * Supported target formats: PDF, DOCX, TXT, HTML
 *
 * @param {File} file - The document file to convert
 * @param {string} targetFormat - Target format (PDF, DOCX, TXT, HTML)
 * @param {object} options - Conversion options
 * @returns {Promise<Blob>} - Converted file as Blob
 */
export const convertDocument = async (file, targetFormat, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('files', file);

    // Set target format and options
    const params = new URLSearchParams();
    params.append('outputFormat', targetFormat.toLowerCase());

    // Add optional parameters based on target format
    if (targetFormat.toLowerCase() === 'pdf') {
      params.append('singlePage', options.singlePage === true ? 'true' : 'false');
      params.append('pdfFormat', options.pdfFormat || 'A4');
      params.append('pdfA', options.pdfA === true ? 'true' : 'false');
    }

    let endpoint = `/convert/office`;

    // Choose appropriate Gotenberg endpoint based on output format
    switch (targetFormat.toLowerCase()) {
      case 'pdf':
        endpoint = `/convert/office`;
        break;
      case 'docx':
        // For Office formats, use the Office endpoint
        endpoint = `/convert/office`;
        break;
      case 'html':
        endpoint = `/convert/html`;
        break;
      case 'txt':
      default:
        endpoint = `/convert/office`;
    }

    const url = `${GOTENBERG_URL}${endpoint}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Document conversion failed (${response.status}): ${errorText || response.statusText}`
      );
    }

    const blob = await response.blob();

    // Ensure correct MIME type
    const mimeTypes = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
      html: 'text/html',
    };

    const mimeType = mimeTypes[targetFormat.toLowerCase()] || 'application/octet-stream';

    // Create new blob with correct MIME type if needed
    if (blob.type !== mimeType) {
      return new Blob([blob], { type: mimeType });
    }

    return blob;
  } catch (error) {
    console.error('Document conversion error:', error);
    throw new Error(`Failed to convert document: ${error.message}`);
  }
};

/**
 * Convert image to target format using Gotenberg (via Chromium screenshot)
 * Supports JPG, PNG, WEBP formats
 *
 * @param {File} file - The image file to convert
 * @param {string} targetFormat - Target format (JPG, PNG, WEBP)
 * @param {object} options - Conversion options (quality: 0-100)
 * @returns {Promise<Blob>} - Converted image as Blob
 */
export const convertImage = async (file, targetFormat, options = {}) => {
  try {
    // For image conversion, we'll use Chromium to re-render and export
    // This is the most reliable way with Gotenberg
    const formData = new FormData();

    // Create HTML that displays the image
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; }
          img { max-width: 100%; max-height: 100vh; }
        </style>
      </head>
      <body>
        <img id="img" />
        <script>
          const reader = new FileReader();
          reader.onload = (e) => {
            document.getElementById('img').src = e.target.result;
          };
          // Image data will be injected
        </script>
      </body>
      </html>
    `;

    // Convert image to data URL first
    const reader = new FileReader();
    const imageDataUrl = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Create HTML content with embedded image
    const htmlWithImage = htmlContent.replace(
      '// Image data will be injected',
      `document.getElementById('img').src = '${imageDataUrl}';`
    );

    // Create HTML file for Gotenberg
    const htmlBlob = new Blob([htmlWithImage], { type: 'text/html' });
    const htmlFile = new File([htmlBlob], 'image.html', { type: 'text/html' });

    formData.append('files', htmlFile);

    // Gotenberg screenshot API
    const params = new URLSearchParams();
    const targetFormatLower = targetFormat.toLowerCase();

    switch (targetFormatLower) {
      case 'jpg':
      case 'jpeg':
        params.append('format', 'jpeg');
        params.append('quality', Math.min(Math.max(options.quality || 85, 1), 100));
        break;
      case 'png':
        params.append('format', 'png');
        break;
      case 'webp':
        params.append('format', 'webp');
        params.append('quality', Math.min(Math.max(options.quality || 85, 1), 100));
        break;
      default:
        params.append('format', 'png');
    }

    // Optional: set screenshot dimensions
    if (options.width) params.append('width', options.width);
    if (options.height) params.append('height', options.height);
    if (options.scale) params.append('scale', options.scale);

    const url = `${GOTENBERG_URL}/convert/html?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Image conversion failed (${response.status}): ${errorText || response.statusText}`
      );
    }

    const blob = await response.blob();

    // Ensure correct MIME type
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };

    const mimeType = mimeTypes[targetFormatLower] || 'image/png';

    // Create new blob with correct MIME type if needed
    if (blob.type !== mimeType) {
      return new Blob([blob], { type: mimeType });
    }

    return blob;
  } catch (error) {
    console.error('Image conversion error:', error);
    throw new Error(`Failed to convert image: ${error.message}`);
  }
};

/**
 * Advanced image conversion using direct image API (if available)
 * Falls back to HTML method if direct API not available
 *
 * @param {File} file - The image file to convert
 * @param {string} targetFormat - Target format
 * @param {object} options - Conversion options
 * @returns {Promise<Blob>} - Converted image
 */
export const convertImageDirect = async (file, targetFormat, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams();
    const targetFormatLower = targetFormat.toLowerCase();

    // Set format-specific parameters
    switch (targetFormatLower) {
      case 'jpg':
      case 'jpeg':
        params.append('format', 'jpg');
        params.append('quality', Math.min(Math.max(options.quality || 85, 1), 100));
        break;
      case 'png':
        params.append('format', 'png');
        params.append('compression', options.compression || 6);
        break;
      case 'webp':
        params.append('format', 'webp');
        params.append('quality', Math.min(Math.max(options.quality || 85, 1), 100));
        break;
    }

    if (options.width) params.append('width', options.width);
    if (options.height) params.append('height', options.height);

    const url = `${GOTENBERG_URL}/convert/image?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      // Fall back to HTML method if direct API not available
      console.warn('Direct image conversion not available, falling back to HTML method');
      return convertImage(file, targetFormat, options);
    }

    const blob = await response.blob();

    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };

    const mimeType = mimeTypes[targetFormatLower] || 'image/png';

    if (blob.type !== mimeType) {
      return new Blob([blob], { type: mimeType });
    }

    return blob;
  } catch (error) {
    console.warn('Direct image conversion failed, using HTML method:', error);
    return convertImage(file, targetFormat, options);
  }
};

/**
 * Download a blob as a file
 *
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename to save as
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Get version and capabilities of Gotenberg service
 *
 * @returns {Promise<object>} - Service info
 */
export const getGotenbergInfo = async () => {
  try {
    const response = await fetch(`${GOTENBERG_URL}/health`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return { error: 'Failed to fetch service info' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get Gotenberg info:', error);
    return { error: error.message };
  }
};
