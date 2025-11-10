import { useState } from 'react';
import YTDownloader from '../components/digital-tools/YTDownloader';
import QRGenerator from '../components/digital-tools/QRGenerator';
import PasswordGenerator from '../components/digital-tools/PasswordGenerator';
import ColorPicker from '../components/digital-tools/ColorPicker';

const Digital = () => {
  const [activeSection, setActiveSection] = useState('qr-generator');

  const sections = [
    { id: 'qr-generator', label: 'QR Generator', icon: '📱' },
    { id: 'password-generator', label: 'Password Generator', icon: '🔐' },
    { id: 'color-picker', label: 'Color Picker', icon: '🎨' },
    { id: 'yt-downloader', label: 'YouTube Downloader', icon: '�' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'qr-generator':
        return <QRGenerator />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'color-picker':
        return <ColorPicker />;
      case 'yt-downloader':
        return <YTDownloader />;
      default:
        return <QRGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Digital Tools
        </h1>
        
        {/* Section Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Digital;