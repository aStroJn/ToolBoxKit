import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import SimpleCalculatorPage from './pages/SimpleCalculatorPage';
import InterestCalculatorPage from './pages/InterestCalculatorPage';
import Converter from './pages/Converter';
import Digital from './pages/Digital';
import UnitConverter from './pages/UnitConverter'; 

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/SimpleCalculatorPage" element={<SimpleCalculatorPage />} />
            <Route path="/InterestCalculatorPage" element={<InterestCalculatorPage />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/digital" element={<Digital />} />
            <Route path="/unit-converter" element={<UnitConverter />} /> 
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;