import { Link } from 'react-router-dom';

const Home = () => {
  const mainTools = [
    { 
      name: 'Calculators', 
      path: '/calculator', 
      emoji: '🧮',
      description: 'Simple, Scientific, Interest & Financial Calculators',
      color: 'from-blue-500 to-purple-600'
    },
    { 
      name: 'Converters', 
      path: '/converter', 
      emoji: '🔄',
      description: 'File, Unit & Measurement Converters',
      color: 'from-green-500 to-teal-600'
    },
    { 
      name: 'Digital Tools', 
      path: '/digital', 
      emoji: '💻',
      description: 'QR Codes, Passwords, Colors & Text Utilities',
      color: 'from-orange-500 to-red-600'
    },
  ];

  const quickTools = [
    { name: 'Simple Calculator', path: '/SimpleCalculatorPage', emoji: '📔' },
    { name: 'Interest Calculator', path: '/InterestCalculatorPage', emoji: '💰' },
    { name: 'Image Converter', path: '/converter', emoji: '🖼️' },
    { name: 'YouTube Downloader', path: '/digital', emoji: '📥' },
    { name: 'Unit Converter', path: '/unit-converter', emoji: '📏' },
    { name: 'Temperature Converter', path: '/unit-converter', emoji: '🌡️' },
  ];

  const features = [
    { icon: '🌙', title: 'Dark Mode', desc: 'Comfortable viewing in any lighting' },
    { icon: '📱', title: 'Responsive', desc: 'Works on all devices & screen sizes' },
    { icon: '⚡', title: 'Fast & Free', desc: 'No installation required, instant results' },
    { icon: '🔒', title: 'Privacy First', desc: 'All processing happens in your browser' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">ToolBoxKit</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Your ultimate collection of free online tools. Calculate, convert, and create with ease - 
            all in your browser, no downloads required.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center"><span className="mr-1">✓</span> 100% Free</span>
            <span className="flex items-center"><span className="mr-1">✓</span> No Sign-up</span>
            <span className="flex items-center"><span className="mr-1">✓</span> Privacy Protected</span>
          </div>
        </div>

        {/* Main Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Choose Your Tool Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.path}
                className="group block"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-2xl 
                             transition-all duration-300 transform hover:scale-105 cursor-pointer
                             border border-gray-200 dark:border-gray-700">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center mx-auto mb-6`}>
                    <div className="text-3xl">{tool.emoji}</div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Access Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.path}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg 
                         transition-all duration-200 transform hover:scale-105 cursor-pointer
                         text-center border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl mb-2">{tool.emoji}</div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {tool.name}
                </h4>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose ToolBoxKit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md
                         border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Get Started Now</h2>
            <p className="text-lg mb-6 opacity-90">
              Choose a category above or browse all tools to find what you need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/calculator"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Calculators
              </Link>
              <Link
                to="/converter"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Converters
              </Link>
              <Link
                to="/digital"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Digital Tools
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;