import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';

const PAGE_SIZE = 10;

const DriverTable = ({ events }) => {
    const [page, setPage] = useState(0);

    // Always show the newest events first (already sorted that way from the hook)
    const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));

    // When a new event comes in, stay on page 0 so the user always sees the latest
    const currentEvents = events.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    const goToPage = (n) => setPage(Math.max(0, Math.min(n, totalPages - 1)));

    // Event badge styling helpers
    const badgeClass = (event) => {
        if (event.violationTriggered) {
            if (event.severity === 'critical') return 'bg-red-500/20 text-red-400 border border-red-500/30';
            if (event.severity === 'high') return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
            return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        }
        return 'bg-gray-700/60 text-gray-400 border border-gray-700';
    };

    // Friendly driver name lookup (IDs 1-3 are the seeded drivers; fallback to #N)
    const driverName = (id) => {
        const names = { 1: 'John Doe', 2: 'Jane Smith', 3: 'Alan Turing' };
        return names[id] || `Driver #${id}`;
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    Live Event Stream
                    <span className="ml-2 bg-gray-700 text-gray-400 text-xs font-mono px-2 py-0.5 rounded-full">
                        {events.length} events
                    </span>
                </h3>

                {/* Pagination controls */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-mono">
                        Page {page + 1} / {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => { goToPage(0); }}
                            disabled={page === 0}
                            title="First page"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 0}
                            title="Previous page"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Page number pills */}
                        {Array.from({ length: totalPages }).map((_, i) => {
                            // Only show a window of 5 pages around the current one
                            if (totalPages > 7 && Math.abs(i - page) > 2 && i !== 0 && i !== totalPages - 1) {
                                if (i === 1 && page > 3) return <span key={i} className="text-gray-600 text-xs px-1">…</span>;
                                if (i === totalPages - 2 && page < totalPages - 4) return <span key={i} className="text-gray-600 text-xs px-1">…</span>;
                                if (Math.abs(i - page) > 2) return null;
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition
                                        ${page === i
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-gray-500 hover:text-white hover:bg-gray-700'}`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page >= totalPages - 1}
                            title="Next page"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => goToPage(totalPages - 1)}
                            disabled={page >= totalPages - 1}
                            title="Last page"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-700 bg-gray-800/80">
                            <th className="px-6 py-3">#</th>
                            <th className="px-6 py-3">Driver</th>
                            <th className="px-6 py-3">Event</th>
                            <th className="px-6 py-3">Speed</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-600 text-sm italic">
                                    Waiting for incoming telemetry...
                                </td>
                            </tr>
                        ) : currentEvents.map((event, idx) => {
                            const absoluteIdx = page * PAGE_SIZE + idx + 1;
                            const isNew = page === 0 && idx === 0;
                            return (
                                <tr
                                    key={event.id || `${page}-${idx}`}
                                    className={`border-b border-gray-700/40 hover:bg-gray-700/30 transition-colors
                                        ${isNew ? 'bg-blue-500/5' : ''}`}
                                >
                                    {/* Row number */}
                                    <td className="px-6 py-3 text-xs font-mono text-gray-600">{absoluteIdx}</td>

                                    {/* Driver name */}
                                    <td className="px-6 py-3">
                                        <div className="text-sm font-semibold text-gray-200">
                                            {driverName(event.driver_id)}
                                        </div>
                                        <div className="text-xs text-gray-600 font-mono">ID #{event.driver_id}</div>
                                    </td>

                                    {/* Event badge */}
                                    <td className="px-6 py-3">
                                        <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide ${badgeClass(event)}`}>
                                            {event.event_type?.replace(/_/g, ' ')}
                                        </span>
                                    </td>

                                    {/* Speed */}
                                    <td className="px-6 py-3 font-mono text-sm text-blue-300">
                                        {event.speed} <span className="text-gray-600 text-xs">km/h</span>
                                    </td>

                                    {/* Location */}
                                    <td className="px-6 py-3 font-mono text-xs text-gray-500">
                                        {event.location || '—'}
                                    </td>

                                    {/* Timestamp */}
                                    <td className="px-6 py-3 font-mono text-xs text-right text-gray-500">
                                        {new Date(event.timestamp).toLocaleTimeString()}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Pad empty rows if less than PAGE_SIZE (so table height is stable) */}
                        {currentEvents.length < PAGE_SIZE && events.length > 0 && Array.from({
                            length: PAGE_SIZE - currentEvents.length
                        }).map((_, i) => (
                            <tr key={`pad-${i}`} className="border-b border-gray-700/20">
                                <td colSpan="6" className="px-6 py-3">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer summary */}
            <div className="px-6 py-3 border-t border-gray-700 text-xs text-gray-600 font-mono flex justify-between">
                <span>
                    Showing {events.length === 0 ? 0 : page * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE + PAGE_SIZE, events.length)} of {events.length} events
                </span>
                <span>
                    Latest first · auto-updates via WebSocket
                </span>
            </div>
        </div>
    );
};

export default DriverTable;
