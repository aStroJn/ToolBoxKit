import { Link } from 'react-router-dom';

const Home = () => {
  const tools = [
    { name: 'Calculator', path: '/calculator', emoji: '🧮' },
    { name: 'Converter', path: '/converter', emoji: '🔄' },
    { name: 'Digital Tools', path: '/digital', emoji: '💻' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Welcome to <a href='/'>ToolsBoxKit</a>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.path}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg 
                       transition-shadow duration-300 transform hover:scale-105 
                       text-center cursor-pointer"
            >
              <div className="text-4xl mb-4">{tool.emoji}</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {tool.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Click to use {tool.name}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;