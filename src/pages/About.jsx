const About = () => {
  const features = [
    {
      icon: '🧮',
      title: 'Advanced Calculators',
      description: 'From basic arithmetic to complex scientific calculations and financial modeling'
    },
    {
      icon: '🔄',
      title: 'Smart Converters',
      description: 'Convert between units, currencies, and file formats with precision and ease'
    },
    {
      icon: '💻',
      title: 'Digital Utilities',
      description: 'Generate QR codes, passwords, and other digital tools for everyday use'
    },
    {
      icon: '🌙',
      title: 'Dark Mode',
      description: 'Comfortable viewing experience with automatic dark/light mode switching'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Works seamlessly across all devices and screen sizes'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'All processing happens locally in your browser - no data sent to external servers'
    }
  ];

  const technologies = [
    { name: 'React', version: '19.1.1', description: 'Modern UI framework', icon: '⚛️' },
    { name: 'Vite', version: '7.1.2', description: 'Lightning-fast build tool', icon: '⚡' },
    { name: 'Tailwind CSS', version: '3.4.17', description: 'Utility-first styling', icon: '🎨' },
    { name: 'React Router', version: '7.8.2', description: 'Client-side routing', icon: '🛣️' },
    { name: 'JavaScript', version: 'ES2022', description: 'Modern JavaScript', icon: '💛' },
    { name: 'HTML5', version: 'Latest', description: 'Semantic markup', icon: '📄' }
  ];

  const stats = [
    { number: '15+', label: 'Calculator Tools', icon: '🧮' },
    { number: '10+', label: 'Converter Tools', icon: '🔄' },
    { number: '8+', label: 'Digital Utilities', icon: '💻' },
    { number: '100%', label: 'Free & Open Source', icon: '🆓' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">ToolBoxKit</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            ToolBoxKit is your comprehensive collection of free, privacy-focused online tools. 
            Built with modern web technologies to provide fast, reliable, and secure utilities 
            for everyday tasks.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg opacity-90 max-w-4xl mx-auto">
              To provide accessible, powerful, and privacy-focused digital tools that anyone can use 
              without installation, registration, or compromising their data. We believe in the power 
              of open source and the importance of user privacy.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Built With Modern Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-3">
                  <div className="text-2xl mr-3">{tech.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">v{tech.version}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose ToolBoxKit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Registration Required
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Start using any tool immediately without creating accounts or providing personal information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    100% Free Forever
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All tools are completely free to use with no hidden charges, premium features, or limitations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Privacy Protected
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All processing happens locally in your browser. Your data never leaves your device.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Installation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Runs entirely in your web browser. No downloads, installations, or updates required.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cross-Platform
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Works on any device with a web browser - Windows, Mac, Linux, mobile, or tablet.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Open Source
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Built with open source technologies and community contributions. Transparent and auditable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/Support */}
        <section className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Have suggestions for new tools or found a bug? We'd love to hear from you!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/aStroJn/ToolBoxKit"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center"
              >
                <span className="mr-2">📂</span>
                View on GitHub
              </a>
              <a
                href="mailto:contact@toolboxkit.com"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
              >
                <span className="mr-2">📧</span>
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
