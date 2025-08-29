import { useState, useRef } from 'react';

const VideoConverter = () => {
  const [files, setFiles] = useState([]);
  const [resolution, setResolution] = useState('1080p');
  const [bitrate, setBitrate] = useState('High');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files).filter(file => 
      file.type.startsWith('video/')
    );
    setFiles(selectedFiles);
  };

  const simulateConversion = async (file, targetFormat) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFileName = file.name.replace(/\.[^/.]+$/, `.${targetFormat.toLowerCase()}`);
        const fakeVideoBlob = new Blob(['Simulated video conversion'], { 
          type: `video/${targetFormat.toLowerCase()}` 
        });
        resolve(new File([fakeVideoBlob], newFileName, { 
          type: `video/${targetFormat.toLowerCase()}` 
        }));
      }, 2000);
    });
  };

  const convertFiles = async (targetFormat) => {
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const convertedFile = await simulateConversion(file, targetFormat);
        
        // Simulated download
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
        alert('Video conversion simulation completed. In a real app, this would use FFmpeg.wasm or server processing.');
      }
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Video Converter
      </h3>
      
      <div className="space-y-4">
        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-4">🎥</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {files.length > 0 ? `${files.length} video(s) selected` : 'Click to select videos'}
          </p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Select Videos
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

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Videos:</h4>
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

        {/* Video Settings */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Video Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Resolution</label>
              <select 
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              >
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bitrate</label>
              <select 
                value={bitrate}
                onChange={(e) => setBitrate(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Format Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['MP4', 'WEBM', 'AVI'].map((format) => (
            <button
              key={format}
              onClick={() => convertFiles(format)}
              disabled={files.length === 0}
              className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              <div className="text-2xl mb-2">🎬</div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                To {format}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center text-yellow-600 dark:text-yellow-400 text-sm">
          Note: Video conversion is simulated. Real conversion requires FFmpeg.wasm or server processing.
        </div>
      </div>
    </div>
  );
};

export default VideoConverter;