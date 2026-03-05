import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDriverDetails } from '../services/api';
import { initializeWebSocket } from '../websocket/socket';
import ReactECharts from 'echarts-for-react';
import {
    ArrowLeft, User, Truck, ShieldAlert, Activity,
    Camera, VideoOff, AlertTriangle, CheckCircle, Gauge
} from 'lucide-react';

// ─── Small reusable Severity badge ───────────────────────────────────────────
const SeverityBadge = ({ severity }) => {
    const colors = {
        critical: 'bg-red-500/20 text-red-400 border border-red-500/40',
        high: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
        medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
        low: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${colors[severity] || colors.low}`}>
            {severity}
        </span>
    );
};

// ─── Webcam Panel (reusing LiveVideo logic, but self-contained) ───────────────
const DriverCam = ({ alertEvent }) => {
    const videoRef = useRef(null);
    const [streamError, setStreamError] = useState(false);

    useEffect(() => {
        const start = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch {
                setStreamError(true);
            }
        };
        start();
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    const isSevere = alertEvent && ['critical', 'high'].includes(alertEvent.severity);

    return (
        <div className={`bg-gray-800 border-2 rounded-xl p-4 shadow-lg flex flex-col h-full relative overflow-hidden transition-all duration-300
            ${isSevere ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)]' : 'border-gray-700'}`}>

            {/* Critical / High alert overlay */}
            {isSevere && (
                <div className="absolute inset-0 bg-red-500/15 z-10 pointer-events-none flex items-end justify-center pb-8">
                    <span className="bg-red-600 text-white text-sm font-bold py-2 px-6 rounded-full uppercase animate-pulse tracking-wider">
                        ⚠ {alertEvent.event_type?.replace(/_/g, ' ')}
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                    <Camera size={14} /> Edge AI Dashcam Feed
                </h3>
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE
                </span>
            </div>

            {/* Video / Error */}
            <div className="flex-1 bg-black rounded-lg overflow-hidden relative flex items-center justify-center min-h-0">
                {streamError ? (
                    <div className="text-gray-500 flex flex-col items-center gap-3">
                        <VideoOff size={44} />
                        <p className="text-sm text-center px-4">Camera access denied or unavailable</p>
                    </div>
                ) : (
                    <video ref={videoRef} autoPlay playsInline muted
                        className="w-full h-full object-cover scale-x-[-1]" />
                )}
                {/* HUD timestamp */}
                <div className="absolute top-3 left-3 font-mono text-green-400 text-xs bg-black/60 px-2 py-1 rounded pointer-events-none">
                    REC • 1080P<br />{new Date().toISOString().replace('T', ' ').substring(0, 19)}
                </div>
            </div>
        </div>
    );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center justify-between shadow">
        <div>
            <p className="text-gray-500 text-xs uppercase font-semibold tracking-wide">{label}</p>
            <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-gray-700/60 ${color}`}>
            <Icon size={22} />
        </div>
    </div>
);

// ─── Main DriverDashboard page ────────────────────────────────────────────────
const DriverDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [driverDetails, setDriverDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liveEvents, setLiveEvents] = useState([]);   // events received via WS for this driver
    const [liveAlertEvent, setLiveAlertEvent] = useState(null); // latest severe event for cam overlay

    // ── Initial load from REST ────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            const data = await fetchDriverDetails(id);
            if (data) {
                setDriverDetails(data);
                // seed live events with recent historical events for instant content
                setLiveEvents(data.events.slice(0, 30));
            }
            setLoading(false);
        };
        load();
    }, [id]);

    // ── Live WebSocket feed – filter to THIS driver ───────────────────────────
    useEffect(() => {
        initializeWebSocket((msg) => {
            const { type, payload } = msg;
            if (type === 'NEW_EVENT' && String(payload.driver_id) === String(id)) {
                setLiveEvents(prev => [payload, ...prev].slice(0, 60));

                if (['critical', 'high'].includes(payload.severity)) {
                    setLiveAlertEvent(payload);
                    setTimeout(() => setLiveAlertEvent(null), 4000);
                }
            }
        });
    }, [id]);

    // ── Violation chart by type (from historical data) ────────────────────────
    const violationChartOption = useMemo(() => {
        if (!driverDetails) return {};
        const counts = {};
        driverDetails.violations.forEach(v => {
            counts[v.type] = (counts[v.type] || 0) + 1;
        });

        return {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { top: '10%', left: '5%', right: '5%', bottom: '15%', containLabel: true },
            xAxis: {
                type: 'category',
                data: Object.keys(counts).map(k => k.replace(/_/g, ' ').toUpperCase()),
                axisLabel: { color: '#9ca3af', fontSize: 10 },
                axisLine: { lineStyle: { color: '#374151' } }
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: '#1f2937' } },
                axisLabel: { color: '#9ca3af' }
            },
            series: [{
                type: 'bar',
                data: Object.values(counts),
                barMaxWidth: 50,
                itemStyle: {
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#f97316' },
                            { offset: 1, color: '#dc2626' }
                        ]
                    },
                    borderRadius: [6, 6, 0, 0]
                }
            }]
        };
    }, [driverDetails]);

    // ─────────────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="text-white text-center p-20 animate-pulse text-lg font-mono">
            Loading driver cockpit...
        </div>
    );
    if (!driverDetails) return (
        <div className="text-white text-center p-20 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">Driver not found</h2>
            <button onClick={() => navigate('/drivers')}
                className="px-4 py-2 bg-blue-600 rounded text-white font-medium hover:bg-blue-500 transition">
                Return to Roster
            </button>
        </div>
    );

    const { profile, violations } = driverDetails;

    // Recent live-filtered violations (flag directly from payload)
    const liveViolations = liveEvents.filter(e => e.violationTriggered);
    const recentViolations = violations.slice(0, 20);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Back nav */}
            <button onClick={() => navigate('/drivers')}
                className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 font-medium transition-colors">
                <ArrowLeft size={16} /> Back to Driver Roster
            </button>

            {/* ── Profile header ──────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-8 pb-6 border-b border-gray-800">
                <div className="h-16 w-16 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center shrink-0">
                    <User size={36} className="text-gray-400" />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-white tracking-tight">{profile.name}</h1>
                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1 font-mono">
                        <Truck size={13} className="text-blue-400" /> {profile.vehicle_number}
                        &nbsp;·&nbsp; Joined {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-green-400 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> ON DUTY
                </div>
            </div>

            {/* ── KPI row ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Live Events" value={liveEvents.length} icon={Activity} color="text-blue-400" />
                <StatCard label="Total Violations" value={violations.length} icon={ShieldAlert} color="text-yellow-400" />
                <StatCard label="Live Infractions" value={liveViolations.length} icon={AlertTriangle} color="text-orange-400" />
                <StatCard label="Avg Speed (km/h)"
                    value={liveEvents.length
                        ? Math.round(liveEvents.reduce((s, e) => s + (Number(e.speed) || 0), 0) / liveEvents.length)
                        : '—'}
                    icon={Gauge} color="text-purple-400"
                />
            </div>

            {/* ── Main 3-column grid ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Dashcam (left 1/3) */}
                <div className="h-[420px]">
                    <DriverCam alertEvent={liveAlertEvent} />
                </div>

                {/* Violation bar chart (middle 1/3) */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg h-[420px] flex flex-col">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShieldAlert size={14} className="text-yellow-500" /> Violation Breakdown
                    </h3>
                    {violations.length > 0 ? (
                        <ReactECharts option={violationChartOption} style={{ flex: 1, width: '100%' }} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-3">
                            <CheckCircle size={48} />
                            <p className="text-sm">No violations on record — clean driver!</p>
                        </div>
                    )}
                </div>

                {/* Recent Violation alerts (right 1/3) */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg flex flex-col h-[420px]">
                    <div className="p-5 border-b border-gray-700 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            Warning Alerts
                        </h3>
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-700/50">
                        {recentViolations.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center p-8">No warnings yet.</p>
                        ) : recentViolations.map(v => (
                            <div key={v.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-700/40 transition">
                                <AlertTriangle size={16} className={
                                    v.severity === 'critical' ? 'text-red-500 mt-0.5 shrink-0' :
                                        v.severity === 'high' ? 'text-orange-400 mt-0.5 shrink-0' :
                                            'text-yellow-400 mt-0.5 shrink-0'
                                } />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-semibold truncate capitalize">
                                        {v.type.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {v.speed} km/h · {new Date(v.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <SeverityBadge severity={v.severity} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Live telemetry stream ────────────────────────────────────── */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg flex flex-col h-[360px]">
                <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Live Telemetry Stream
                    </h3>
                    <span className="ml-auto text-xs text-gray-600 font-mono">driver #{id}</span>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-gray-800/90 z-10 shadow">
                            <tr className="text-gray-500 text-xs font-semibold uppercase border-b border-gray-700">
                                <th className="p-4">Behaviour</th>
                                <th className="p-4">Speed</th>
                                <th className="p-4">Coordinates</th>
                                <th className="p-4">Infraction</th>
                                <th className="p-4 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liveEvents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-600 text-sm italic">
                                        Waiting for telemetry data...
                                    </td>
                                </tr>
                            ) : liveEvents.map((e, idx) => (
                                <tr key={e.id || idx}
                                    className={`border-b border-gray-700/40 hover:bg-gray-700/40 transition ${idx === 0 && e.violationTriggered ? 'bg-red-500/5' : ''}`}>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase
                                            ${e.event_type !== 'normal_driving'
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                : 'bg-gray-700/60 text-gray-400'}`}>
                                            {e.event_type?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-sm text-blue-300">{e.speed} km/h</td>
                                    <td className="p-4 font-mono text-xs text-gray-500">{e.location || '—'}</td>
                                    <td className="p-4">
                                        {e.violationTriggered
                                            ? <SeverityBadge severity={e.severity || 'medium'} />
                                            : <CheckCircle size={14} className="text-green-600" />}
                                    </td>
                                    <td className="p-4 font-mono text-xs text-right text-gray-500">
                                        {new Date(e.timestamp).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
