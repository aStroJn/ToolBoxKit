const YTDownloadTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'mp4', label: '🎥 MP4 Download', icon: '🎥' },
    { id: 'mp3', label: '🎵 MP3 Download', icon: '🎵' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <span className="mr-2 text-lg">{tab.icon}</span>
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default YTDownloadTabs;