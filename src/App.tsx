import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PropertyDetails } from './pages/PropertyDetails';
import { ProposalGenerator } from './pages/ProposalGenerator';
import { LocationAnalysis } from './pages/LocationAnalysis'; // We will create this next

import { Analysis } from './pages/Analysis';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/proposal" element={<ProposalGenerator />} />
          <Route path="/location-analysis" element={<LocationAnalysis />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
