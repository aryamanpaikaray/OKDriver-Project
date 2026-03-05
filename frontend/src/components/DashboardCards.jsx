import React from 'react';
import { Truck, AlertTriangle, Activity, MapPin } from 'lucide-react';

const Card = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg flex items-center justify-between transition-transform transform hover:scale-105">
        <div>
            <p className="text-gray-400 text-sm font-medium uppercase">{title}</p>
            <div className={`text-3xl font-bold mt-2 ${colorClass}`}>
                {value}
            </div>
        </div>
        <div className={`p-4 rounded-full bg-gray-700 bg-opacity-50 ${colorClass}`}>
            <Icon size={28} />
        </div>
    </div>
);

const DashboardCards = ({ analytics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
                title="Active Drivers"
                value={analytics.activeDrivers}
                icon={Truck}
                colorClass="text-blue-400"
            />
            <Card
                title="Total Trips"
                value={analytics.totalTrips}
                icon={MapPin}
                colorClass="text-green-400"
            />
            <Card
                title="Violations Detected"
                value={analytics.violationCount}
                icon={AlertTriangle}
                colorClass="text-yellow-400"
            />
            <Card
                title="System Risk Score"
                value={parseFloat(analytics.riskScore).toFixed(1)}
                icon={Activity}
                colorClass="text-red-400"
            />
        </div>
    );
};

export default DashboardCards;
