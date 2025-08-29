import { useState, useRef } from 'react';

const AudioConverter = () => {
  const [files, setFiles] = useState([]);
  const [audioBitrate, setAudioBitrate] = useState('320');
  const [sampleRate, setSampleRate] = useState('44.1');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files).filter(file => 
      file.type.startsWith('audio/')
    );
    setFiles(selectedFiles);
  };

  const simulateConversion = async (file, targetFormat) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFileName = file.name.replace(/\.[^/.]+$/, `.${targetFormat.toLowerCase()}`);
        const fakeAudioBlob = new Blob(['Simulated audio conversion'], { 
          type: `audio/${targetFormat.toLowerCase()}` 
        });
        resolve(new File([fakeAudioBlob], newFileName, { 
          type: `audio/${targetFormat.toLowerCase()}` 
        }));
      }, 1500);
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
        alert('Audio conversion simulation completed. Real conversion requires audio processing libraries.');
      }
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Audio Converter
      </h3>
      
      <div className="space-y-4">
        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-4">🎵</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {files.length > 0 ? `${files.length} audio file(s) selected` : 'Click to select audio files'}
          </p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Select Audio
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Audio:</h4>
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

        {/* Audio Settings */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Audio Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bitrate (kbps)</label>
              <select 
                value={audioBitrate}
                onChange={(e) => setAudioBitrate(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              >
                <option value="320">320 kbps</option>
                <option value="256">256 kbps</option>
                <option value="192">192 kbps</option>
                <option value="128">128 kbps</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Sample Rate (kHz)</label>
              <select 
                value={sampleRate}
                onChange={(e) => setSampleRate(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              >
                <option value="44.1">44.1 kHz</option>
                <option value="48">48 kHz</option>
                <option value="96">96 kHz</option>
              </select>
            </div>
          </div>
        </div>

        {/* Format Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['MP3', 'WAV', 'OGG'].map((format) => (
            <button
              key={format}
              onClick={() => convertFiles(format)}
              disabled={files.length === 0}
              className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              <div className="text-2xl mb-2">🎵</div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                To {format}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center text-yellow-600 dark:text-yellow-400 text-sm">
          Note: Audio conversion is simulated. Real conversion requires audio processing libraries.
        </div>
      </div>
    </div>
  );
};

export default AudioConverter;