import { useState } from 'react';

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [errorLevel, setErrorLevel] = useState('M');
  const [size, setSize] = useState(256);

  const generateQR = () => {
    if (!text.trim()) {
      alert('Please enter some text to generate QR code');
      return;
    }

    // Using QR Server API for demo purposes
    // In production, you'd use a library like qrcode.js
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorLevel}`;
    setQrCode(qrUrl);
  };

  const downloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrcode.png';
    link.click();
  };

  const presetTexts = [
    'https://www.example.com',
    'Hello World!',
    'Contact: email@example.com',
    'WiFi: SSID:MyWiFi, Password:mypassword',
    'Bitcoin: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        QR Code Generator
      </h2>

      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text or URL
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text, URL, or any data to generate QR code..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Preset Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {presetTexts.map((preset, index) => (
              <button
                key={index}
                onClick={() => setText(preset)}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                         px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {preset.length > 20 ? preset.substring(0, 20) + '...' : preset}
              </button>
            ))}
          </div>
        </div>

        {/* QR Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Correction Level
            </label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Size (px)
            </label>
            <select
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={128}>128x128</option>
              <option value={256}>256x256</option>
              <option value={512}>512x512</option>
              <option value={1024}>1024x1024</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateQR}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Generate QR Code
        </button>

        {/* QR Code Display */}
        {qrCode && (
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block shadow-lg">
              <img 
                src={qrCode} 
                alt="Generated QR Code" 
                className="max-w-full h-auto border rounded"
              />
            </div>
            
            <div className="mt-4 space-x-2">
              <button
                onClick={downloadQR}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📥 Download PNG
              </button>
              <button
                onClick={() => setQrCode(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
            💡 QR Code Uses
          </h4>
          <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <li>• Share website URLs and contact information</li>
            <li>• WiFi network credentials for easy sharing</li>
            <li>• Cryptocurrency addresses and payment requests</li>
            <li>• Product information and inventory tracking</li>
            <li>• Event details and calendar invites</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
