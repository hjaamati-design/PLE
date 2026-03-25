"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useTexture, useVideoTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { resolveVideoUrl } from "@/utils/videoUtils";

// ── Timing ──
export const SCREEN_INITIAL_DELAY = 0.8;
export const SCREEN_ANIM_DURATION = 0.4;
export const SCREEN_INTERVAL = 0.5;

// ── Desktop Screen Configs ──
export const DESKTOP_SCREEN_CONFIGS = [
    {
        width: 1.9, height: 0.77,
        x: -2.24, y: -0.15, z: -5.6000000000000005,
        rX: 0, rY: 0, rZ: 0,
        textureUrl: "/ScreenDisplay/front.webm"
    },
    {
        width: 1.7, height: 0.6,
        x: -0.45, y: 2.62, z: -3.35,
        rX: -0.25, rY: 0.1, rZ: 0,
        textureUrl: "/ScreenDisplay/front.webm"
    },
    {
        width: 2.8, height: 1,
        x: -2.51, y: -0.38, z: 0.01,
        rX: -3.14, rY: 1.59, rZ: 3.14,
        textureUrl: "/ScreenDisplay/front.webm"
    },
    {
        width: 1.03, height: 1.37,
        x: -3.09, y: 2.80, z: 0.72,
        rX: 1.65, rY: -1.13, rZ: 0.08,
        textureUrl: "/ScreenDisplay/front.webm"
    },
    { width: 2, height: 1, x: 0, y: 0, z: 1.5, rX: 0, rY: 0, rZ: 0 },
];

// ── Mobile Screen Configs (tune independently via editor) ──
export const MOBILE_SCREEN_CONFIGS = [
    {
        // Screen 1
        width: 1.5, height: 0.6,
        x: -2.15, y: -0.84, z: -5.04,
        rX: 0, rY: 0, rZ: 0,
        textureUrl: "/ScreenDisplay/front.webm"
    },
    {
        // Screen 2
        width: 1.25, height: 0.6,
        x: -0.19, y: 1.98, z: -2.18,
        rX: -0.25, rY: 0.1, rZ: 0,
        textureUrl: "/ScreenDisplay/front.webm"
    },
    {
        // Screen 3
        width: 2.35, height: 0.81,
        x: -1.89, y: -0.25, z: -0.25,
        rX: -3.14, rY: 1.59, rZ: 3.14,
        textureUrl: "/ScreenDisplay/front.webm"
    },
    {
        // Screen 4
        width: 0.46, height: 0.8,
        x: -2.45, y: 1.9, z: 0.07,
        rX: 1.73, rY: -1.17, rZ: 0.08,
        textureUrl: "/ScreenDisplay/front.webm"
    },
    { width: 2, height: 1, x: 0, y: 0, z: 1.5, rX: 0, rY: 0, rZ: 0 },
];

// Backwards compatibility alias
export const SCREEN_CONFIGS = DESKTOP_SCREEN_CONFIGS;

