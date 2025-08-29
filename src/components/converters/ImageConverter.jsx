const ImageConverter = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Image Converter
      </h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upload your images to convert between formats
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Upload Images
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['JPG', 'PNG', 'WEBP', 'SVG'].map((format) => (
            <div key={format} className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl mb-2">🖼️</div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{format}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <span className="text-gray-900 dark:text-white">Quality:</span>
          <input 
            type="range" 
            min="1" 
            max="100" 
            defaultValue="85" 
            className="w-32"
          />
          <span className="text-gray-900 dark:text-white">85%</span>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;