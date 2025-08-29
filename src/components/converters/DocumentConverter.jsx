const DocumentConverter = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Document Converter
      </h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop your document files here or click to browse
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Select Files
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['PDF', 'DOCX', 'TXT', 'HTML'].map((format) => (
            <div key={format} className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{format}</span>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Convert between PDF, Word, Text, and HTML formats
        </div>
      </div>
    </div>
  );
};

export default DocumentConverter;