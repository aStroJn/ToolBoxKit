import { useState } from 'react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState([]);

  const generatePassword = () => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    if (charset === '') {
      alert('Please select at least one character type');
      return;
    }
    
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(newPassword);
    setPasswordHistory(prev => [newPassword, ...prev.slice(0, 4)]);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      alert('Password copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Password copied to clipboard!');
    }
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 8) return { strength: 1, label: 'Weak', color: 'red' };
    if (pwd.length < 10) return { strength: 2, label: 'Fair', color: 'orange' };
    if (pwd.length < 12) return { strength: 3, label: 'Good', color: 'yellow' };
    if (pwd.length < 16) return { strength: 4, label: 'Strong', color: 'green' };
    return { strength: 5, label: 'Very Strong', color: 'darkgreen' };
  };

  const strength = getPasswordStrength(password);
  const hasAllTypes = includeUppercase && includeLowercase && includeNumbers && includeSymbols;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Password Generator
      </h2>

      <div className="space-y-6">
        {/* Password Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Generated Password
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={password}
              readOnly
              placeholder="Click 'Generate Password' to create a secure password"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            />
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg 
                       transition-colors disabled:cursor-not-allowed"
            >
              📋 Copy
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Strength:</span>
                <span className={`text-sm font-semibold text-${strength.color}`}>
                  {strength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    strength.strength <= 1 ? 'bg-red-500' :
                    strength.strength <= 2 ? 'bg-orange-500' :
                    strength.strength <= 3 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(strength.strength / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Password Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password Length: {length} characters
          </label>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>4</span>
            <span>16</span>
            <span>32</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Character Types
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Uppercase Letters (A-Z)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Lowercase Letters (a-z)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Symbols (!@#$%^&*)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Exclude Similar Characters (i, l, 1, L, o, 0, O)</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          🔐 Generate Secure Password
        </button>

        {/* Password History */}
        {passwordHistory.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recent Passwords
            </label>
            <div className="space-y-2">
              {passwordHistory.map((pwd, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <code className="flex-1 text-sm font-mono text-gray-900 dark:text-white truncate">
                    {pwd}
                  </code>
                  <button
                    onClick={() => setPassword(pwd)}
                    className="text-blue-500 hover:text-blue-700 text-xs"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tips */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
            🛡️ Password Security Tips
          </h4>
          <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
            <li>• Use at least 12 characters for strong security</li>
            <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Never reuse passwords across different accounts</li>
            <li>• Use a password manager to store your passwords securely</li>
            <li>• Change passwords regularly, especially for important accounts</li>
            <li>• Enable two-factor authentication when available</li>
          </ul>
        </div>

        {/* Password Strength Indicator */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
            📊 Password Strength Guide
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-blue-700 dark:text-blue-300">Weak: Less than 8 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-blue-700 dark:text-blue-300">Good: 8-12 characters with mixed types</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-blue-700 dark:text-blue-300">Strong: 12+ characters with all types</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
