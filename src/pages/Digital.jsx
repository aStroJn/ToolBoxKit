import { useState } from 'react';
import YTDownloader from '../components/digital-tools/YTDownloader';

const Digital = () => {
  const [activeSection, setActiveSection] = useState('yt-downloader');

  const sections = [
    { id: 'yt-downloader', label: 'YouTube Downloader', icon: '📥' },
    { id: 'other-tools', label: 'Other Tools', icon: '🛠️' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'yt-downloader':
        return <YTDownloader />;
      case 'other-tools':
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛠️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              More Digital Tools Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Additional digital tools will be added here in future updates.
            </p>
          </div>
        );
      default:
        return <YTDownloader />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Digital Tools
        </h1>
        
        {/* Section Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-2 text-lg">{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Digital;