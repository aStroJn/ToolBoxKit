import { useState } from 'react';
import ConverterTabs from '../components/converters/ConverterTabs';
import DocumentConverter from '../components/converters/DocumentConverter';
import ImageConverter from '../components/converters/ImageConverter';
import VideoConverter from '../components/converters/VideoConverter';
import AudioConverter from '../components/converters/AudioConverter';

const Converter = () => {
  const [activeTab, setActiveTab] = useState('document');

  const renderConverter = () => {
    switch (activeTab) {
      case 'document':
        return <DocumentConverter />;
      case 'image':
        return <ImageConverter />;
      case 'video':
        return <VideoConverter />;
      case 'audio':
        return <AudioConverter />;
      default:
        return <DocumentConverter />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          File Converters
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <ConverterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderConverter()}
        </div>
      </div>
    </div>
  );
};

export default Converter;