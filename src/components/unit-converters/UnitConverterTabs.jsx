const UnitConverterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'length', label: 'Length', icon: '📏' },
    { id: 'mass', label: 'Mass', icon: '⚖️' },
    { id: 'time', label: 'Time', icon: '⏰' },
    { id: 'temperature', label: 'Temperature', icon: '🌡️' },
    { id: 'current', label: 'Current', icon: '⚡' },
    { id: 'substance', label: 'Substance', icon: '🧪' },
    { id: 'luminous', label: 'Luminous', icon: '💡' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
            activeTab === tab.id
              ? 'bg-blue-500 text-white shadow-lg'
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

export default UnitConverterTabs;