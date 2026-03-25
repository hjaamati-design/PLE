"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LoaderProps {
    progress: number;
    allReady: boolean;
    onFadeComplete: () => void;
}

export default function Loader({ progress, allReady, onFadeComplete }: LoaderProps) {
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (allReady) {
            const timer = setTimeout(() => setFadeOut(true), 600);
            return () => clearTimeout(timer);
        }
    }, [allReady]);

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (fadeOut && e.target === e.currentTarget) {
            setVisible(false);
            onFadeComplete();
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

                {/* Progress section */}
                <div className="loader-progress-section">
                    <div className="loader-bar-track">
                        <div className="loader-bar-fill" style={{ width: `${rounded}%` }} />
                    </div>
                    <div className="loader-meta">
                        <span className="loader-status">
                            {rounded < 100 ? "PREPARING THE STAGE" : "SHOWTIME"}
                        </span>
                        <span className="loader-percent">{rounded}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
