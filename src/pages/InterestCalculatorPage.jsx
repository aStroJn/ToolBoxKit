import InterestCalculator from '../components/InterestCalculator';

const InterestCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Interest Calculator
        </h1>
        <InterestCalculator />
      </div>
    </div>
  );
};

export default InterestCalculatorPage;