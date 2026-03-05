import React, { useEffect, useRef, useState } from 'react';
import { Camera, VideoOff } from 'lucide-react';

const LiveVideo = ({ alertFlash }) => {
    const videoRef = useRef(null);
    const [streamError, setStreamError] = useState(false);

    useEffect(() => {
        // Attempt to access user's webcam
        const startVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing webcam: ", err);
                setStreamError(true);
            }
        };

        startVideoStream();

        // Cleanup: stop tracks when the component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

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

            <div className="flex-1 bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                {streamError ? (
                    <div className="text-gray-500 flex flex-col items-center gap-2">
                        <VideoOff size={48} />
                        <p className="text-sm">Webcam access denied or unavailable</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                )}

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
