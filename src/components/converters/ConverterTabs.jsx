const ConverterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'document', label: '📄 Document' },
    { id: 'image', label: '🖼️ Image',},
    { id: 'video', label: '🎥 Video',},
    { id: 'audio', label: '🎵 Audio',}
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center justify-center px-6 py-2 rounded-lg transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ConverterTabs;