// ══════════════════════════════════════════════════════════════
//  Regular Screen — loads original video texture
//  Unmounted when logo takes over (frees GPU memory)
// ══════════════════════════════════════════════════════════════
function RegularScreen({
    config,
    index,
    revealStarted,
    onRevealed,
}: {
    config: any;
    index: number;
    revealStarted: boolean;
    onRevealed?: () => void;
}) {
    const resolvedUrl = config.textureUrl ? resolveVideoUrl(config.textureUrl) : config.textureUrl;
    const hasNotified = useRef(false);
    const isVideo = resolvedUrl && (resolvedUrl.endsWith(".mp4") || resolvedUrl.endsWith(".webm"));

    const staticTexture = resolvedUrl && !isVideo ? (useTexture(resolvedUrl as string) as THREE.Texture) : null;
    const videoTexture = resolvedUrl && isVideo ? (useVideoTexture(resolvedUrl as string, {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        playsInline: true,
    }) as THREE.Texture) : null;
    const texture = isVideo ? videoTexture : staticTexture;

    const meshRef = useRef<THREE.Mesh>(null!);
    const matRef = useRef<THREE.MeshBasicMaterial>(null!);
    const progress = useRef(0);
    const startTimeRef = useRef<number | null>(null);

    useFrame((state) => {
        if (!meshRef.current || !matRef.current) return;

        if (!revealStarted) {
            meshRef.current.scale.setScalar(0);
            matRef.current.opacity = 0;
            return;
        }

        if (progress.current >= 1) {
            if (!hasNotified.current) {
                hasNotified.current = true;
                onRevealed?.();
            }
            return;
        }

        if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime;

        const myStartTime = SCREEN_INITIAL_DELAY + index * (SCREEN_ANIM_DURATION + SCREEN_INTERVAL);
        const elapsed = state.clock.elapsedTime - startTimeRef.current;
        if (elapsed < myStartTime) return;

        const localTime = elapsed - myStartTime;
        progress.current = Math.min(1, localTime / SCREEN_ANIM_DURATION);
        const t = 1 - Math.pow(1 - progress.current, 3);

        matRef.current.opacity = t * (texture ? 1 : 0.3);
        meshRef.current.scale.setScalar(t);
    });

    return (
        <mesh
            ref={meshRef}
            position={[config.x, config.y, config.z] as any}
            rotation={[config.rX, config.rY, config.rZ] as any}
            scale={0}
        >
            <planeGeometry args={[config.width, config.height] as any} />
            {texture ? (
                <>
                    {/* Dark teal/green "glow" background so it's not empty while video loads */}
                    <meshBasicMaterial color="#002222" transparent opacity={0.5} side={THREE.DoubleSide} />
                    <meshBasicMaterial ref={matRef} map={texture} toneMapped={false} transparent opacity={0} side={THREE.DoubleSide} />
                </>
            ) : (
                <meshBasicMaterial ref={matRef} color="#00ffff" transparent opacity={0} side={THREE.DoubleSide} />
            )}
        </mesh>
    );
}

// ══════════════════════════════════════════════════════════════
//  Logo Screen — loads animated logo, plays once
//  Only mounted when showLogo=true (replaces RegularScreen)
// ══════════════════════════════════════════════════════════════
function LogoScreen({ config }: { config: any }) {
    const logoUrl = resolveVideoUrl("/ScreenDisplay/animatedLogo.webm");
    const logoTexture = useVideoTexture(logoUrl, {
        loop: false,
        muted: true,
        playsInline: true,
        unsuspend: 'canplay'
    }) as THREE.Texture;
    logoTexture.wrapS = THREE.RepeatWrapping;
    logoTexture.repeat.x = -1;
    logoTexture.offset.x = 1;

    return (
        <mesh
            position={[config.x, config.y, config.z] as any}
            rotation={[config.rX, config.rY, config.rZ] as any}
        >
            <planeGeometry args={[config.width, config.height] as any} />
            <meshBasicMaterial map={logoTexture} toneMapped={false} transparent opacity={1} side={THREE.DoubleSide} />
        </mesh>
    );
}

// ══════════════════════════════════════════════════════════════
//  Screens — renders either regular video OR logo, never both
// ══════════════════════════════════════════════════════════════
export default function Screens({ revealStarted = false, onAllRevealed, showLogo = false, isMobile = false }: { revealStarted?: boolean; onAllRevealed?: () => void; showLogo?: boolean; isMobile?: boolean }) {
    const configs = isMobile ? MOBILE_SCREEN_CONFIGS : DESKTOP_SCREEN_CONFIGS;
    const activeConfigs = configs.filter((s: any) => s.active !== false);
    const revealedCount = useRef(0);
    const allDoneNotified = useRef(false);

    const handleScreenRevealed = () => {
        revealedCount.current++;
        if (revealedCount.current >= activeConfigs.length && !allDoneNotified.current) {
            allDoneNotified.current = true;
            onAllRevealed?.();
        }
    };

    return (
        <group>
            {configs.map((s: any, i: number) => {
                if (s.active === false) return null;
                return showLogo ? (
                    <LogoScreen key={`logo_${i}`} config={s} />
                ) : (
                    <RegularScreen key={`screen_${i}`} config={s} index={i} revealStarted={revealStarted} onRevealed={handleScreenRevealed} />
                );
            })}
        </group>
    );
}
