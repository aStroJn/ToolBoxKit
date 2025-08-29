import { useState, useRef } from 'react';

const ImageConverter = () => {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(85);
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files).filter(file => 
      file.type.startsWith('image/')
    );
    setFiles(selectedFiles);
  };

  const convertImage = async (file, targetFormat, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Conversion failed'));
              return;
            }
            const newFileName = file.name.replace(/\.[^/.]+$/, `.${targetFormat.toLowerCase()}`);
            resolve(new File([blob], newFileName, { type: `image/${targetFormat.toLowerCase()}` }));
          }, `image/${targetFormat.toLowerCase()}`, quality / 100);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const convertFiles = async (targetFormat) => {
    if (files.length === 0) return;

    setConverting(true);
    const conversions = [];

    for (const file of files) {
      try {
        const convertedFile = await convertImage(file, targetFormat, quality);
        conversions.push(convertedFile);
        
        // Download each file immediately
        const url = URL.createObjectURL(convertedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = convertedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Conversion error:', error);
      }
    }

    setConverting(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Image Converter
      </h3>
      
      <div className="space-y-4">
        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {files.length > 0 ? `${files.length} image(s) selected` : 'Click to select images'}
          </p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Select Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Images:</h4>
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

        {/* Quality Slider */}
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <span className="text-gray-900 dark:text-white">Quality:</span>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-32"
          />
          <span className="text-gray-900 dark:text-white w-12 text-right">{quality}%</span>
        </div>

        {/* Format Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['JPG', 'PNG', 'WEBP'].map((format) => (
            <button
              key={format}
              onClick={() => convertFiles(format)}
              disabled={files.length === 0 || converting}
              className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">🖼️</div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {converting ? 'Converting...' : `To ${format}`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;