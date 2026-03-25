"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LoaderProps {
    progress: number;
    allReady: boolean;
    onEnter: () => void;
    onFadeComplete?: () => void;
}

export default function Loader({ progress, allReady, onEnter, onFadeComplete }: LoaderProps) {
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [showEnter, setShowEnter] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    // When ready, reveal the enter button
    useEffect(() => {
        if (allReady) {
            const timer = setTimeout(() => setShowEnter(true), 300);
            return () => clearTimeout(timer);
        }
    }, [allReady]);

    // Fallback: if allReady never becomes true, show enter after 12s anyway
    useEffect(() => {
        const fallback = setTimeout(() => setShowEnter(true), 12000);
        return () => clearTimeout(fallback);
    }, []);

    const handleEnter = () => {
        onEnter();
        setFadeOut(true);
    };

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (fadeOut && e.target === e.currentTarget) {
            setVisible(false);
            onFadeComplete?.();
        }
    };

    if (!visible) return null;

    const rounded = Math.round(progress);

    return (
        <div
            className="loader-overlay"
            style={{ opacity: fadeOut ? 0 : 1 }}
            onTransitionEnd={handleTransitionEnd}
        >
            {/* Stage spotlight cones */}
            <div className="loader-spot loader-spot-left" />
            <div className="loader-spot loader-spot-right" />

            {/* Haze / fog drift */}
            <div className="loader-haze loader-haze-1" />
            <div className="loader-haze loader-haze-2" />

            {/* Center content */}
            <div className={`loader-center${mounted ? " entered" : ""}`}>
                {/* Logo with stage glow */}
                <div className="loader-logo-stage">
                    <div className="loader-logo-flare" />
                    <Image
                        src="/logo.png"
                        alt="PLE Events"
                        width={110}
                        height={110}
                        priority
                        style={{ objectFit: "contain", position: "relative", zIndex: 1 }}
                    />
                </div>

                {/* Tagline */}
                <p className="loader-tagline">L&apos;EXCELLENCE &Eacute;V&Eacute;NEMENTIELLE</p>

                {/* Progress or Enter button */}
                <div className="loader-progress-section">
                    {!showEnter ? (
                        <>
                            <div className="loader-bar-track">
                                <div className="loader-bar-fill" style={{ width: `${rounded}%` }} />
                            </div>
                            <div className="loader-meta">
                                <span className="loader-status">PREPARING THE STAGE</span>
                                <span className="loader-percent">{rounded}%</span>
                            </div>
                        </>
                    ) : (
                        <button className="loader-enter-btn" onClick={handleEnter}>
                            ENTER EXPERIENCE
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
