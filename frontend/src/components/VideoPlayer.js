import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import './VideoPlayer.css';

const VideoPlayer = ({ src, poster, autoplay = false, className = '' }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        setIsLoading(true);
        setError(null);

        if (Hls.isSupported()) {
            // Clean up previous HLS instance
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }

            const hls = new Hls({
                enableWorker: false,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            
            hlsRef.current = hls;
            
            hls.loadSource(src);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
                if (autoplay) {
                    video.play().catch(err => {
                        console.log('Autoplay prevented:', err);
                    });
                }
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data);
                if (data.fatal) {
                    setError('Failed to load video');
                    setIsLoading(false);
                }
            });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS support
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                setIsLoading(false);
                if (autoplay) {
                    video.play().catch(err => {
                        console.log('Autoplay prevented:', err);
                    });
                }
            });
        } else {
            setError('HLS is not supported in this browser');
            setIsLoading(false);
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [src, autoplay]);

    if (error) {
        return (
            <div className={`video-player error ${className}`}>
                <div className="error-message">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`video-player ${className}`}>
            {isLoading && (
                <div className="video-loading">
                    <div className="loading-spinner"></div>
                </div>
            )}
            <video
                ref={videoRef}
                controls
                playsInline
                poster={poster}
                className="video-element"
                preload="metadata"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
