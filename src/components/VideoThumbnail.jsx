import React from 'react';

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function VideoThumbnail({ src, className, onClick }) {
  return (
    <div className={`relative bg-black flex items-center justify-center cursor-pointer overflow-hidden ${className ?? ''}`} onClick={onClick}>
      <video
        src={src}
        className="w-full h-full object-cover"
        preload="metadata"
        muted
        playsInline
        onContextMenu={e => e.preventDefault()}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
          <PlayIcon />
        </div>
      </div>
    </div>
  );
}
