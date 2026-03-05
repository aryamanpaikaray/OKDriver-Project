import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DriversPage from './pages/DriversPage';
import DriverDetailPage from './pages/DriverDetailPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-900 text-white font-sans">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/drivers" element={<DriversPage />} />
                        <Route path="/drivers/:id" element={<DriverDetailPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
