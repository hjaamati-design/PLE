"use client";

import { useState, useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";

// Weight distribution (no video — video loads via useVideoTexture inside Canvas)
const WEIGHT_GLB = 55;
const WEIGHT_AUDIO = 30;
const WEIGHT_FONT = 15;

export function useAssetReadiness() {
    const { progress: glbProgress, active: glbActive } = useProgress();
    const [glbReady, setGlbReady] = useState(false);
    const [audioReady, setAudioReady] = useState(false);
    const [fontReady, setFontReady] = useState(false);
    const glbWasActive = useRef(false);

    // Track whether GLB loading was ever active
    useEffect(() => {
        if (glbActive) glbWasActive.current = true;
    }, [glbActive]);

    // Detect GLB readiness (handles both fresh and cached loads)
    useEffect(() => {
        if (glbReady) return;

        // Normal completion: progress hit 100%
        if (glbProgress >= 100) {
            setGlbReady(true);
            return;
        }

        // Cached/instant load: active never became true, progress stayed at 0
        // Wait 200ms to give useProgress a chance to fire, then assume cached
        const timer = setTimeout(() => {
            if (!glbWasActive.current && glbProgress === 0) {
                setGlbReady(true);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [glbProgress, glbReady]);

    // Preload audio
    useEffect(() => {
        const controller = new AbortController();
        fetch("/introSong/intro.mp3", { signal: controller.signal })
            .then(() => setAudioReady(true))
            .catch(() => setAudioReady(true)); // Don't block on audio failure

        return () => controller.abort();
    }, []);

    // Wait for fonts
    useEffect(() => {
        document.fonts.ready.then(() => setFontReady(true));
    }, []);

    // Weighted progress
    const progress =
        (glbReady ? WEIGHT_GLB : (glbProgress / 100) * WEIGHT_GLB) +
        (audioReady ? WEIGHT_AUDIO : 0) +
        (fontReady ? WEIGHT_FONT : 0);

    const allReady = progress >= 100;

    return { progress, allReady };
}
