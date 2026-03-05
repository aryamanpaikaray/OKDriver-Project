import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllDrivers } from '../services/api';
import { Users, AlertTriangle, Truck, UserPlus } from 'lucide-react';

const DriversPage = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDrivers = async () => {
            const data = await fetchAllDrivers();
            if (data) setDrivers(data);
            setLoading(false);
        };
        loadDrivers();
    }, []);

    if (loading) return (
        <div className="text-white text-center p-20 font-mono animate-pulse">Loading drivers...</div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8 pb-4 border-b border-gray-800 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Users className="text-blue-500" /> Driver Roster
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage and track individual driver behaviors and risk profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm border border-gray-700 bg-gray-800 px-4 py-2 rounded text-gray-400 font-mono">
                        Fleet: {drivers.length} drivers
                    </span>
                    <button
                        onClick={() => navigate('/drivers/add')}
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                        <UserPlus size={16} /> Add Driver
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map(driver => (
                    <div
                        key={driver.id}
                        className="bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-xl p-6 shadow-lg transition-all flex flex-col"
                    >
                        {/* Top: name + status badge */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{driver.name}</h3>
                                <p className="text-sm text-gray-400 font-mono mt-1 flex items-center gap-2">
                                    <Truck size={14} /> {driver.vehicle_number}
                                </p>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                                ${driver.is_active > 0
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-gray-600/50 text-gray-400 border border-gray-600'}
                            `}>
                                {driver.is_active > 0 ? 'Driving' : 'Off-Duty'}
                            </div>
                        </div>

                        {/* Violations count */}
                        <div className="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-medium block">Violations</span>
                                <span className="text-lg font-bold text-yellow-500 flex items-center gap-2 mt-0.5">
                                    {driver.total_violations} <AlertTriangle size={14} />
                                </span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/drivers/${driver.id}`)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition"
                                >
                                    History
                                </button>
                                <button
                                    onClick={() => navigate(`/drivers/${driver.id}/cockpit`)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                                >
                                    Live Cockpit →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriversPage;
