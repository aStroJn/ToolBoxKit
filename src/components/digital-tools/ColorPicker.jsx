import { useState } from 'react';

const ColorPicker = () => {
  const [color, setColor] = useState('#3b82f6');
  const [colorHistory, setColorHistory] = useState([]);
  const [savedColors, setSavedColors] = useState([]);

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    if (s === 0) {
      const gray = Math.round(l * 255);
      return { r: gray, g: gray, b: gray };
    }

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1/3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1/3);

    return { 
      r: Math.round(r * 255), 
      g: Math.round(g * 255), 
      b: Math.round(b * 255) 
    };
  };

  // Generate color palette
  const generatePalette = (baseColor) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [];
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const palette = [];
    
    // Generate different variations
    const variations = [
      { name: 'Light', l: Math.min(hsl.l + 30, 100) },
      { name: 'Dark', l: Math.max(hsl.l - 30, 0) },
      { name: 'Saturated', s: Math.min(hsl.s + 30, 100) },
      { name: 'Desaturated', s: Math.max(hsl.s - 30, 0) },
      { name: 'Complementary', h: (hsl.h + 180) % 360 },
      { name: 'Analogous', h: (hsl.h + 30) % 360 }
    ];
    
    variations.forEach(variation => {
      const newHsl = { h: variation.h ?? hsl.h, s: variation.s ?? hsl.s, l: variation.l ?? hsl.l };
      const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      const hex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`;
      palette.push({ name: variation.name, hex });
    });
    
    return palette;
  };

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const palette = generatePalette(color);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${text} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const saveColor = () => {
    if (savedColors.length >= 12) {
      alert('Maximum 12 colors can be saved');
      return;
    }
    if (!savedColors.includes(color)) {
      setSavedColors([...savedColors, color]);
    }
  };

  const removeSavedColor = (colorToRemove) => {
    setSavedColors(savedColors.filter(c => c !== colorToRemove));
  };

  const presetColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff8000', '#8000ff', '#ff0080', '#80ff00', '#0080ff', '#ff4000'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Color Picker & Palette Generator
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Selection */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pick a Color
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-16 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      setColor(e.target.value);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                />
                <button
                  onClick={saveColor}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  💾 Save Color
                </button>
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Preview
            </label>
            <div 
              className="w-full h-32 rounded-lg border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: color }}
            ></div>
          </div>

          {/* Saved Colors */}
          {savedColors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Saved Colors ({savedColors.length}/12)
              </label>
              <div className="grid grid-cols-6 gap-2">
                {savedColors.map((savedColor, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => setColor(savedColor)}
                      className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 
                               hover:scale-105 transition-transform"
                      style={{ backgroundColor: savedColor }}
                    ></button>
                    <button
                      onClick={() => removeSavedColor(savedColor)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full 
                               text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preset Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Colors
            </label>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((presetColor, index) => (
                <button
                  key={index}
                  onClick={() => setColor(presetColor)}
                  className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 
                           hover:scale-105 transition-transform"
                  style={{ backgroundColor: presetColor }}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Color Information */}
        <div className="space-y-6">
          {/* Color Values */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Values
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">HEX</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-gray-900 dark:text-white">{color.toUpperCase()}</code>
                  <button
                    onClick={() => copyToClipboard(color.toUpperCase())}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    📋
                  </button>
                </div>
              </div>
              
              {rgb && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">RGB</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-gray-900 dark:text-white">
                      rgb({rgb.r}, {rgb.g}, {rgb.b})
                    </code>
                    <button
                      onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
              
              {hsl && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">HSL</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-gray-900 dark:text-white">
                      hsl({hsl.h}°, {hsl.s}%, {hsl.l}%)
                    </code>
                    <button
                      onClick={() => copyToClipboard(`hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generated Palette
            </label>
            <div className="grid grid-cols-2 gap-2">
              {palette.map((paletteColor, index) => (
                <button
                  key={index}
                  onClick={() => setColor(paletteColor.hex)}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg 
                           hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: paletteColor.hex }}
                  ></div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {paletteColor.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {paletteColor.hex.toUpperCase()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Color Theory Info */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
          🎨 Color Theory Basics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <strong>HEX:</strong> Hexadecimal color code used in web design
          </div>
          <div>
            <strong>RGB:</strong> Red, Green, Blue values (0-255 each)
          </div>
          <div>
            <strong>HSL:</strong> Hue, Saturation, Lightness values
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
