import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DriversPage from './pages/DriversPage';
import DriverDetailPage from './pages/DriverDetailPage';
import DriverDashboard from './pages/DriverDashboard';
import AddDriverPage from './pages/AddDriverPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-900 text-white font-sans">
                <Navbar />
                <main>
                    <Routes>
                        {/* Global fleet dashboard */}
                        <Route path="/" element={<Dashboard />} />

                        {/* Driver roster */}
                        <Route path="/drivers" element={<DriversPage />} />

                        {/* Register new driver */}
                        <Route path="/drivers/add" element={<AddDriverPage />} />

                        {/* Individual driver cockpit dashboard (with webcam + live stream) */}
                        <Route path="/drivers/:id/cockpit" element={<DriverDashboard />} />

                        {/* Deep-dive history / violations detail */}
                        <Route path="/drivers/:id" element={<DriverDetailPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
