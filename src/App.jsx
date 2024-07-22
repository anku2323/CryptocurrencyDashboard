import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CoinDetails from './SearchCrypto/CoinDetails';
import Navbar from './Header/Navbar';
import HomePage from './Home'; // Ensure you have a HomePage component

const AppContent = () => {
  const location = useLocation();
  const isCoinDetailsPage = location.pathname.startsWith('/coin/');

  return (
    <>
      {!isCoinDetailsPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coin/:coinSymbol" element={<CoinDetails />} />
        {/* Add other routes here as needed */}
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;