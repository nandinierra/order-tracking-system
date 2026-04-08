import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Components
import Navbar from './components/Navbar';

// Pages
import CreateOrder from './pages/CreateOrder';
import OrdersList from './pages/OrdersList';
import OrderDetails from './pages/OrderDetails';

function App() {
  const [hasUnread, setHasUnread] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-[#FDFEFE] selection:bg-indigo-100 selection:text-indigo-700">
        <Toaster position="top-right" />
        <Navbar hasUnread={hasUnread} setHasUnread={setHasUnread} />
        
        <main className="pb-20">
          <Routes>
            <Route 
              path="/" 
              element={<CreateOrder setHasUnread={setHasUnread} />} 
            />
            <Route 
              path="/orders" 
              element={<OrdersList />} 
            />
            <Route 
              path="/order/:id" 
              element={<OrderDetails />} 
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
