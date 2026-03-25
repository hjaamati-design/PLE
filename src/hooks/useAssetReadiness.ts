"use client";

import { useState, useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { resolveVideoUrl } from "@/utils/videoUtils";

// Weight distribution for progress calculation
const WEIGHT_GLB = 40;
const WEIGHT_VIDEO = 35;
const WEIGHT_AUDIO = 15;
const WEIGHT_FONT = 10;

// Safety timeout for video loading (mobile Safari may not fire canplaythrough)
const VIDEO_TIMEOUT_MS = 10000;

export function useAssetReadiness() {
    const { progress: glbProgress } = useProgress();
    const [videoReady, setVideoReady] = useState(false);
    const [audioReady, setAudioReady] = useState(false);
    const [fontReady, setFontReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Preload screen video
    useEffect(() => {
        const url = resolveVideoUrl("/ScreenDisplay/front.webm");
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.src = url;
        videoRef.current = video;

        const onReady = () => setVideoReady(true);
        video.addEventListener("canplaythrough", onReady);

        // Safety timeout — proceed even if canplaythrough never fires
        const timeout = setTimeout(() => setVideoReady(true), VIDEO_TIMEOUT_MS);

        video.load();

        return () => {
            video.removeEventListener("canplaythrough", onReady);
            clearTimeout(timeout);
            video.src = "";
            videoRef.current = null;
        };
    }, []);

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
        (glbProgress / 100) * WEIGHT_GLB +
        (videoReady ? WEIGHT_VIDEO : 0) +
        (audioReady ? WEIGHT_AUDIO : 0) +
        (fontReady ? WEIGHT_FONT : 0);

    const allReady = progress >= 100;

    return { progress, allReady };
}
