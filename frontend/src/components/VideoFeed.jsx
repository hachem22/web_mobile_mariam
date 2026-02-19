import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Camera } from 'lucide-react';

const VideoFeed = ({ src }) => {
    const videoRef = useRef(null);
    const videoSrc = src || "http://192.168.1.11:8080";

    useEffect(() => {
        if (Hls.isSupported() && videoSrc && videoSrc.endsWith('.m3u8')) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoRef.current.play();
            });
            return () => {
                hls.destroy();
            };
        } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl') && videoSrc.endsWith('.m3u8')) {
            videoRef.current.src = videoSrc;
            videoRef.current.addEventListener('loadedmetadata', () => {
                videoRef.current.play();
            });
        }
    }, [videoSrc]);

    const isHttpMjpeg = videoSrc && videoSrc.startsWith('http') && !videoSrc.endsWith('.m3u8');

    return (
        <div className="bg-black rounded-xl overflow-hidden border border-white/5 relative group h-full shadow-inner">
            {isHttpMjpeg ? (
                <img
                    src={videoSrc}
                    className="w-full h-full object-contain"
                    alt="Drone Live Feed"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            ) : videoSrc ? (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    controls={false}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-sea-dark/80 to-transparent"></div>
                    <div className="z-10 flex flex-col items-center animate-pulse">
                        <Camera className="w-12 h-12 text-sea-light/20 mb-3" />
                        <p className="text-sea-light/40 font-mono text-sm uppercase tracking-widest">Signal Perdu</p>
                    </div>
                </div>
            )}

            {/* Static Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            {/* Camera Overlay Info */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-20">
                <span className="bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">REC</span>
                <span className="text-sea-light/80 font-mono text-xs">CAM-01 [DRONE ALPHA]</span>
            </div>
        </div>
    );
};

export default VideoFeed;
