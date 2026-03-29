import React, { useEffect, useRef, useState } from 'react';

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function VideoThumbnail({ src, className, onClick }) {
  const canvasRef = useRef(null);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;

    const video = document.createElement('video');
    video.src = src;
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    const cleanup = () => {
      video.src = '';
      video.load();
    };

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0.1;
    });

    video.addEventListener('seeked', () => {
      if (cancelled) return cleanup();
      const canvas = canvasRef.current;
      if (!canvas) return cleanup();
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCaptured(true);
      cleanup();
    });

    video.addEventListener('error', cleanup);

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [src]);

  return (
    <div className={`relative bg-black flex items-center justify-center cursor-pointer ${className ?? ''}`} onClick={onClick}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ display: captured ? 'block' : 'none' }}
      />
      {!captured && <div className="w-full h-full bg-black" />}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
          <PlayIcon />
        </div>
      </div>
    </div>
  );
}
