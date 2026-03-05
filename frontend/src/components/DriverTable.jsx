import React from 'react';

const DriverTable = ({ events }) => {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium uppercase">Live Event Stream</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 text-xs border-b border-gray-700">
                            <th className="p-4 font-medium">Driver ID</th>
                            <th className="p-4 font-medium">Event</th>
                            <th className="p-4 font-medium">Speed</th>
                            <th className="p-4 font-medium">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">Waiting for incoming telemetry...</td>
                            </tr>
                        ) : events.map((event, idx) => (
                            <tr
                                key={event.id || idx}
                                className={`border-b border-gray-700 hover:bg-gray-700 transition ${idx === 0 ? 'bg-gray-700/50' : ''}`}
                            >
                                <td className="p-4 text-sm">{event.driver_id}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${event.violationTriggered ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-600/50 text-gray-300'}
                  `}>
                                        {event.event_type.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-mono text-blue-300">{event.speed} km/h</td>
                                <td className="p-4 text-sm text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DriverTable;
