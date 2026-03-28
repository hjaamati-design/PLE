"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

interface AudioControlProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  visible: boolean;
}

export default function AudioControl({ audioRef, visible }: AudioControlProps) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showSlider, setShowSlider] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted, audioRef]);

  const toggleMute = () => {
    setMuted((m) => !m);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (v === 0) setMuted(true);
    else if (muted) setMuted(false);
  };

  const handleEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowSlider(true);
  };

  const handleLeave = () => {
    hideTimer.current = setTimeout(() => setShowSlider(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      className="audio-control"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="audio-control-btn"
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted || volume === 0 ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : volume < 0.5 ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      <div className={`audio-slider-container${showSlider ? " visible" : ""}`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
          className="audio-slider"
        />
      </div>
    </div>
  );
}
