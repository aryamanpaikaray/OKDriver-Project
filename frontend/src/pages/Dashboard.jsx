import React from 'react';
import DashboardCards from '../components/DashboardCards';
import ViolationsChart from '../components/ViolationsChart';
import RiskScoreChart from '../charts/RiskScoreChart';
import DriverTable from '../components/DriverTable';
import LiveVideo from '../components/LiveVideo';
import { useLiveEvents } from '../hooks/useLiveEvents';
import { ShieldAlert } from 'lucide-react';

const Dashboard = () => {
    const { analytics, events, violations, alertFlash } = useLiveEvents();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                        <ShieldAlert size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Fleet Command Center</h1>
                        <p className="text-gray-400 text-sm">Real-time edge telemetry and AI analytics</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium font-mono text-green-400">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    SYSTEM ONLINE
                </div>
            </header>

            {/* Top Level KPIs */}
            <DashboardCards analytics={analytics} />

            {/* Main Grid: Charts & Dashcam */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ViolationsChart violations={violations} />
                    <RiskScoreChart analytics={analytics} />
                </div>
                <div className="col-span-1 h-[400px]">
                    <LiveVideo alertFlash={alertFlash} />
                </div>
            </div>

            {/* Bottom Grid: Live Event Stream — paginated 10 per page */}
            <div className="h-[560px]">
                <DriverTable events={events} />
            </div>

        </div>
    );
};

export default Dashboard;
