import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDriverDetails } from '../services/api';
import { ArrowLeft, User, Truck, ShieldAlert, Activity, Calendar } from 'lucide-react';

const DriverDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [driverDetails, setDriverDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            const data = await fetchDriverDetails(id);
            if (data) setDriverDetails(data);
            setLoading(false);
        };
        loadDetails();
    }, [id]);

    if (loading) return <div className="text-white text-center p-20 font-mono text-lg animate-pulse">Scanning Driver History...</div>;

    if (!driverDetails) return (
        <div className="text-white text-center p-20 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Driver Profile Not Found</h2>
            <button onClick={() => navigate('/drivers')} className="px-4 py-2 bg-blue-600 rounded text-white font-medium hover:bg-blue-500 transition-colors">Return to Roster</button>
        </div>
    );

    const { profile, events, violations } = driverDetails;

    // Helper functions
    const severityColor = (severity) => {
        if (severity === 'critical') return 'bg-red-500/20 text-red-500 border border-red-500/50';
        if (severity === 'high') return 'bg-orange-500/20 text-orange-400 border border-orange-500/50';
        if (severity === 'medium') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header & Navigation */}
            <button onClick={() => navigate('/drivers')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 font-medium transition-colors">
                <ArrowLeft size={16} /> Back to Driver Roster
            </button>

            {/* Profile Overview Card */}
            <div className="bg-gray-800 border-l-4 border-blue-500 rounded-lg shadow-xl p-8 mb-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="flex gap-6 items-center z-10">
                    <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 shadow-inner">
                        <User size={48} className="text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">{profile.name}</h1>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm font-mono text-gray-400">
                            <span className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded"><Truck size={14} className="text-blue-400" /> {profile.vehicle_number}</span>
                            <span className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded"><Calendar size={14} className="text-green-400" /> Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 z-10 w-full md:w-auto">
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 flex-1 text-center">
                        <p className="text-gray-500 uppercase text-xs font-bold mb-1">Total Infractions</p>
                        <p className="text-3xl font-mono font-bold text-yellow-500 flex justify-center items-center gap-2">
                            {violations.length} <ShieldAlert size={20} />
                        </p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 flex-1 text-center">
                        <p className="text-gray-500 uppercase text-xs font-bold mb-1">Status</p>
                        <p className="text-xl font-bold text-green-400 uppercase tracking-widest mt-2 flex justify-center items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span> Active
                        </p>
                    </div>
                </div>
            </div>

            {/* Split Grids for History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Violations Ledger */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg flex flex-col h-[500px]">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/80 rounded-t-xl">
                        <h3 className="text-white text-md font-bold uppercase tracking-wide flex items-center gap-2">
                            <ShieldAlert className="text-yellow-500" /> Historical Violations
                        </h3>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-gray-800 z-10 shadow-md">
                                <tr className="text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Severity</th>
                                    <th className="p-4">Speed</th>
                                    <th className="p-4">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {violations.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center p-8 text-gray-500 italic">No violations recorded. Excellent track record.</td></tr>
                                ) : violations.map(v => (
                                    <tr key={v.id} className="border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-300">{v.type.replace('_', ' ')}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${severityColor(v.severity)}`}>
                                                {v.severity}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">{v.speed} km/h</td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(v.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Raw Telemetry Log */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg flex flex-col h-[500px]">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/80 rounded-t-xl">
                        <h3 className="text-white text-md font-bold uppercase tracking-wide flex items-center gap-2">
                            <Activity className="text-blue-500" /> Raw Telemetry Stream
                        </h3>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-gray-800 z-10 shadow-md">
                                <tr className="text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
                                    <th className="p-4">Behavior</th>
                                    <th className="p-4">Speed</th>
                                    <th className="p-4">Coordinates</th>
                                    <th className="p-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center p-8 text-gray-500 italic">No telemetry recorded yet.</td></tr>
                                ) : events.map(e => (
                                    <tr key={e.id} className="border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase
                                                ${e.event_type !== 'normal_driving' ? 'text-red-400 bg-red-400/10 border border-red-500/20' : 'text-gray-400 bg-gray-800 border border-gray-700'}
                                            `}>
                                                {e.event_type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-sm text-blue-300">{e.speed} km/h</td>
                                        <td className="p-4 font-mono text-xs text-gray-500">{e.location}</td>
                                        <td className="p-4 font-mono text-xs text-right text-gray-400">{new Date(e.timestamp).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetailPage;
