import { useState } from 'react';
import YTDownloadTabs from './YTDownloadTabs';

const YTDownloader = () => {
  const [activeTab, setActiveTab] = useState('mp4');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Validate YouTube URL
  const isValidYouTubeUrl = (url) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  // Simulate video info fetching
  const fetchVideoInfo = async () => {
    if (!isValidYouTubeUrl(url)) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock video data
    const mockVideoData = {
      title: "Sample YouTube Video",
      duration: "10:30",
      thumbnail: "https://via.placeholder.com/320x180?text=YouTube+Thumbnail",
      qualityOptions: activeTab === 'mp4' 
        ? ['1080p', '720p', '480p', '360p'] 
        : ['320kbps', '256kbps', '192kbps', '128kbps'],
      views: "1.2M views",
      uploadDate: "2 weeks ago"
    };
    
    setVideoInfo(mockVideoData);
    setLoading(false);
  };

  // Simulate download process
  const simulateDownload = async (quality) => {
    setLoading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    // Simulate complete download after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setLoading(false);
      
      // Show success message with educational note
      alert(`Download complete! (${quality})\n\nNote: This is a simulation. Actual YouTube downloading requires server-side processing and compliance with YouTube's Terms of Service.`);
    }, 2000);
  };

  const resetForm = () => {
    setUrl('');
    setVideoInfo(null);
    setDownloadProgress(0);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        YouTube Downloader
      </h2>

      <YTDownloadTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* URL Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          YouTube Video URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={videoInfo ? resetForm : fetchVideoInfo}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {videoInfo ? 'Reset' : 'Fetch'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {downloadProgress > 0 ? `Downloading... ${downloadProgress}%` : 'Fetching video information...'}
          </p>
          {downloadProgress > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Video Information */}
      {videoInfo && !loading && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Video Information
          </h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            <img 
              src={videoInfo.thumbnail} 
              alt="Video thumbnail" 
              className="w-full md:w-48 h-32 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {videoInfo.title}
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Duration: {videoInfo.duration}</p>
                <p>{videoInfo.views} • {videoInfo.uploadDate}</p>
              </div>
            </div>
          </div>

          {/* Quality Options */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Available {activeTab === 'mp4' ? 'Resolutions' : 'Bitrates'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {videoInfo.qualityOptions.map((quality) => (
                <button
                  key={quality}
                  onClick={() => simulateDownload(quality)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg 
                           transition-colors text-sm font-medium"
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Educational Information */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
          ⚠️ Important Information
        </h4>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          This is a simulated YouTube downloader for educational purposes. 
          Actual YouTube video downloading requires:
        </p>
        <ul className="text-yellow-700 dark:text-yellow-300 text-sm mt-2 list-disc list-inside">
          <li>Server-side processing with yt-dlp or similar libraries</li>
          <li>Compliance with YouTube's Terms of Service</li>
          <li>Proper error handling and rate limiting</li>
          <li>Respect for copyright laws</li>
        </ul>
      </div>

      {/* Usage Instructions */}
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
          ℹ️ How It Would Work
        </h4>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          In a real implementation, this component would connect to a backend service 
          that handles the actual YouTube downloading and conversion processes.
        </p>
      </div>
    </div>
  );
};

export default YTDownloader;