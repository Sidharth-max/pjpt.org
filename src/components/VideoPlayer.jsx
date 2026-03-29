import React, { useState, useRef, useCallback, useEffect, forwardRef } from 'react';

const formatTime = (seconds) => {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const MuteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 18L19 19.27 20.27 18 5.27 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);

const VolumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);

const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);

const ExitFullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </svg>
);

const VideoPlayer = forwardRef(function VideoPlayer({ src, className, style, onEnded, autoPlay }, forwardedRef) {
  // Always use this internal ref for controls — never use forwardedRef.current directly
  // because forwardedRef may be a callback ref (function), which has no .current property.
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Attach both the internal ref and the forwarded ref (object or callback) to the video element.
  const setVideoRef = useCallback((node) => {
    videoRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  }, [forwardedRef]);

  // Reset state when src changes. If a play() is in-flight, Chrome throws an
  // unhandled rejection if we pause() or swap src before it settles — absorb it first.
  useEffect(() => {
    const video = videoRef.current;
    if (video && !video.paused) {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {}).finally(() => video.pause());
      } else {
        video.pause();
      }
    }
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setHasError(false);
  }, [src]);

  // Sync fullscreen state from browser events (e.g. user presses Esc)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  const togglePlay = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    if (autoPlay) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [autoPlay]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleSeek = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const val = parseFloat(e.target.value);
    video.currentTime = (val / 100) * video.duration;
    setProgress(val);
  }, []);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleVolume = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    video.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const toggleFullscreen = useCallback((e) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      (container.requestFullscreen?.() ?? container.webkitRequestFullscreen?.())
        ?.catch(() => {});
    } else {
      (document.exitFullscreen?.() ?? document.webkitExitFullscreen?.())
        ?.catch(() => {});
    }
  }, []);

  const currentTime = duration ? (progress / 100) * duration : 0;
  const seekStyle = {
    background: `linear-gradient(to right, #B8960C 0%, #B8960C ${progress}%, rgba(255,255,255,0.3) ${progress}%, rgba(255,255,255,0.3) 100%)`
  };
  const volumeVal = isMuted ? 0 : volume;
  const volumeStyle = {
    background: `linear-gradient(to right, #B8960C 0%, #B8960C ${volumeVal * 100}%, rgba(255,255,255,0.3) ${volumeVal * 100}%, rgba(255,255,255,0.3) 100%)`
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-black text-white/50 text-sm font-cinzel ${className ?? ''}`} style={style}>
        Video unavailable
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative group select-none bg-black"
      onContextMenu={e => e.preventDefault()}
      onClick={togglePlay}
    >
      <video
        ref={setVideoRef}
        src={src}
        className={className}
        style={style}
        playsInline
        preload="metadata"
        controlsList="nodownload nofullscreen"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        onContextMenu={e => e.preventDefault()}
      />

      {/* Controls overlay */}
      <div
        className="absolute bottom-0 inset-x-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pt-6 pb-2 pointer-events-auto">
          {/* Seek bar */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            onClick={e => e.stopPropagation()}
            className="video-seekbar w-full mb-2 cursor-pointer"
            style={seekStyle}
          />

          {/* Bottom controls row */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-gold-light transition-colors flex-shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            {/* Time */}
            <span className="font-cinzel text-[10px] text-white/70 flex-shrink-0 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="text-white hover:text-gold-light transition-colors flex-shrink-0"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MuteIcon /> : <VolumeIcon />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumeVal}
              onChange={handleVolume}
              onClick={e => e.stopPropagation()}
              className="video-seekbar w-16 cursor-pointer hidden sm:block"
              style={volumeStyle}
            />

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gold-light transition-colors flex-shrink-0"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Center play indicator (visible when paused and not hovered) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white group-hover:opacity-0 transition-opacity">
            <PlayIcon />
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoPlayer;
