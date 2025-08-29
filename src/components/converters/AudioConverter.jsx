const AudioConverter = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Audio Converter
      </h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🎵</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upload audio files to convert between formats
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Select Audio Files
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['MP3', 'WAV', 'FLAC', 'OGG'].map((format) => (
            <div key={format} className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl mb-2">🎵</div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{format}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Audio Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bitrate</label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-gray-400 bg-white dark:bg-gray-800">
                <option>320 kbps</option>
                <option>256 kbps</option>
                <option>192 kbps</option>
                <option>128 kbps</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Sample Rate</label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-gray-400 bg-white dark:bg-gray-800">
                <option>44.1 kHz</option>
                <option>48 kHz</option>
                <option>96 kHz</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioConverter;