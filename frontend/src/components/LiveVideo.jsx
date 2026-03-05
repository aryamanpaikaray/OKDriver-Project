import React from 'react';
import { Camera } from 'lucide-react';

const LiveVideo = ({ alertFlash }) => {
    return (
        <div className={`bg-gray-800 border-2 rounded-xl p-4 shadow-lg flex flex-col h-full relative overflow-hidden transition-colors duration-500
        ${alertFlash ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-gray-700'}
    `}>
            {/* Alert Overlay */}
            {alertFlash && (
                <div className="absolute inset-0 bg-red-500/20 z-10 pointer-events-none flex items-center justify-center">
                    <span className="bg-red-600 text-white font-bold py-2 px-6 rounded-full uppercase animate-pulse">
                        CRITICAL EVENT: {alertFlash.event_type.replace('_', ' ')}
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium uppercase flex items-center gap-2">
                    <Camera size={16} /> Edge AI Dashcam Feed
                </h3>
                <span className="flex items-center gap-2 text-xs font-semibold text-red-500">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE
                </span>
            </div>

            <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
                {/* Simulated view - embed a youtube video of driving */}
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/8b9YgIeGyyQ?autoplay=1&mute=1&loop=1&playlist=8b9YgIeGyyQ"
                    title="Dashboard Camera"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover"
                ></iframe>

                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 font-mono text-green-400 text-xs bg-black/50 p-2 rounded pointer-events-none">
                    REC • 1080P/60FPS <br />
                    {new Date().toISOString().replace('T', ' ').substring(0, 19)}
                </div>
            </div>
        </div>
    );
};

export default LiveVideo;
